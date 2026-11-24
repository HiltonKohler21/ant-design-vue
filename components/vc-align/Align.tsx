import type { PropType } from 'vue';
import {
  nextTick,
  defineComponent,
  ref,
  computed,
  onMounted,
  onUpdated,
  watch,
  onUnmounted,
} from 'vue';
import { alignElement, alignPoint } from 'dom-align';
import addEventListener from '../vc-util/Dom/addEventListener';
import { cloneElement } from '../_util/vnode';
import isVisible from '../vc-util/Dom/isVisible';
import raf from '../_util/raf';
import supportsPassive from '../_util/supportsPassive';

import { isSamePoint, restoreFocus, monitorResize, getScrollableAncestors } from './util';
import { applyAutoShift, shouldUseAutoShift } from './autoShift';
import type { AlignType, AlignResult, TargetType, TargetPoint } from './interface';
import useBuffer from './hooks/useBuffer';
import isEqual from 'lodash-es/isEqual';

type OnAlign = (source: HTMLElement, result: AlignResult) => void;

export interface AlignProps {
  align: AlignType;
  target: TargetType;
  onAlign?: OnAlign;
  monitorBufferTime?: number;
  monitorWindowResize?: boolean;
  disabled?: boolean;
}

export const alignProps = {
  align: Object as PropType<AlignType>,
  target: [Object, Function] as PropType<TargetType>,
  onAlign: Function as PropType<OnAlign>,
  monitorBufferTime: Number,
  monitorWindowResize: Boolean,
  disabled: Boolean,
};

interface MonitorRef {
  element?: HTMLElement;
  cancel: () => void;
}

export interface RefAlign {
  forceAlign: () => void;
}

function getElement(func: TargetType) {
  if (typeof func !== 'function') return null;
  return func();
}

