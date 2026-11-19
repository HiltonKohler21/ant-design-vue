import { computed, defineComponent, ref, type VNode, Fragment } from 'vue';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { flattenChildren } from '../_util/props-util';
import ResizeObserver from '../vc-resize-observer';
import useStyle from './style';
import { splitterProps } from './interface';
import { useItems } from './hooks/useItems';
import { useSizes } from './hooks/useItems';
import useResizable from './hooks/useResizable';
import useResize from './hooks/useResize';
import { InternalPanel } from './Panel';
import SplitBar from './SplitBar';

const Splitter = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ASplitter',
  inheritAttrs: false,
  props: splitterProps(),
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('splitter', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const isVertical = computed(() => props.layout === 'vertical');
    const isRTL = computed(() => direction.value === 'rtl');
    const reverse = computed(() => !isVertical.value && isRTL.value);

    // ====================== Items Data ======================
    const children = computed(() => flattenChildren(slots.default?.() || []));
    const items = useItems(children);

    // ====================== Container =======================
    const containerSize = ref<number>();
    const onContainerResize = (size: { offsetWidth: number; offsetHeight: number }) => {
      const { offsetWidth, offsetHeight } = size;
      const sizeValue = isVertical.value ? offsetHeight : offsetWidth;
      // Skip when container has no size
      if (sizeValue === 0) return;
      containerSize.value = sizeValue;
    };

    // ========================= Size =========================
    const [panelSizes, itemPxSizes, itemPtgSizes, itemPtgMinSizes, itemPtgMaxSizes, updateSizes] =
      useSizes(items, containerSize);

    // ====================== Resizable =======================
    const resizableInfos = useResizable(items, itemPxSizes, isRTL);
    const [onOffsetStart, onOffsetUpdate, onOffsetEnd, onCollapse, movingIndex] = useResize(
      items,
      resizableInfos,
      itemPtgSizes,
      containerSize,
      updateSizes,
      isRTL,
    );

    // ======================== Events ========================
    const onInternalResizeStart = (index: number) => {
      onOffsetStart(index);
      props.onResizeStart?.(itemPxSizes.value);
    };

    const onInternalResizeUpdate = (index: number, offset: number, lazyEnd?: boolean) => {
      const nextSizes = onOffsetUpdate(index, offset);
      if (lazyEnd) {
        props.onResizeEnd?.(nextSizes);
      } else {
        props.onResize?.(nextSizes);
      }
    };

    const onInternalResizeEnd = (lazyEnd?: boolean) => {
      onOffsetEnd();
      if (!lazyEnd) {
        props.onResizeEnd?.(itemPxSizes.value);
      }
    };

    const onInternalCollapse = (index: number, type: 'start' | 'end') => {
      const nextSizes = onCollapse(index, type);
      props.onResize?.(nextSizes);
      props.onResizeEnd?.(nextSizes);
      const collapsed = nextSizes.map(size => Math.abs(size) < Number.EPSILON);
      props.onCollapse?.(collapsed, nextSizes);
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

    const stackSizes = computed(() => {
      const mergedSizes: number[] = [];
      let stack = 0;
      const len = items.value.length;
      for (let i = 0; i < len; i += 1) {
        stack += itemPtgSizes.value[i];
        mergedSizes.push(stack);
      }
      return mergedSizes;
    });

    const maskCls = `${prefixCls.value}-mask`;

    return () => {
      return wrapSSR(
        <ResizeObserver onResize={onContainerResize}>
          <div style={attrs.style as any} class={containerClassName.value}>
            {items.value.map((item, idx) => {
              const panel = (
                <InternalPanel {...item} prefixCls={prefixCls.value} size={panelSizes.value[idx]}>
                  {item.children}
                </InternalPanel>
              );

              let splitBar: VNode | null = null;
              const resizableInfo = resizableInfos.value[idx];
              if (resizableInfo) {
                const ariaMinStart = (stackSizes.value[idx - 1] || 0) + itemPtgMinSizes.value[idx];
                const ariaMinEnd =
                  (stackSizes.value[idx + 1] || 100) - itemPtgMaxSizes.value[idx + 1];
                const ariaMaxStart = (stackSizes.value[idx - 1] || 0) + itemPtgMaxSizes.value[idx];
                const ariaMaxEnd =
                  (stackSizes.value[idx + 1] || 100) - itemPtgMinSizes.value[idx + 1];

                splitBar = (
                  <SplitBar
                    lazy={props.lazy}
                    index={idx}
                    active={movingIndex.value === idx}
                    prefixCls={prefixCls.value}
                    vertical={isVertical.value}
                    resizable={resizableInfo.resizable}
                    ariaNow={stackSizes.value[idx] * 100}
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
              <div aria-hidden class={classNames(maskCls, `${maskCls}-${props.layout}`)} />
            )}
          </div>
        </ResizeObserver>,
      );
    };
  },
});

export default Splitter;
