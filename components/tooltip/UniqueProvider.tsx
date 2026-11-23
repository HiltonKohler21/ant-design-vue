import type { CSSProperties, ExtractPropTypes, InjectionKey, PropType, Ref } from 'vue';
import {
  defineComponent,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  Teleport,
} from 'vue';
import classNames from '../_util/classNames';
import type { TooltipPlacement } from './abstractTooltipProps';

export interface UniqueTooltipState {
  id: string;
  triggerEl: HTMLElement | null;
  placement: TooltipPlacement;
  prefixCls: string;
  hashId?: string;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  overlayInnerClassName?: string;
  overlayInnerStyle?: CSSProperties;
  arrowClassName?: string;
  arrowStyle?: CSSProperties;
  showArrow?: boolean;
  mouseLeaveDelay: number;
  renderOverlay: () => any;
  onForceClose?: () => void;
}

export interface TooltipUniqueContextValue {
  activeId: Ref<string | null>;
  visible: Ref<boolean>;
  show: (state: UniqueTooltipState) => void;
  update: (state: UniqueTooltipState) => void;
  hide: (id: string, delayMs?: number) => void;
  unregister: (id: string) => void;
  forceAlign: () => void;
  getPopupDomNode: () => HTMLElement | null;
}

export const TooltipUniqueContextKey: InjectionKey<TooltipUniqueContextValue> =
  Symbol('TooltipUniqueContext');

export const useInjectTooltipUnique = () => inject(TooltipUniqueContextKey, null);

export const tooltipUniqueProviderProps = () => ({});

export type TooltipUniqueProviderProps = Partial<
  ExtractPropTypes<ReturnType<typeof tooltipUniqueProviderProps>>
>;

function computePopupPosition(
  triggerEl: HTMLElement | null,
  popupEl: HTMLElement | null,
  placement: TooltipPlacement,
): { left: number; top: number } {
  if (!triggerEl || typeof window === 'undefined') {
    return { left: 0, top: 0 };
  }
  const rect = triggerEl.getBoundingClientRect();
  const popupRect = popupEl?.getBoundingClientRect();
  const popupW = popupRect?.width || 0;
  const popupH = popupRect?.height || 0;
  const scrollX = window.scrollX || window.pageXOffset || 0;
  const scrollY = window.scrollY || window.pageYOffset || 0;
  const gap = 8;

  let left = rect.left + scrollX + (rect.width - popupW) / 2;
  let top = rect.top + scrollY - popupH - gap;

  switch (placement) {
    case 'topLeft':
      left = rect.left + scrollX;
      top = rect.top + scrollY - popupH - gap;
      break;
    case 'topRight':
      left = rect.right + scrollX - popupW;
      top = rect.top + scrollY - popupH - gap;
      break;
    case 'bottom':
      left = rect.left + scrollX + (rect.width - popupW) / 2;
      top = rect.bottom + scrollY + gap;
      break;
    case 'bottomLeft':
      left = rect.left + scrollX;
      top = rect.bottom + scrollY + gap;
      break;
    case 'bottomRight':
      left = rect.right + scrollX - popupW;
      top = rect.bottom + scrollY + gap;
      break;
    case 'left':
      left = rect.left + scrollX - popupW - gap;
      top = rect.top + scrollY + (rect.height - popupH) / 2;
      break;
    case 'leftTop':
      left = rect.left + scrollX - popupW - gap;
      top = rect.top + scrollY;
      break;
    case 'leftBottom':
      left = rect.left + scrollX - popupW - gap;
      top = rect.bottom + scrollY - popupH;
      break;
    case 'right':
      left = rect.right + scrollX + gap;
      top = rect.top + scrollY + (rect.height - popupH) / 2;
      break;
    case 'rightTop':
      left = rect.right + scrollX + gap;
      top = rect.top + scrollY;
      break;
    case 'rightBottom':
      left = rect.right + scrollX + gap;
      top = rect.bottom + scrollY - popupH;
      break;
    case 'top':
    default:
      left = rect.left + scrollX + (rect.width - popupW) / 2;
      top = rect.top + scrollY - popupH - gap;
      break;
  }

  return {
    left: Number.isFinite(left) ? Math.round(left) : 0,
    top: Number.isFinite(top) ? Math.round(top) : 0,
  };
}

/**
 * Isolated popup renderer so updating active tooltip state/position never re-renders
 * the UniqueProvider's default slot subtree.
 */
