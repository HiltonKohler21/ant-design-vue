import type { CSSProperties, ExtractPropTypes, PropType, VNode } from 'vue';
import {
  Fragment,
  Teleport,
  cloneVNode,
  computed,
  defineComponent,
  isVNode,
  nextTick,
  onMounted,
  onUpdated,
  shallowRef,
  watch,
} from 'vue';
import { unit } from '../_util/cssinjs';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
import { filterEmpty } from '../_util/props-util';
import { withInstall } from '../_util/type';
import warning from '../_util/warning';
import { useToken } from '../theme/internal';
import useStyle from './style';
import {
  DEFAULT_BORDER_BEAM_DURATION,
  MAX_BEAM_COLOR_STOP_PERCENT,
  getBorderBeamGradient,
  getBorderBeamVarName,
  isSameBorderWidth,
  type BorderBeamColor,
  type BorderBeamGradient,
  type BorderBeamGradientItem,
  type BorderWidth,
} from './util';

export type { BorderBeamColor, BorderBeamGradient, BorderBeamGradientItem };
export { DEFAULT_BORDER_BEAM_DURATION, MAX_BEAM_COLOR_STOP_PERCENT, getBorderBeamGradient };

export interface BorderBeamItem {
  color?: BorderBeamColor;
  lineWidth?: number | string;
  outset?: number | string;
  size?: number | string;
}

const DEFAULT_BORDER_WIDTH: BorderWidth = [0, 0, 0, 0];

const isNonNullable = <T,>(val: T): val is NonNullable<T> => val !== undefined && val !== null;

const getInset = (width: number | string): string => {
  if (typeof width === 'string') {
    return `calc(-1 * ${width})`;
  }
  return width === 0 ? '0px' : `-${width}px`;
};

const normalizeBorderPx = (val: string): number => {
  const size = Number.parseFloat(val);
  return typeof size === 'number' && Number.isFinite(size) ? size : 0;
};

const resolveHtmlElement = (target: any): HTMLElement | null => {
  if (!target) return null;
  if (typeof HTMLElement !== 'undefined' && target instanceof HTMLElement) {
    return target;
  }
  if (target.nodeType === 1) {
    return target as HTMLElement;
  }
  if (target.nativeElement && target.nativeElement.nodeType === 1) {
    return target.nativeElement as HTMLElement;
  }
  if (target.$el) {
    return resolveHtmlElement(target.$el);
  }
  return null;
};

const resolveVNodeElement = (vnode: any): HTMLElement | null => {
  if (!vnode) return null;
  const direct = resolveHtmlElement(vnode.el);
  if (direct) return direct;
  if (vnode.component?.subTree) {
    return resolveVNodeElement(vnode.component.subTree);
  }
  if (Array.isArray(vnode.children)) {
    for (const child of vnode.children) {
      const found = resolveVNodeElement(child);
      if (found) return found;
    }
  }
  return null;
};

export const borderBeamProps = () => ({
  prefixCls: String,
  rootClassName: String,
  /** 光束颜色：色值、颜色数组或渐变色标数组 */
  color: { type: [String, Array] as PropType<BorderBeamColor> },
  /** 光束数量 */
  count: { type: Number, default: undefined },
  /** 单圈动画时长（秒） */
  duration: { type: Number, default: undefined },
  /** 逐条配置（优先于 count/color/lineWidth/outset/size） */
  items: { type: Array as PropType<BorderBeamItem[]> },
  /** 边框厚度 */
  lineWidth: { type: [Number, String] as PropType<number | string>, default: undefined },
  /** 光束向外偏移 */
  outset: { type: [Number, String] as PropType<number | string>, default: undefined },
  /** 光束长度（CSS 长度，默认 100px） */
  size: { type: [Number, String] as PropType<number | string>, default: undefined },
});

export type BorderBeamProps = Partial<ExtractPropTypes<ReturnType<typeof borderBeamProps>>>;