function getPoint(point: TargetType) {
  if (typeof point !== 'object' || !point) return null;
  return point;
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Align',
  props: alignProps,
  emits: ['align'],
  setup(props, { expose, slots }) {
    const cacheRef = ref<{ element?: HTMLElement; point?: TargetPoint; align?: AlignType }>({});
    const nodeRef = ref();
    const [forceAlign, cancelForceAlign] = useBuffer(
      () => {
        const {
          disabled: latestDisabled,
          target: latestTarget,
          align: latestAlign,
          onAlign: latestOnAlign,
        } = props;
        if (!latestDisabled && latestTarget && nodeRef.value) {
          const source = nodeRef.value;

          let result: AlignResult;
          const element = getElement(latestTarget);
          const point = getPoint(latestTarget);

          cacheRef.value.element = element;
          cacheRef.value.point = point;
          cacheRef.value.align = latestAlign;
          // IE lose focus after element realign
          // We should record activeElement and restore later
          const { activeElement } = document;
          // We only align when element is visible
          if (element && isVisible(element)) {
            const alignConfig = latestAlign as AlignType | undefined;
            const baseAlign = shouldUseAutoShift(alignConfig)
              ? {
                  ...alignConfig,
                  overflow: {
                    ...alignConfig.overflow,
                    adjustX: 0,
                    adjustY: 0,
                  },
                }
              : alignConfig;
            result = alignElement(source, element, baseAlign);
            if (result) {
              result = applyAutoShift(source, element, alignConfig, result);
            }
          } else if (point) {
            result = alignPoint(source, point, latestAlign);
          }
          restoreFocus(activeElement, source);

          if (latestOnAlign && result) {
            latestOnAlign(source, result);
          }

          return true;
        }

        return false;
      },
      computed(() => props.monitorBufferTime),
    );

    // ===================== Effect =====================
    // Listen for target updated
    const resizeMonitor = ref<MonitorRef>({
      cancel: () => {},
    });
    // Listen for source updated
    const sourceResizeMonitor = ref<MonitorRef>({
      cancel: () => {},
    });
    // Listen for scrollable ancestors + window scroll
    let scrollRafId: number | null = null;
    const cancelScrollRaf = () => {
      if (scrollRafId !== null) {
        raf.cancel(scrollRafId);
        scrollRafId = null;
      }
    };
    const onScroll = () => {
      if (props.disabled) return;
      if (scrollRafId !== null) return;
      scrollRafId = raf(() => {
        scrollRafId = null;
        if (!props.disabled) {
          forceAlign(true);
        }
      });
    };
    const scrollMonitor = ref<{
      element?: HTMLElement | null;
      connected?: boolean;
      active: boolean;
      cancel: () => void;
    }>({
      element: null,
      connected: false,
      active: false,
      cancel: () => {},
    });
    const clearScrollListeners = () => {
      cancelScrollRaf();
      scrollMonitor.value.cancel();
      scrollMonitor.value = {
        element: null,
        connected: false,
        active: false,
        cancel: () => {},
      };
    };
    const updateScrollListeners = (element: HTMLElement | null) => {
      if (props.disabled || !element) {
        if (scrollMonitor.value.active) {
          clearScrollListeners();
        }
        return;
      }
      const connected = !!element.isConnected;
      if (
        scrollMonitor.value.active &&
        scrollMonitor.value.element === element &&
        scrollMonitor.value.connected === connected
      ) {
        return;
      }
      scrollMonitor.value.cancel();
      const targets = getScrollableAncestors(element);
      const option: AddEventListenerOptions | boolean = supportsPassive ? { passive: true } : false;
      targets.forEach(t => {
        t.addEventListener('scroll', onScroll, option);
      });
      scrollMonitor.value = {
        element,
        connected,
        active: true,
        cancel: () => {
          targets.forEach(t => {
            t.removeEventListener('scroll', onScroll, option);
          });
        },
      };
    };

    const goAlign = () => {
      const target = props.target;
      const element = getElement(target);
      const point = getPoint(target);

      updateScrollListeners(element);

      if (nodeRef.value !== sourceResizeMonitor.value.element) {
        sourceResizeMonitor.value.cancel();
        sourceResizeMonitor.value.element = nodeRef.value;
        sourceResizeMonitor.value.cancel = monitorResize(nodeRef.value, forceAlign);
      }

      if (
        cacheRef.value.element !== element ||
        !isSamePoint(cacheRef.value.point, point) ||
        !isEqual(cacheRef.value.align, props.align)
      ) {
        forceAlign();

        // Add resize observer
        if (resizeMonitor.value.element !== element) {
          resizeMonitor.value.cancel();
          resizeMonitor.value.element = element;
          resizeMonitor.value.cancel = monitorResize(element, forceAlign);
        }
      }
    };

    onMounted(() => {
      nextTick(() => {
        goAlign();
      });
    });

    onUpdated(() => {
      nextTick(() => {
        goAlign();
      });
    });

    // Listen for disabled change
    watch(
      () => props.disabled,
      disabled => {
        if (!disabled) {
          updateScrollListeners(getElement(props.target));
          forceAlign();
        } else {
          clearScrollListeners();
          cancelForceAlign();
        }
      },
      { immediate: true, flush: 'post' },
    );

    // Listen for window resize
    const winResizeRef = ref<{ remove: Function }>(null);

    watch(
      () => props.monitorWindowResize,
      monitorWindowResize => {
        if (monitorWindowResize) {
          if (!winResizeRef.value) {
            winResizeRef.value = addEventListener(window, 'resize', forceAlign);
          }
        } else if (winResizeRef.value) {
          winResizeRef.value.remove();
          winResizeRef.value = null;
        }
      },
      { flush: 'post' },
    );
    onUnmounted(() => {
      resizeMonitor.value.cancel();
      sourceResizeMonitor.value.cancel();
      clearScrollListeners();
      if (winResizeRef.value) winResizeRef.value.remove();
      cancelForceAlign();
    });

    expose({
      forceAlign: () => forceAlign(true),
    });

    return () => {
      const child = slots?.default();
      if (child) {
        return cloneElement(child[0], { ref: nodeRef }, true, true);
      }
      return null;
    };
  },
});
