import type { ExtractPropTypes, CSSProperties } from 'vue';
import { computed, defineComponent, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
import {
  getStyleStr,
  getPixelRatio,
  rotateWatermark,
  reRendering,
  getFontSize,
  getCanvasFont,
  getContentLines,
} from './utils';
import type { WatermarkFontType, WatermarkFont, WatermarkText, WatermarkContent } from './utils';
import { arrayType, functionType, objectType, someType, withInstall } from '../_util/type';
import { useMutationObserver } from '../_util/hooks/_vueuse/useMutationObserver';
import { initDefaultProps } from '../_util/props-util';
import { useToken } from '../theme/internal';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useProvideWatermark } from './context';

export {
  WatermarkContextKey,
  useProvideWatermark,
  useInjectWatermark,
  usePanelRef,
} from './context';
export type { WatermarkContextProps } from './context';
export type { WatermarkFontType, WatermarkFont, WatermarkText, WatermarkContent };

/**
 * Base size of the canvas, 1 for parallel layout and 2 for alternate layout
 * Only alternate layout is currently supported
 */
const BaseSize = 2;
const FontGap = 3;

export interface WatermarkRef {
  nativeElement: HTMLDivElement | undefined;
}

export const watermarkProps = () => ({
  zIndex: Number,
  rotate: Number,
  width: Number,
  height: Number,
  image: String,
  content: someType<WatermarkContent | WatermarkContent[]>([String, Object, Array]),
  font: objectType<WatermarkFontType>(),
  rootClassName: String,
  gap: arrayType<[number, number]>(),
  /** 子组件是否继承水印（默认 true） */
  inherit: { type: Boolean, default: true },
  offset: arrayType<[number, number]>(),
  /** 当水印被篡改或移除时的回调 */
  onRemove: functionType<() => void>(),
});
export type WatermarkProps = Partial<ExtractPropTypes<ReturnType<typeof watermarkProps>>>;
const Watermark = defineComponent({
  name: 'AWatermark',
  inheritAttrs: false,
  props: initDefaultProps(watermarkProps(), {
    zIndex: 9,
    rotate: -22,
    font: {},
    gap: [100, 100],
  }),
  setup(props, { slots, attrs, expose }) {
    const { configProvider } = useConfigInject('watermark', props);
    const watermarkConfig = computed(() => (configProvider as any).watermark?.value || {});
    // realToken：未变量化的原始 token（Canvas 绘制需要真实字号与颜色，
    // cssVar 模式下 token 值是 var() 字符串，会导致 NaN / 黑色）
    const [, , , realToken] = useToken();
    const containerRef = shallowRef<HTMLDivElement>();
    expose({
      get nativeElement() {
        return containerRef.value;
      },
    });
    const watermarkMap = new Map<HTMLElement, HTMLDivElement>();
    const subElements = shallowRef<Set<HTMLElement>>(new Set());
    const stopObservation = shallowRef(false);
    const gapX = computed(() => props.gap?.[0] ?? 100);
    const gapY = computed(() => props.gap?.[1] ?? 100);
    const gapXCenter = computed(() => gapX.value / 2);
    const gapYCenter = computed(() => gapY.value / 2);
    const offsetLeft = computed(() => props.offset?.[0] ?? gapXCenter.value);
    const offsetTop = computed(() => props.offset?.[1] ?? gapYCenter.value);
    const fontSize = computed(() => props.font?.fontSize ?? Number(realToken.value.fontSizeLG));
    const fontWeight = computed(() => props.font?.fontWeight ?? 'normal');
    const fontStyle = computed(() => props.font?.fontStyle ?? 'normal');
    const fontFamily = computed(() => props.font?.fontFamily ?? 'sans-serif');
    const color = computed(() => props.font?.color ?? realToken.value.colorFill);
    const textAlign = computed<CanvasTextAlign>(() => props.font?.textAlign ?? 'center');
    const mergedFont = computed<Required<WatermarkFontType>>(() => ({
      color: color.value,
      fontSize: fontSize.value,
      fontWeight: fontWeight.value,
      fontStyle: fontStyle.value,
      fontFamily: fontFamily.value,
      textAlign: textAlign.value,
    }));
    const contentLines = computed(() => getContentLines(props.content, mergedFont.value));
    const markStyle = computed(() => {
      const markStyle: CSSProperties = {
        zIndex: props.zIndex ?? 9,
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        backgroundRepeat: 'repeat',
      };

      /** Calculate the style of the offset */
      let positionLeft = offsetLeft.value - gapXCenter.value;
      let positionTop = offsetTop.value - gapYCenter.value;
      if (positionLeft > 0) {
        markStyle.left = `${positionLeft}px`;
        markStyle.width = `calc(100% - ${positionLeft}px)`;
        positionLeft = 0;
      }
      if (positionTop > 0) {
        markStyle.top = `${positionTop}px`;
        markStyle.height = `calc(100% - ${positionTop}px)`;
        positionTop = 0;
      }
      markStyle.backgroundPosition = `${positionLeft}px ${positionTop}px`;

      return markStyle;
    });

    const removeWatermarkFrom = (container: HTMLElement) => {
      const markEle = watermarkMap.get(container);
      if (markEle) {
        markEle.remove();
        watermarkMap.delete(container);
      }
    };

    const destroyWatermark = () => {
      watermarkMap.forEach(markEle => {
        markEle.remove();
      });
      watermarkMap.clear();
    };

    const targetElements = computed<HTMLElement[]>(() => {
      const list: HTMLElement[] = containerRef.value ? [containerRef.value] : [];
      if (props.inherit !== false) {
        subElements.value.forEach(el => {
          if (el && el !== containerRef.value) {
            list.push(el);
          }
        });
      }
      return list;
    });

    const appendWatermarkTo = (container: HTMLElement, base64Url: string, markWidth: number) => {
      if (!container) return;
      stopObservation.value = true;
      let watermarkEle = watermarkMap.get(container);
      if (!watermarkEle) {
        watermarkEle = document.createElement('div');
        watermarkMap.set(container, watermarkEle);
      }
      watermarkEle.setAttribute(
        'style',
        getStyleStr({
          ...markStyle.value,
          backgroundImage: `url('${base64Url}')`,
          backgroundSize: `${(gapX.value + markWidth) * BaseSize}px`,
        }),
      );
      // Prevents using browser `Hide Element` to hide watermarks
      watermarkEle.removeAttribute('class');
      watermarkEle.removeAttribute('hidden');
      if (watermarkEle.parentElement !== container) {
        container.append(watermarkEle);
      }
      // Delayed execution
      setTimeout(() => {
        stopObservation.value = false;
      });
    };

    const appendWatermark = (base64Url: string, markWidth: number) => {
      const activeSet = new Set(targetElements.value);
      // Remove watermark from elements no longer targeted (e.g. inherit flipped to false)
      watermarkMap.forEach((_ele, holder) => {
        if (!activeSet.has(holder)) {
          removeWatermarkFrom(holder);
        }
      });
      targetElements.value.forEach(holder => {
        appendWatermarkTo(holder, base64Url, markWidth);
      });
    };

    /**
     * Get the width and height of the watermark. The default values are as follows
     * Image: [120, 64]; Content: It's calculated by content;
     */
    const getMarkSize = (ctx: CanvasRenderingContext2D) => {
      let defaultWidth = 120;
      let defaultHeight = 64;
      const image = props.image;
      const width = props.width;
      const height = props.height;
      if (!image && ctx.measureText) {
        if (contentLines.value.length) {
          const sizes = contentLines.value.map(({ text, font: lineFont }) => {
            ctx.font = getCanvasFont(lineFont);
            const metrics = ctx.measureText(text);
            const lineHeight =
              typeof metrics.fontBoundingBoxAscent === 'number' &&
              typeof metrics.fontBoundingBoxDescent === 'number'
                ? metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
                : Number(lineFont.fontSize);
            return [metrics.width, lineHeight] as const;
          });
          defaultWidth = Math.ceil(Math.max(...sizes.map(s => s[0])));
          defaultHeight =
            Math.ceil(sizes.reduce((total, s) => total + s[1], 0)) +
            (contentLines.value.length - 1) * FontGap;
        } else {
          defaultWidth = 0;
          defaultHeight = 0;
        }
      }
      return [width ?? defaultWidth, height ?? defaultHeight] as const;
    };
    const fillTexts = (
      ctx: CanvasRenderingContext2D,
      drawX: number,
      drawY: number,
      drawWidth: number,
      drawHeight: number,
    ) => {
      const ratio = getPixelRatio();
      ctx.textBaseline = 'top';
      ctx.translate(drawWidth / 2, 0);
      let top = drawY;
      contentLines.value.forEach(({ text, font: lineFont }) => {
        const lineFontSize = getFontSize(lineFont, ratio);
        ctx.font = getCanvasFont(lineFont, ratio, drawHeight);
        ctx.fillStyle = lineFont.color;
        ctx.textAlign = lineFont.textAlign;
        ctx.fillText(text, drawX, top);
        top += lineFontSize + FontGap * ratio;
      });
    };
    const renderWatermark = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = props.image;
      const rotate = props.rotate ?? -22;

      if (ctx) {
        const ratio = getPixelRatio();
        const [markWidth, markHeight] = getMarkSize(ctx);
        const canvasWidth = (gapX.value + markWidth) * ratio;
        const canvasHeight = (gapY.value + markHeight) * ratio;
        canvas.setAttribute('width', `${canvasWidth * BaseSize}px`);
        canvas.setAttribute('height', `${canvasHeight * BaseSize}px`);

        const drawX = (gapX.value * ratio) / 2;
        const drawY = (gapY.value * ratio) / 2;
        const drawWidth = markWidth * ratio;
        const drawHeight = markHeight * ratio;
        const rotateX = (drawWidth + gapX.value * ratio) / 2;
        const rotateY = (drawHeight + gapY.value * ratio) / 2;
        /** Alternate drawing parameters */
        const alternateDrawX = drawX + canvasWidth;
        const alternateDrawY = drawY + canvasHeight;
        const alternateRotateX = rotateX + canvasWidth;
        const alternateRotateY = rotateY + canvasHeight;

        ctx.save();
        rotateWatermark(ctx, rotateX, rotateY, rotate);

        if (image) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
            /** Draw interleaved pictures after rotation */
            ctx.restore();
            rotateWatermark(ctx, alternateRotateX, alternateRotateY, rotate);
            ctx.drawImage(img, alternateDrawX, alternateDrawY, drawWidth, drawHeight);
            appendWatermark(canvas.toDataURL(), markWidth);
          };
          img.onerror = () => {
            fillTexts(ctx, drawX, drawY, drawWidth, drawHeight);
            ctx.restore();
            rotateWatermark(ctx, alternateRotateX, alternateRotateY, rotate);
            fillTexts(ctx, alternateDrawX, alternateDrawY, drawWidth, drawHeight);
            appendWatermark(canvas.toDataURL(), markWidth);
          };
          img.crossOrigin = 'anonymous';
          img.referrerPolicy = 'no-referrer';
          img.src = image;
        } else {
          fillTexts(ctx, drawX, drawY, drawWidth, drawHeight);
          /** Fill the interleaved text after rotation */
          ctx.restore();
          rotateWatermark(ctx, alternateRotateX, alternateRotateY, rotate);
          fillTexts(ctx, alternateDrawX, alternateDrawY, drawWidth, drawHeight);
          appendWatermark(canvas.toDataURL(), markWidth);
        }
      }
    };

    // Provide WatermarkContext so nested portals (Modal, Drawer, custom usePanelRef)
    // inherit the watermark when `inherit` is true, and skip when `inherit` is false.
    useProvideWatermark({
      add: (ele: HTMLElement) => {
        if (!ele || subElements.value.has(ele)) return;
        const next = new Set(subElements.value);
        next.add(ele);
        subElements.value = next;
      },
      remove: (ele: HTMLElement) => {
        if (!ele) return;
        removeWatermarkFrom(ele);
        if (!subElements.value.has(ele)) return;
        const next = new Set(subElements.value);
        next.delete(ele);
        subElements.value = next;
      },
    });

    onMounted(() => {
      renderWatermark();
    });
    watch(
      () => [props, realToken.value.colorFill, realToken.value.fontSizeLG, targetElements.value],
      () => {
        renderWatermark();
      },
      {
        deep: true,
        flush: 'post',
      },
    );
    onBeforeUnmount(() => {
      destroyWatermark();
    });
    const onMutate = (mutations: MutationRecord[]) => {
      if (stopObservation.value) {
        return;
      }
      const isTargetWatermark = mutations.some(mutation =>
        Array.from(watermarkMap.values()).some(wm => reRendering(mutation, wm)),
      );
      if (isTargetWatermark) {
        props.onRemove?.();
        destroyWatermark();
        renderWatermark();
      }
    };
    useMutationObserver(containerRef, onMutate, {
      attributes: true,
      subtree: true,
      childList: true,
      attributeFilter: ['style', 'class', 'hidden'],
    });
    return () => {
      return (
        <div
          {...attrs}
          ref={containerRef}
          class={[attrs.class, watermarkConfig.value.className, props.rootClassName]}
          style={[
            { position: 'relative' },
            watermarkConfig.value.style as CSSProperties,
            attrs.style as CSSProperties,
          ]}
        >
          {slots.default?.()}
        </div>
      );
    };
  },
});

export default withInstall(Watermark);
