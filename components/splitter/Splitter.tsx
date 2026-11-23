import { computed, defineComponent, ref, watch, type VNode, Fragment } from 'vue';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { flattenChildren } from '../_util/props-util';
import ResizeObserver from '../vc-resize-observer';
import useStyle from './style';
import { splitterProps } from './interface';
import { computeSizes, parseItems, type InternalPanelItem } from './hooks/useItems';
import computeResizable, { type ResizableInfo } from './hooks/useResizable';
import useResize from './hooks/useResize';
import { InternalPanel } from './Panel';
import SplitBar from './SplitBar';

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
  emits: ['resizeStart', 'resize', 'resizeEnd', 'collapse'],
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, direction } = useConfigInject('splitter', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const isVertical = computed(() => props.layout === 'vertical');
    const isRTL = computed(() => direction.value === 'rtl');
    const reverse = computed(() => !isVertical.value && isRTL.value);

    // ====================== Container =======================
    const rootRef = ref<HTMLElement | null>(null);
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

    // ======================== Styles ========================
    const containerClassName = computed(() =>
      classNames(
        prefixCls.value,
        `${prefixCls.value}-${props.layout}`,
        {
          [`${prefixCls.value}-rtl`]: isRTL.value,
        },
        props.rootClassName,
        attrs.class,
        hashId.value,
      ),
    );

    const maskCls = computed(() => `${prefixCls.value}-mask`);

    return () => {
      // Invoke slots.default inside render so Vue tracks all reactive slot dependencies cleanly
      const rawChildren = flattenChildren(slots.default?.() || []);
      const items = parseItems(rawChildren);

      if (initialDefaultSizes === null) {
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

      return wrapSSR(
        <ResizeObserver onResize={onContainerResize}>
          <div ref={rootRef} style={attrs.style as any} class={containerClassName.value}>
            {items.map((item, idx) => {
              const panel = (
                <InternalPanel
                  prefixCls={prefixCls.value}
                  class={classNames(item.className, item.class)}
                  style={item.style}
                  size={panelSizes[idx]}
                  destroyOnHidden={item.destroyOnHidden}
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
                    ariaNow={stackSizes[idx] * 100}
                    ariaMin={Math.max(ariaMinStart, ariaMinEnd) * 100}
                    ariaMax={Math.min(ariaMaxStart, ariaMaxEnd) * 100}
                    startCollapsible={resizableInfo.startCollapsible}
                    endCollapsible={resizableInfo.endCollapsible}
                    showStartCollapsibleIcon={resizableInfo.showStartCollapsibleIcon}
                    showEndCollapsibleIcon={resizableInfo.showEndCollapsibleIcon}
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
                class={classNames(maskCls.value, `${maskCls.value}-${props.layout}`)}
              />
            )}
          </div>
        </ResizeObserver>,
      );
    };
  },
});

export default Splitter;