const UniquePopup = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATooltipUniquePopup',
  props: {
    activeState: {
      type: Object as PropType<Ref<UniqueTooltipState | null>>,
      required: true,
    },
    visible: {
      type: Object as PropType<Ref<boolean>>,
      required: true,
    },
    position: {
      type: Object as PropType<Ref<{ left: number; top: number }>>,
      required: true,
    },
    onPopupRef: Function as PropType<(el: HTMLElement | null) => void>,
    onMouseenter: Function as PropType<() => void>,
    onMouseleave: Function as PropType<() => void>,
  },
  setup(props) {
    const mounted = ref(false);
    onMounted(() => {
      mounted.value = true;
    });

    const setPopupRef = (el: any) => {
      props.onPopupRef?.(el instanceof HTMLElement ? el : null);
    };

    return () => {
      const state = props.activeState.value;
      const canTeleport = mounted.value && typeof document !== 'undefined' && !!state;
      if (!canTeleport || !state) {
        return null;
      }
      const prefixCls = state.prefixCls || 'ant-tooltip';
      const placementCls = state.placement ? `${prefixCls}-placement-${state.placement}` : '';
      const pos = props.position.value;

      return (
        <Teleport to="body">
          <div
            ref={setPopupRef}
            class={classNames(
              prefixCls,
              `${prefixCls}-unique-container`,
              props.visible.value
                ? `${prefixCls}-unique-container-visible`
                : `${prefixCls}-unique-container-hidden`,
              placementCls,
              state.hashId,
              state.overlayClassName,
            )}
            style={{
              ...state.overlayStyle,
              left: `${pos.left}px`,
              top: `${pos.top}px`,
            }}
            onMouseenter={props.onMouseenter}
            onMouseleave={props.onMouseleave}
          >
            <div class={`${prefixCls}-content`}>
              <div
                class={classNames(`${prefixCls}-inner`, state.overlayInnerClassName)}
                role="tooltip"
                style={state.overlayInnerStyle}
              >
                <div key={state.id} class={`${prefixCls}-unique-content`}>
                  {state.renderOverlay()}
                </div>
              </div>
            </div>
          </div>
        </Teleport>
      );
    };
  },
});

const UniqueProvider = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATooltipUniqueProvider',
  props: tooltipUniqueProviderProps(),
  setup(_, { slots }) {
    const activeId = ref<string | null>(null);
    const activeState = shallowRef<UniqueTooltipState | null>(null);
    const visible = ref(false);
    const popupRef = ref<HTMLElement | null>(null);
    const position = ref<{ left: number; top: number }>({ left: 0, top: 0 });
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    const clearHideTimer = () => {
      if (hideTimer !== null) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
    };

    const forceAlign = () => {
      const state = activeState.value;
      if (!state) return;
      const next = computePopupPosition(state.triggerEl, popupRef.value, state.placement);
      if (next.left !== position.value.left || next.top !== position.value.top) {
        position.value = next;
      }
    };

    const show = (state: UniqueTooltipState) => {
      clearHideTimer();
      const prev = activeState.value;
      if (prev && prev.id !== state.id && visible.value) {
        prev.onForceClose?.();
      }
      activeId.value = state.id;
      activeState.value = state;
      visible.value = true;
      forceAlign();
      nextTick(() => {
        forceAlign();
      });
    };

    const update = (state: UniqueTooltipState) => {
      if (activeId.value === state.id) {
        activeState.value = state;
        forceAlign();
      }
    };

    const hide = (id: string, delayMs = 100) => {
      if (activeId.value !== id) return;
      clearHideTimer();
      const performHide = () => {
        if (activeId.value !== id) return;
        const prev = activeState.value;
        visible.value = false;
        activeId.value = null;
        prev?.onForceClose?.();
      };
      if (delayMs <= 0) {
        performHide();
      } else {
        hideTimer = setTimeout(performHide, delayMs);
      }
    };

    const unregister = (id: string) => {
      if (activeId.value === id) {
        clearHideTimer();
        visible.value = false;
        activeId.value = null;
        activeState.value = null;
      }
    };

    const getPopupDomNode = () => popupRef.value;

    const handlePopupMouseEnter = () => {
      clearHideTimer();
    };

    const handlePopupMouseLeave = () => {
      const state = activeState.value;
      if (state) {
        hide(state.id, (state.mouseLeaveDelay ?? 0.1) * 1000);
      }
    };

    onBeforeUnmount(() => {
      clearHideTimer();
    });

    provide(TooltipUniqueContextKey, {
      activeId,
      visible,
      show,
      update,
      hide,
      unregister,
      forceAlign,
      getPopupDomNode,
    });

    const handlePopupRef = (el: HTMLElement | null) => {
      popupRef.value = el;
    };

    return () => (
      <>
        {slots.default?.()}
        <UniquePopup
          activeState={activeState}
          visible={visible}
          position={position}
          onPopupRef={handlePopupRef}
          onMouseenter={handlePopupMouseEnter}
          onMouseleave={handlePopupMouseLeave}
        />
      </>
    );
  },
});

export default UniqueProvider;
