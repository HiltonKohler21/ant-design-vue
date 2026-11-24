import {
  computed,
  defineComponent,
  ref,
  watch,
  type CSSProperties,
  type VNode,
  Fragment,
} from 'vue';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { resolveSemantic, useMergeSemantic } from '../_util/hooks/useMergeSemantic';
import { flattenChildren } from '../_util/props-util';
import ResizeObserver from '../vc-resize-observer';
import useStyle from './style';
import {
  splitterProps,
  type SplitterDraggerClassName,
  type SplitterDraggerStyle,
  type SplitterOrientation,
  type SplitterProps,
  type SplitterSemanticClassNames,
  type SplitterSemanticStyles,
} from './interface';
import { computeSizes, parseItems, type InternalPanelItem } from './hooks/useItems';
import computeResizable, { type ResizableInfo } from './hooks/useResizable';
import useResize from './hooks/useResize';
import { InternalPanel } from './Panel';
import SplitBar from './SplitBar';

interface NormalizedSplitterClassNames {
  root?: string;
  panel?: string;
  dragger?: { default?: string; active?: string };
}

interface NormalizedSplitterStyles {
  root?: CSSProperties;
  panel?: CSSProperties;
  dragger?: { default?: CSSProperties; active?: CSSProperties };
}

function normalizeDraggerClassName(
  dragger?: SplitterDraggerClassName,
): { default?: string; active?: string } | undefined {
  if (!dragger) return undefined;
  if (typeof dragger === 'string') {
    return { default: dragger };
  }
  return dragger;
}

function normalizeDraggerStyle(
  dragger?: SplitterDraggerStyle,
): { default?: CSSProperties; active?: CSSProperties } | undefined {
  if (!dragger || typeof dragger !== 'object') return undefined;
  if ('default' in dragger || 'active' in dragger) {
    return dragger as { default?: CSSProperties; active?: CSSProperties };
  }
  return { default: dragger as CSSProperties };
}

function normalizeSplitterClassNames(
  cn?: SplitterSemanticClassNames,
): NormalizedSplitterClassNames | undefined {
  if (!cn) return undefined;
  return {
    ...cn,
    dragger: normalizeDraggerClassName(cn.dragger),
  };
}

function normalizeSplitterStyles(
  st?: SplitterSemanticStyles,
): NormalizedSplitterStyles | undefined {
  if (!st) return undefined;
  return {
    ...st,
    dragger: normalizeDraggerStyle(st.dragger),
  };
}

function renderPanelChildren(children: any) {
  if (!children) return null;
  if (typeof children === 'function') return children();
  if (
    typeof children === 'object' &&
    !Array.isArray(children) &&
    typeof children.default === 'function'
  ) {
    return children.default();
  }
  return children;
}

