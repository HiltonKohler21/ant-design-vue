import { computed, defineComponent, ref, watch, onBeforeUnmount, type PropType } from 'vue';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import LeftOutlined from '@ant-design/icons-vue/LeftOutlined';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import UpOutlined from '@ant-design/icons-vue/UpOutlined';
import classNames from '../_util/classNames';
import type { ShowCollapsibleIconMode } from './interface';

function getValidNumber(num: number): number {
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
  lazy: { type: Boolean, default: false },
  containerSize: { type: Number, default: 0 },
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
    const splitBarPrefixCls = `${props.prefixCls}-bar`;
    const startPos = ref<[number, number] | null>(null);
    const constrainedOffset = ref(0);

    const constrainedOffsetX = computed(() => (props.vertical ? 0 : constrainedOffset.value));
    const constrainedOffsetY = computed(() => (props.vertical ? constrainedOffset.value : 0));

    const onMouseDown = (e: MouseEvent) => {
      if (props.resizable && e.currentTarget) {
        startPos.value = [e.pageX, e.pageY];
        props.onOffsetStart?.(props.index);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (props.resizable && e.touches.length === 1) {
        const touch = e.touches[0];
        startPos.value = [touch.pageX, touch.pageY];
        props.onOffsetStart?.(props.index);
      }
    };

    const getConstrainedOffset = (rawOffset: number) => {
      const currentPos = (props.containerSize * props.ariaNow) / 100;
      const newPos = currentPos + rawOffset;
      const minAllowed = Math.max(0, (props.containerSize * props.ariaMin) / 100);
      const maxAllowed = Math.min(props.containerSize, (props.containerSize * props.ariaMax) / 100);
      const clampedPos = Math.max(minAllowed, Math.min(maxAllowed, newPos));
      return clampedPos - currentPos;
    };

    const handleLazyMove = (offsetX: number, offsetY: number) => {
      const constrainedOffsetValue = getConstrainedOffset(props.vertical ? offsetY : offsetX);
      constrainedOffset.value = constrainedOffsetValue;
    };

    const handleLazyEnd = () => {
      props.onOffsetUpdate?.(props.index, constrainedOffsetX.value, constrainedOffsetY.value, true);
      constrainedOffset.value = 0;
      props.onOffsetEnd?.(true);
    };

    const getVisibilityClass = (mode: ShowCollapsibleIconMode) => {
      switch (mode) {
        case true:
          return `${splitBarPrefixCls}-collapse-bar-always-visible`;
        case false:
          return `${splitBarPrefixCls}-collapse-bar-always-hidden`;
        case 'auto':
          return `${splitBarPrefixCls}-collapse-bar-hover-only`;
      }
    };

    watch(
      startPos,
      newStartPos => {
        if (!newStartPos) return;

        const onMouseMove = (e: MouseEvent) => {
          const offsetX = e.pageX - newStartPos[0];
          const offsetY = e.pageY - newStartPos[1];
          if (props.lazy) {
            handleLazyMove(offsetX, offsetY);
          } else {
            props.onOffsetUpdate?.(props.index, offsetX, offsetY);
          }
        };

        const onMouseUp = () => {
          if (props.lazy) {
            handleLazyEnd();
          } else {
            props.onOffsetEnd?.();
          }
          startPos.value = null;
        };

        const handleTouchMove = (e: TouchEvent) => {
          if (e.touches.length === 1) {
            const touch = e.touches[0];
            const offsetX = touch.pageX - newStartPos[0];
            const offsetY = touch.pageY - newStartPos[1];
            if (props.lazy) {
              handleLazyMove(offsetX, offsetY);
            } else {
              props.onOffsetUpdate?.(props.index, offsetX, offsetY);
            }
          }
        };

        const handleTouchEnd = () => {
          if (props.lazy) {
            handleLazyEnd();
          } else {
            props.onOffsetEnd?.();
          }
          startPos.value = null;
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);

        onBeforeUnmount(() => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
          window.removeEventListener('touchmove', handleTouchMove);
          window.removeEventListener('touchend', handleTouchEnd);
        });
      },
      { flush: 'post' },
    );

    const transformStyle = {
      [`--${splitBarPrefixCls}-preview-offset`]: `${constrainedOffset.value}px`,
    };

    const StartIcon = props.vertical ? UpOutlined : LeftOutlined;
    const EndIcon = props.vertical ? DownOutlined : RightOutlined;

    return () => (
      <div
        class={splitBarPrefixCls}
        role="separator"
        aria-valuenow={getValidNumber(props.ariaNow)}
        aria-valuemin={getValidNumber(props.ariaMin)}
        aria-valuemax={getValidNumber(props.ariaMax)}
      >
        {props.lazy && (
          <div
            class={classNames(`${splitBarPrefixCls}-preview`, {
              [`${splitBarPrefixCls}-preview-active`]: !!constrainedOffset.value,
            })}
            style={transformStyle}
          />
        )}
        <div
          class={classNames(`${splitBarPrefixCls}-dragger`, {
            [`${splitBarPrefixCls}-dragger-disabled`]: !props.resizable,
            [`${splitBarPrefixCls}-dragger-active`]: props.active,
          })}
          onMousedown={onMouseDown}
          onTouchstart={onTouchStart}
        />
        {props.startCollapsible && (
          <div
            class={classNames(
              `${splitBarPrefixCls}-collapse-bar`,
              `${splitBarPrefixCls}-collapse-bar-start`,
              getVisibilityClass(props.showStartCollapsibleIcon),
            )}
            onClick={() => props.onCollapse?.(props.index, 'start')}
          >
            <StartIcon
              class={classNames(
                `${splitBarPrefixCls}-collapse-icon`,
                `${splitBarPrefixCls}-collapse-start`,
              )}
            />
          </div>
        )}
        {props.endCollapsible && (
          <div
            class={classNames(
              `${splitBarPrefixCls}-collapse-bar`,
              `${splitBarPrefixCls}-collapse-bar-end`,
              getVisibilityClass(props.showEndCollapsibleIcon),
            )}
            onClick={() => props.onCollapse?.(props.index, 'end')}
          >
            <EndIcon
              class={classNames(
                `${splitBarPrefixCls}-collapse-icon`,
                `${splitBarPrefixCls}-collapse-end`,
              )}
            />
          </div>
        )}
      </div>
    );
  },
});
