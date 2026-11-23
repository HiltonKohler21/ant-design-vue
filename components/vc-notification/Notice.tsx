import type { Key } from '../_util/type';
import { Teleport, computed, defineComponent, onMounted, watch, onUnmounted, ref } from 'vue';
import type { HTMLAttributes, CSSProperties } from 'vue';
import type { MouseEventHandler } from '../_util/EventInterface';
import classNames from '../_util/classNames';

interface DivProps extends HTMLAttributes {
  // Ideally we would allow all data-* props but this would depend on https://github.com/microsoft/TypeScript/issues/28960
  'data-testid'?: string;
}

export interface NoticeClosableType {
  closeIcon?: any;
  disabled?: boolean;
  onClose?: () => void;
  'aria-label'?: string;
  [key: `aria-${string}`]: any;
  [key: `data-${string}`]: any;
}

export type NoticeClosable = boolean | NoticeClosableType;

export interface NoticeProps {
  prefixCls: string;
  duration?: number | null;
  updateMark?: string;
  /** Mark as final key since set maxCount may keep the key but user pass key is different */
  noticeKey: Key;
  closeIcon?: any;
  closable?: NoticeClosable;
  showProgress?: boolean;
  pauseOnHover?: boolean;
  props?: DivProps;
  onClick?: MouseEventHandler;
  onClose?: (key: Key) => void;

  /** @private Only for internal usage. We don't promise that we will refactor this */
  holder?: HTMLDivElement;

  /** @private Provided by CSSMotionList */
  visible?: boolean;
}

const PROGRESS_UPDATE_INTERVAL = 100;