const Splitter = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASplitter',
  inheritAttrs: false,
  props: splitterProps(),
  emits: ['resizeStart', 'resize', 'resizeEnd', 'collapse', 'draggerDoubleClick'],
  setup(props, { slots, attrs, emit, expose }) {
    const { configProvider, prefixCls, direction } = useConfigInject('splitter', props);
    const splitterConfig = computed(() => (configProvider as any).splitter?.value);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const mergedOrientation = computed<SplitterOrientation>(() => {
      if (props.orientation) return props.orientation;
      if (props.vertical !== undefined) return props.vertical ? 'vertical' : 'horizontal';
      return props.layout ?? 'horizontal';
    });
    const isVertical = computed(() => mergedOrientation.value === 'vertical');
    const isRTL = computed(() => direction.value === 'rtl');
    const reverse = computed(() => !isVertical.value && isRTL.value);

    // ====================== Semantic ========================
    const mergedPropsForSemantic = computed<SplitterProps>(() => ({
      ...props,
      orientation: mergedOrientation.value,
      layout: mergedOrientation.value,
      vertical: isVertical.value,
    }));

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      NormalizedSplitterClassNames,
      NormalizedSplitterStyles,
      SplitterProps
    >(
      () => [
        info =>
          normalizeSplitterClassNames(resolveSemantic(splitterConfig.value?.classNames, info)),
        info => normalizeSplitterClassNames(resolveSemantic(props.classNames, info)),
        props.draggerClassName
          ? { dragger: normalizeDraggerClassName(props.draggerClassName) }
          : undefined,
      ],
      () => [
        info => normalizeSplitterStyles(resolveSemantic(splitterConfig.value?.styles, info)),
        info => normalizeSplitterStyles(resolveSemantic(props.styles, info)),
        props.draggerStyle ? { dragger: normalizeDraggerStyle(props.draggerStyle) } : undefined,
      ],
      () => ({ props: mergedPropsForSemantic.value }),
    );

    // ====================== Container =======================
    const rootRef = ref<HTMLElement | null>(null);
    expose({
      nativeElement: rootRef,
    });
    const containerSize = ref<number>();
    const onContainerResize = (size: { offsetWidth: number; offsetHeight: number }) => {
      const { offsetWidth, offsetHeight } = size;
      const sizeValue = isVertical.value ? offsetHeight : offsetWidth;
      // Skip when container has no size
      if (sizeValue === 0) return;
      containerSize.value = sizeValue;
    };

    watch(isVertical, () => {
      const el = rootRef.value;
      if (!el) return;
      const sizeValue = isVertical.value ? el.offsetHeight : el.offsetWidth;
      if (sizeValue > 0) {
        containerSize.value = sizeValue;
      }
    });

    // ========================= Size =========================
    const innerSizes = ref<any[] | null>(null);
    let initialDefaultSizes: any[] | null = null;

    // Latest render snapshot so drag/collapse handlers read up-to-date sizes without invoking slots outside render
    let latestItems: InternalPanelItem[] = [];
    let latestResizableInfos: ResizableInfo[] = [];
    let latestItemPxSizes: number[] = [];
    let latestItemPtgSizes: number[] = [];

    const updateSizes = (nextSizes: number[]) => {
      innerSizes.value = nextSizes;
      latestItemPxSizes = nextSizes;
    };

    // ====================== Resizable =======================
    const [onOffsetStart, onOffsetUpdate, onOffsetEnd, onCollapse, movingIndex] = useResize(
      () => ({
        items: latestItems,
        resizableInfos: latestResizableInfos,
        percentSizes: latestItemPtgSizes,
        containerSize: containerSize.value,
        reverse: reverse.value,
      }),
      updateSizes,
    );

    // ======================== Events ========================
    // Vue's emit('xxx', ...) dispatches to both @xxx / @xxx-yyy template listeners and onXxx JSX props once.
    const onInternalResizeStart = (index: number) => {
      onOffsetStart(index);
      emit('resizeStart', latestItemPxSizes);
    };

    const onInternalResizeUpdate = (index: number, offset: number, lazyEnd?: boolean) => {
      const nextSizes = onOffsetUpdate(index, offset);
      if (lazyEnd) {
        emit('resizeEnd', nextSizes);
      } else {
        emit('resize', nextSizes);
      }
    };

    const onInternalResizeEnd = (lazyEnd?: boolean) => {
      onOffsetEnd();
      if (!lazyEnd) {
        emit('resizeEnd', latestItemPxSizes);
      }
    };

    const onInternalCollapse = (index: number, type: 'start' | 'end') => {
      const nextSizes = onCollapse(index, type);
      emit('resize', nextSizes);
      emit('resizeEnd', nextSizes);
      const collapsed = nextSizes.map(size => Math.abs(size) < Number.EPSILON);
      emit('collapse', collapsed, nextSizes);
    };

    const onInternalDraggerDoubleClick = (index: number) => {
      emit('draggerDoubleClick', index);
    };

    // ======================== Styles ========================
    const containerClassName = computed(() =>
      classNames(
        prefixCls.value,
        `${prefixCls.value}-${mergedOrientation.value}`,
        {
          [`${prefixCls.value}-rtl`]: isRTL.value,
        },
        splitterConfig.value?.className,
        props.rootClassName,
        mergedClassNames.value.root,
        attrs.class,
        hashId.value,
      ),
    );

    const maskCls = computed(() => `${prefixCls.value}-mask`);

    return () => {
      // Invoke slots.default inside render so Vue tracks all reactive slot dependencies cleanly
      const rawChildren = flattenChildren(slots.default?.() || []);
      const items = parseItems(rawChildren);

      if (initialDefaultSizes === null || initialDefaultSizes.length !== items.length) {
        initialDefaultSizes = items.map(item => item.defaultSize);
      }
      const effectiveInnerSizes = innerSizes.value ?? initialDefaultSizes;

      const { panelSizes, itemPxSizes, itemPtgSizes, itemPtgMinSizes, itemPtgMaxSizes } =
        computeSizes(items, containerSize.value, effectiveInnerSizes);

      const resizableInfos = computeResizable(items, itemPxSizes, reverse.value);

      latestItems = items;
      latestResizableInfos = resizableInfos;
      latestItemPxSizes = itemPxSizes;
      latestItemPtgSizes = itemPtgSizes;

      const stackSizes: number[] = [];
      let stack = 0;
      for (let i = 0; i < items.length; i += 1) {
        stack += itemPtgSizes[i];
        stackSizes.push(stack);
      }

      const styleList = [splitterConfig.value?.style, mergedStyles.value.root, attrs.style].filter(
        Boolean,
      );
      const mergedStyle = styleList.length > 1 ? styleList : styleList[0] ?? attrs.style;

      const mergedDraggerIcon =
        props.draggerIcon !== undefined
          ? props.draggerIcon
          : slots.draggerIcon
          ? slots.draggerIcon()
          : undefined;
      const mergedCollapsibleIcon = props.collapsible?.icon ?? props.collapsibleIcon;

      return wrapSSR(
        <ResizeObserver onResize={onContainerResize}>
          <div ref={rootRef} style={mergedStyle as any} class={containerClassName.value}>
            {items.map((item, idx) => {
              const mergedPanelStyle =
                mergedStyles.value.panel && item.style && typeof item.style === 'object'
                  ? { ...mergedStyles.value.panel, ...item.style }
                  : mergedStyles.value.panel || item.style;

              const panel = (
                <InternalPanel
                  prefixCls={prefixCls.value}
                  class={classNames(mergedClassNames.value.panel, item.className, item.class)}
                  style={mergedPanelStyle}
                  size={panelSizes[idx]}
                  supportMotion={!!(props.collapsible?.motion && movingIndex.value === undefined)}
                  destroyOnHidden={item.destroyOnHidden ?? props.destroyOnHidden}
                  v-slots={{
                    default: () => renderPanelChildren(item.children),
                  }}
                />
              );

              let splitBar: VNode | null = null;
              const resizableInfo = resizableInfos[idx];
              if (resizableInfo) {
                const prevStackSize = Number.isFinite(stackSizes[idx - 1])
                  ? stackSizes[idx - 1]
                  : 0;
                const nextStackSize = Number.isFinite(stackSizes[idx + 1])
                  ? stackSizes[idx + 1]
                  : 1;
                const ariaMinStart = prevStackSize + itemPtgMinSizes[idx];
                const ariaMinEnd = nextStackSize - itemPtgMaxSizes[idx + 1];
                const ariaMaxStart = prevStackSize + itemPtgMaxSizes[idx];
                const ariaMaxEnd = nextStackSize - itemPtgMinSizes[idx + 1];

                splitBar = (
                  <SplitBar
                    lazy={props.lazy}
                    index={idx}
                    active={movingIndex.value === idx}
                    prefixCls={prefixCls.value}
                    vertical={isVertical.value}
                    resizable={resizableInfo.resizable}
                    draggerStyle={mergedStyles.value.dragger}
                    draggerClassName={mergedClassNames.value.dragger}
                    draggerIcon={mergedDraggerIcon}
                    collapsibleIcon={mergedCollapsibleIcon}
                    ariaNow={stackSizes[idx] * 100}
                    ariaMin={Math.max(ariaMinStart, ariaMinEnd) * 100}
                    ariaMax={Math.min(ariaMaxStart, ariaMaxEnd) * 100}
                    startCollapsible={resizableInfo.startCollapsible}
                    endCollapsible={resizableInfo.endCollapsible}
                    showStartCollapsibleIcon={resizableInfo.showStartCollapsibleIcon}
                    showEndCollapsibleIcon={resizableInfo.showEndCollapsibleIcon}
                    onDraggerDoubleClick={onInternalDraggerDoubleClick}
                    onOffsetStart={onInternalResizeStart}
                    onOffsetUpdate={(index, offsetX, offsetY, lazyEnd) => {
                      let offset = isVertical.value ? offsetY : offsetX;
                      if (reverse.value) {
                        offset = -offset;
                      }
                      onInternalResizeUpdate(index, offset, lazyEnd);
                    }}
                    onOffsetEnd={onInternalResizeEnd}
                    onCollapse={onInternalCollapse}
                    containerSize={containerSize.value || 0}
                  />
                );
              }
              return (
                <Fragment key={`split-panel-${idx}`}>
                  {panel}
                  {splitBar}
                </Fragment>
              );
            })}
            {typeof movingIndex.value === 'number' && (
              <div
                aria-hidden="true"
                class={classNames(maskCls.value, `${maskCls.value}-${mergedOrientation.value}`)}
              />
            )}
          </div>
        </ResizeObserver>,
      );
    };
  },
});

export default Splitter;
