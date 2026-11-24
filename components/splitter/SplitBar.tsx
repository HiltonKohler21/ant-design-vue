import {
  computed,
  defineComponent,
  ref,
  watch,
  onBeforeUnmount,
  type CSSProperties,
  type PropType,
} from 'vue';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import UpOutlined from '@ant-design/icons-vue/UpOutlined';
import classNames from '../_util/classNames';
import { anyType, type VueNode } from '../_util/type';
import type {
  ShowCollapsibleIconMode,
  SplitterCollapsibleIcon,
  SplitterDraggerClassName,
  SplitterDraggerStyle,
} from './interface';

const DOUBLE_CLICK_TIME_GAP = 300;

function getValidNumber(num?: number): number {
  return typeof num === 'number' && !Number.isNaN(num) && Number.isFinite(num)
    ? Math.round(num)
    : 0;
}

const splitBarProps = () => ({
  prefixCls: String,
  vertical: { type: Boolean, default: false },
  index: Number,
  active: { type: Boolean, default: false },
  ariaNow: Number,
  ariaMin: Number,
  ariaMax: Number,
  resizable: { type: Boolean, default: true },
  startCollapsible: { type: Boolean, default: false },
  endCollapsible: { type: Boolean, default: false },
  showStartCollapsibleIcon: {
    type: [Boolean, String] as PropType<ShowCollapsibleIconMode>,
    default: 'auto',
  },
  showEndCollapsibleIcon: {
    type: [Boolean, String] as PropType<ShowCollapsibleIconMode>,
    default: 'auto',
  },
  draggerIcon: anyType<VueNode>(),
  collapsibleIcon: {
    type: Object as PropType<SplitterCollapsibleIcon>,
    default: undefined,
  },
  draggerClassName: {
    type: [String, Object] as PropType<SplitterDraggerClassName>,
    default: undefined,
  },
  draggerStyle: {
    type: Object as PropType<SplitterDraggerStyle>,
    default: undefined,
  },
  lazy: { type: Boolean, default: false },
  containerSize: { type: Number, default: 0 },
  onDraggerDoubleClick: Function as PropType<(index: number) => void>,
  onOffsetStart: Function as PropType<(index: number) => void>,
  onOffsetUpdate: Function as PropType<
    (index: number, offsetX: number, offsetY: number, lazyEnd?: boolean) => void
  >,
  onOffsetEnd: Function as PropType<(lazyEnd?: boolean) => void>,
  onCollapse: Function as PropType<(index: number, type: 'start' | 'end') => void>,
});

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'SplitBar',
  props: splitBarProps(),
  setup(props) {
    const splitBarPrefixCls = computed(() => `${props.prefixCls}-bar`);
    const startPos = ref<[number, number] | null>(null);
    const constrainedOffset = ref(0);
    const lastClickTime = ref(0);

    const constrainedOffsetX = computed(() => (props.vertical ? 0 : constrainedOffset.value));
    const constrainedOffsetY = computed(() => (props.vertical ? constrainedOffset.value : 0));

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      const currentTime = Date.now();
      const timeGap = currentTime - lastClickTime.value;
      if (timeGap > 0 && timeGap < DOUBLE_CLICK_TIME_GAP) {
        return;
      }
      lastClickTime.value = currentTime;
      if (props.resizable && e.currentTarget) {
        startPos.value = [e.pageX, e.pageY];
        props.onOffsetStart?.(props.index!);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (props.resizable && e.touches.length === 1) {
        const touch = e.touches[0];
        startPos.value = [touch.pageX, touch.pageY];
        props.onOffsetStart?.(props.index!);
      }
    };

    const getConstrainedOffset = (rawOffset: number) => {
      const currentPos = (props.containerSize * (props.ariaNow ?? 0)) / 100;
      const newPos = currentPos + rawOffset;
      const minAllowed = Math.max(0, (props.containerSize * (props.ariaMin ?? 0)) / 100);
      const maxAllowed = Math.min(
        props.containerSize,
        (props.containerSize * (props.ariaMax ?? 100)) / 100,
      );
      const clampedPos = Math.max(minAllowed, Math.min(maxAllowed, newPos));
      return clampedPos - currentPos;
    };

    const handleLazyMove = (offsetX: number, offsetY: number) => {
      const constrainedOffsetValue = getConstrainedOffset(props.vertical ? offsetY : offsetX);
      constrainedOffset.value = constrainedOffsetValue;
    };

    const handleLazyEnd = () => {
      props.onOffsetUpdate?.(
        props.index!,
        constrainedOffsetX.value,
        constrainedOffsetY.value,
        true,
      );
      constrainedOffset.value = 0;
      props.onOffsetEnd?.(true);
    };

    const getVisibilityClass = (mode: ShowCollapsibleIconMode) => {
      const cls = splitBarPrefixCls.value;
      switch (mode) {
        case true:
          return `${cls}-collapse-bar-always-visible`;
        case false:
          return `${cls}-collapse-bar-always-hidden`;
        case 'auto':
          return `${cls}-collapse-bar-hover-only`;
      }
    };

    const onCollapseClick = (e: MouseEvent, type: 'start' | 'end') => {
      e.stopPropagation();
      props.onCollapse?.(props.index!, type);
    };

    const onCollapseKeyDown = (e: KeyboardEvent, type: 'start' | 'end') => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        props.onCollapse?.(props.index!, type);
      }
    };

    // Use flush: 'sync' so mouseup/touchend listeners are attached immediately during mousedown/touchstart,
    // guaranteeing even same-frame fast clicks release movingIndex and never leak .ant-splitter-mask.
    watch(
      startPos,
      (newStartPos, _, onCleanup) => {
        if (!newStartPos) return;

        let ended = false;

        const finishDrag = () => {
          if (ended) return;
          ended = true;
          if (props.lazy) {
            handleLazyEnd();
          } else {
            props.onOffsetEnd?.();
          }
          startPos.value = null;
        };

        const onMouseMove = (e: MouseEvent) => {
          const offsetX = e.pageX - newStartPos[0];
          const offsetY = e.pageY - newStartPos[1];
          if (props.lazy) {
            handleLazyMove(offsetX, offsetY);
          } else {
            props.onOffsetUpdate?.(props.index!, offsetX, offsetY);
          }
        };

        const handleTouchMove = (e: TouchEvent) => {
          if (e.touches.length === 1) {
            const touch = e.touches[0];
            const offsetX = touch.pageX - newStartPos[0];
            const offsetY = touch.pageY - newStartPos[1];
            if (props.lazy) {
              handleLazyMove(offsetX, offsetY);
            } else {
              props.onOffsetUpdate?.(props.index!, offsetX, offsetY);
            }
          }
        };

        const eventHandlerMap: Record<string, EventListener> = {
          mousemove: onMouseMove as EventListener,
          mouseup: finishDrag,
          touchmove: handleTouchMove as EventListener,
          touchend: finishDrag,
          touchcancel: finishDrag,
          blur: finishDrag,
        };

        Object.entries(eventHandlerMap).forEach(([event, handler]) => {
          window.addEventListener(event, handler);
        });

        onCleanup(() => {
          Object.entries(eventHandlerMap).forEach(([event, handler]) => {
            window.removeEventListener(event, handler);
          });
        });
      },
      { flush: 'sync' },
    );

    onBeforeUnmount(() => {
      if (startPos.value !== null) {
        startPos.value = null;
        constrainedOffset.value = 0;
        props.onOffsetEnd?.();
      }
    });

    const transformStyle = computed(() => ({
      [`--${splitBarPrefixCls.value}-preview-offset`]: `${constrainedOffset.value}px`,
    }));

    const StartIcon = computed(() => (props.vertical ? UpOutlined : LeftOutlined));
    const EndIcon = computed(() => (props.vertical ? DownOutlined : RightOutlined));

    return () => {
      const barCls = splitBarPrefixCls.value;
      const StartIconComp = StartIcon.value;
      const EndIconComp = EndIcon.value;
      const hasDraggerIcon = props.draggerIcon !== undefined;
      const startCustomize = props.collapsibleIcon?.start !== undefined;
      const endCustomize = props.collapsibleIcon?.end !== undefined;

      const renderIconNode = (node: VueNode) =>
        typeof node === 'function' ? (node as any)() : node;
      const renderedDraggerIcon = hasDraggerIcon ? renderIconNode(props.draggerIcon) : null;
      const renderedStartIcon = startCustomize ? (
        renderIconNode(props.collapsibleIcon!.start)
      ) : (
        <StartIconComp />
      );
      const renderedEndIcon = endCustomize ? (
        renderIconNode(props.collapsibleIcon!.end)
      ) : (
        <EndIconComp />
      );

      const normalizedDraggerClass =
        typeof props.draggerClassName === 'string'
          ? { default: props.draggerClassName }
          : props.draggerClassName;

      let resolvedDraggerStyle: CSSProperties | undefined;
      if (props.draggerStyle && typeof props.draggerStyle === 'object') {
        if ('default' in props.draggerStyle || 'active' in props.draggerStyle) {
          const stateStyle = props.draggerStyle as {
            default?: CSSProperties;
            active?: CSSProperties;
          };
          resolvedDraggerStyle =
            props.active && stateStyle.active
              ? { ...stateStyle.default, ...stateStyle.active }
              : stateStyle.default;
        } else {
          resolvedDraggerStyle = props.draggerStyle as CSSProperties;
        }
      }

      return (
        <div class={barCls}>
          {props.lazy && (
            <div
              class={classNames(`${barCls}-preview`, {
                [`${barCls}-preview-active`]: !!constrainedOffset.value,
              })}
              style={transformStyle.value}
            />
          )}
          <div
            style={resolvedDraggerStyle}
            class={classNames(
              `${barCls}-dragger`,
              {
                [`${barCls}-dragger-disabled`]: !props.resizable,
                [`${barCls}-dragger-active`]: props.active,
                [`${barCls}-dragger-customize`]: hasDraggerIcon,
              },
              normalizedDraggerClass?.default,
              props.active && normalizedDraggerClass?.active,
            )}
            role="separator"
            aria-disabled={!props.resizable}
            aria-orientation={props.vertical ? 'horizontal' : 'vertical'}
            aria-valuenow={getValidNumber(props.ariaNow)}
            aria-valuemin={getValidNumber(props.ariaMin)}
            aria-valuemax={getValidNumber(props.ariaMax)}
            onMousedown={onMouseDown}
            onTouchstart={onTouchStart}
            onDblclick={() => props.onDraggerDoubleClick?.(props.index!)}
          >
            {hasDraggerIcon ? (
              <div class={`${barCls}-dragger-icon`}>{renderedDraggerIcon}</div>
            ) : null}
          </div>
          {props.startCollapsible && (
            <div
              class={classNames(
                `${barCls}-collapse-bar`,
                `${barCls}-collapse-bar-start`,
                {
                  [`${barCls}-collapse-bar-customize`]: startCustomize,
                },
                getVisibilityClass(props.showStartCollapsibleIcon),
              )}
              role="button"
              tabindex={0}
              onMousedown={(e: MouseEvent) => e.stopPropagation()}
              onClick={(e: MouseEvent) => onCollapseClick(e, 'start')}
              onKeydown={(e: KeyboardEvent) => onCollapseKeyDown(e, 'start')}
            >
              <span class={classNames(`${barCls}-collapse-icon`, `${barCls}-collapse-start`)}>
                {renderedStartIcon}
              </span>
            </div>
          )}
          {props.endCollapsible && (
            <div
              class={classNames(
                `${barCls}-collapse-bar`,
                `${barCls}-collapse-bar-end`,
                {
                  [`${barCls}-collapse-bar-customize`]: endCustomize,
                },
                getVisibilityClass(props.showEndCollapsibleIcon),
              )}
              role="button"
              tabindex={0}
              onMousedown={(e: MouseEvent) => e.stopPropagation()}
              onClick={(e: MouseEvent) => onCollapseClick(e, 'end')}
              onKeydown={(e: KeyboardEvent) => onCollapseKeyDown(e, 'end')}
            >
              <span class={classNames(`${barCls}-collapse-icon`, `${barCls}-collapse-end`)}>
                {renderedEndIcon}
              </span>
            </div>
          )}
        </div>
      );
    };
  },
});