export default defineComponent<NoticeProps>({
  name: 'Notice',
  inheritAttrs: false,
  props: [
    'prefixCls',
    'duration',
    'updateMark',
    'noticeKey',
    'closeIcon',
    'closable',
    'showProgress',
    'pauseOnHover',
    'props',
    'onClick',
    'onClose',
    'holder',
    'visible',
  ] as any,
  setup(props, { attrs, slots }) {
    let closeTimer: any = null;
    let progressTimer: any = null;
    let startTime = 0;
    let isUnMounted = false;
    const hovering = ref(false);
    const spentTime = ref(0);
    const percent = ref(0);

    const duration = computed(() => (props.duration === undefined ? 4.5 : props.duration));
    const pauseOnHover = computed(() => props.pauseOnHover !== false);
    const showProgress = computed(() =>
      Boolean(props.showProgress && duration.value && duration.value > 0),
    );

    const clearProgressTimer = () => {
      if (progressTimer) {
        clearTimeout(progressTimer);
        progressTimer = null;
      }
    };

    const clearCloseTimer = () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      clearProgressTimer();
    };

    const scheduleProgressTick = () => {
      clearProgressTimer();
      if (!showProgress.value || hovering.value || isUnMounted || !duration.value) {
        return;
      }
      const totalMs = duration.value * 1000;
      const elapsed = spentTime.value + (startTime ? Date.now() - startTime : 0);
      const nextPercent = Math.min(100, (elapsed / totalMs) * 100);
      percent.value = nextPercent;
      if (nextPercent < 100) {
        progressTimer = setTimeout(() => {
          scheduleProgressTick();
        }, PROGRESS_UPDATE_INTERVAL);
      }
    };

    const startCloseTimer = () => {
      if (duration.value && duration.value > 0 && !isUnMounted) {
        const totalMs = duration.value * 1000;
        const remaining = Math.max(0, totalMs - spentTime.value);
        startTime = Date.now();
        closeTimer = setTimeout(() => {
          percent.value = 100;
          close();
        }, remaining);
        if (showProgress.value) {
          scheduleProgressTick();
        }
      }
    };

    const closableObj = computed<NoticeClosableType | null>(() =>
      props.closable && typeof props.closable === 'object'
        ? (props.closable as NoticeClosableType)
        : null,
    );
    const closeDisabled = computed(() => Boolean(closableObj.value?.disabled));

    const close = (e?: MouseEvent) => {
      if (e && closeDisabled.value) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e) {
        e.stopPropagation();
      }
      clearCloseTimer();
      const { onClose, noticeKey } = props;
      if (e) {
        closableObj.value?.onClose?.();
      }
      if (onClose) {
        onClose(noticeKey);
      }
    };

    const restartCloseTimer = () => {
      clearCloseTimer();
      spentTime.value = 0;
      percent.value = 0;
      hovering.value = false;
      startTime = 0;
      startCloseTimer();
    };

    const handleMouseEnter = () => {
      if (!pauseOnHover.value) {
        return;
      }
      hovering.value = true;
      if (startTime) {
        spentTime.value += Date.now() - startTime;
        startTime = 0;
        if (duration.value && duration.value > 0) {
          percent.value = Math.min(100, (spentTime.value / (duration.value * 1000)) * 100);
        }
      }
      clearCloseTimer();
    };

    const handleMouseLeave = () => {
      if (!pauseOnHover.value) {
        return;
      }
      if (hovering.value) {
        hovering.value = false;
        startCloseTimer();
      }
    };

    onMounted(() => {
      startCloseTimer();
    });
    onUnmounted(() => {
      isUnMounted = true;
      clearCloseTimer();
    });

    watch(
      [duration, () => props.updateMark, () => props.visible],
      ([preDuration, preUpdateMark, preVisible], [newDuration, newUpdateMark, newVisible]) => {
        if (
          preDuration !== newDuration ||
          preUpdateMark !== newUpdateMark ||
          (preVisible !== newVisible && newVisible)
        ) {
          restartCloseTimer();
        }
      },
      { flush: 'post' },
    );

    return () => {
      const { prefixCls, closable, closeIcon = slots.closeIcon?.(), onClick, holder } = props;
      const { class: className, style } = attrs;
      const componentClass = `${prefixCls}-notice`;
      const isClosable = Boolean(closable);
      const closableConfig = closableObj.value;
      const closableAriaOrDataProps: Record<string, any> = {};
      if (closableConfig) {
        Object.keys(closableConfig).forEach(key => {
          if (key.startsWith('aria-') || key.startsWith('data-')) {
            closableAriaOrDataProps[key] = (closableConfig as any)[key];
          }
        });
      }
      const rawClosableIcon = closableConfig?.closeIcon;
      const mergedCloseIcon =
        rawClosableIcon !== undefined
          ? typeof rawClosableIcon === 'function'
            ? rawClosableIcon()
            : rawClosableIcon
          : closeIcon;
      const dataOrAriaAttributeProps = Object.keys(attrs).reduce(
        (acc: Record<string, string>, key: string) => {
          if (key.startsWith('data-') || key.startsWith('aria-') || key === 'role') {
            acc[key] = (attrs as any)[key];
          }
          return acc;
        },
        {},
      );
      const validPercent = Math.round(100 - Math.min(Math.max(percent.value, 0), 100));
      const node = (
        <div
          class={classNames(componentClass, className, {
            [`${componentClass}-closable`]: isClosable,
          })}
          style={style as CSSProperties}
          onMouseenter={handleMouseEnter}
          onMouseleave={handleMouseLeave}
          onClick={onClick}
          {...dataOrAriaAttributeProps}
        >
          <div class={`${componentClass}-content`}>{slots.default?.()}</div>
          {isClosable ? (
            <a
              tabindex={closeDisabled.value ? -1 : 0}
              onClick={close}
              aria-disabled={closeDisabled.value ? 'true' : undefined}
              class={classNames(`${componentClass}-close`, {
                [`${componentClass}-close-disabled`]: closeDisabled.value,
              })}
              {...closableAriaOrDataProps}
            >
              {mergedCloseIcon || <span class={`${componentClass}-close-x`} />}
            </a>
          ) : null}
          {showProgress.value ? (
            <progress class={`${componentClass}-progress`} max="100" value={validPercent}>
              {`${validPercent}%`}
            </progress>
          ) : null}
        </div>
      );

      if (holder) {
        return <Teleport to={holder} v-slots={{ default: () => node }}></Teleport>;
      }

      return node;
    };
  },
});