const BorderBeam = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ABorderBeam',
  inheritAttrs: false,
  props: borderBeamProps(),
  setup(props, { attrs, slots }) {
    const { configProvider, getPrefixCls } = useConfigInject('border-beam', props);
    const borderBeamConfig = computed(() => (configProvider as any).borderBeam?.value);
    const rootPrefixCls = computed(() => getPrefixCls());
    const prefixCls = computed(() => getPrefixCls('border-beam', props.prefixCls));
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const [, , , realToken] = useToken();
    const isMotionDisabled = computed(() => (realToken.value as any)?.motion === false);

    const hostDom = shallowRef<HTMLElement | null>(null);
    const borderWidth = shallowRef<BorderWidth>(DEFAULT_BORDER_WIDTH);
    let lastClonedChild: VNode | null = null;

    const updateHostDom = (nextDom: HTMLElement | null) => {
      if (hostDom.value !== nextDom) {
        hostDom.value = nextDom;
      }
    };

    const setChildRef = (el: any) => {
      if (!el) {
        updateHostDom(null);
        return;
      }
      const resolved = resolveHtmlElement(el);
      if (resolved) {
        updateHostDom(resolved);
      }
    };

    const syncChildVNodeDom = () => {
      if (lastClonedChild) {
        const resolved = resolveVNodeElement(lastClonedChild);
        if (resolved) {
          updateHostDom(resolved);
        }
      }
    };

    onMounted(syncChildVNodeDom);
    onUpdated(syncChildVNodeDom);

    watch(
      hostDom,
      (dom, _, onCleanup) => {
        if (!dom || typeof window === 'undefined' || typeof getComputedStyle !== 'function') {
          if (!isSameBorderWidth(borderWidth.value, DEFAULT_BORDER_WIDTH)) {
            borderWidth.value = DEFAULT_BORDER_WIDTH;
          }
          return;
        }

        let active = true;
        let appliedRelative = false;

        const syncHostMetrics = () => {
          if (!active) return;
          const computedStyle = getComputedStyle(dom);
          const nextBorderWidth: BorderWidth = [
            normalizeBorderPx(computedStyle.borderTopWidth),
            normalizeBorderPx(computedStyle.borderRightWidth),
            normalizeBorderPx(computedStyle.borderBottomWidth),
            normalizeBorderPx(computedStyle.borderLeftWidth),
          ];
          if (!isSameBorderWidth(borderWidth.value, nextBorderWidth)) {
            borderWidth.value = nextBorderWidth;
          }
          if (!appliedRelative && !dom.style.position && computedStyle.position === 'static') {
            dom.style.position = 'relative';
            appliedRelative = true;
          }
        };

        syncHostMetrics();
        nextTick(syncHostMetrics);

        onCleanup(() => {
          active = false;
          if (appliedRelative && dom.style.position === 'relative') {
            dom.style.position = '';
          }
        });
      },
      { flush: 'post', immediate: true },
    );

    const beamGradient = computed(() => getBorderBeamGradient(props.color));

    const mergedCount = computed(() => {
      if (props.items) {
        return props.items.length;
      }
      if (typeof props.count === 'number' && Number.isFinite(props.count) && props.count >= 1) {
        return Math.floor(props.count);
      }
      return 1;
    });

    const hasValidDuration = computed(
      () =>
        typeof props.duration === 'number' && Number.isFinite(props.duration) && props.duration > 0,
    );

    const mergedDuration = computed(() =>
      hasValidDuration.value ? (props.duration as number) : DEFAULT_BORDER_BEAM_DURATION,
    );

    const insetOffset = computed(() =>
      isNonNullable(props.outset)
        ? getInset(props.outset)
        : borderWidth.value.map(getInset).join(' '),
    );

    const varName = (name: string) => getBorderBeamVarName(rootPrefixCls.value, name);

    const beams = computed(() => {
      const count = mergedCount.value;
      const items = props.items;
      return Array.from({ length: count }, (_, index) => {
        const item = items?.[index] ?? {};
        const beamPhase = count > 0 ? index / count : 0;
        const beamKey = `${count}-${beamPhase}`;
        const itemBeamGradient = item.color
          ? getBorderBeamGradient(item.color)
          : beamGradient.value;
        const itemLineWidth = item.lineWidth ?? props.lineWidth;
        const itemSize = item.size ?? props.size;
        const itemInsetOffset = isNonNullable(item.outset)
          ? getInset(item.outset)
          : insetOffset.value;

        const style: CSSProperties = {
          ...(borderBeamConfig.value?.style as CSSProperties),
          ...(attrs.style as CSSProperties),
          ...(itemBeamGradient ? { [varName('beam-gradient')]: itemBeamGradient } : undefined),
          ...(hasValidDuration.value ? { [varName('duration')]: `${props.duration}s` } : undefined),
          ...(isNonNullable(itemLineWidth)
            ? { [varName('line-width')]: unit(itemLineWidth) }
            : undefined),
          ...(isNonNullable(itemSize) ? { [varName('size')]: unit(itemSize) } : undefined),
          ...(beamPhase > 0
            ? { [varName('delay')]: `${-mergedDuration.value * beamPhase}s` }
            : undefined),
          [varName('inset-offset')]: itemInsetOffset,
        };

        return {
          key: beamKey,
          style,
        };
      });
    });

    return () => {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          !isNonNullable(props.items) || !isNonNullable(props.count),
          'BorderBeam',
          '`count` is ignored when `items` is provided.',
        );
      }

      const rawChildren = slots.default?.() || [];
      const validChildren = filterEmpty(rawChildren);
      const singleChild =
        validChildren.length === 1 && isVNode(validChildren[0]) ? validChildren[0] : null;

      if (!singleChild) {
        lastClonedChild = null;
        return wrapSSR(rawChildren as any);
      }

      const clonedChild = cloneVNode(singleChild, { ref: setChildRef }, true);
      lastClonedChild = clonedChild;

      const beamClassName = classNames(
        prefixCls.value,
        borderBeamConfig.value?.className,
        props.rootClassName,
        attrs.class as any,
        {
          [`${prefixCls.value}-no-motion`]: isMotionDisabled.value,
        },
        hashId.value,
      );

      const targetDom = hostDom.value;

      return wrapSSR(
        <Fragment>
          {clonedChild}
          {targetDom &&
            beams.value.map(beam => (
              <Teleport key={beam.key} to={targetDom}>
                <div aria-hidden="true" class={beamClassName} style={beam.style} />
              </Teleport>
            ))}
        </Fragment>,
      );
    };
  },
});

export default withInstall(BorderBeam);
