import type { Ref, VNode } from 'vue';
import { shallowRef, computed, defineComponent, unref } from 'vue';
import { useNotification as useVcNotification } from '../vc-notification';
import type { NotificationAPI } from '../vc-notification';
import type {
  NotificationInstance,
  ArgsProps,
  NotificationPlacement,
  NotificationConfig,
  NotificationClosable,
  NotificationStack,
} from './interface';

import useStyle from './style';
import { getCloseIcon, PureContent } from './PurePanel';
import { getMotion, getPlacementStyle } from './util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
import type { Key } from '../_util/type';

const DEFAULT_OFFSET = 24;
const DEFAULT_DURATION = 4.5;

// ==============================================================================
// ==                                  Holder                                  ==
// ==============================================================================
type HolderProps = NotificationConfig & {
  onAllRemoved?: VoidFunction;
  getPopupContainer?: () => HTMLElement;
};

interface HolderRef extends NotificationAPI {
  prefixCls: string;
  hashId: any;
  notification?: any;
}

const Holder = defineComponent({
  name: 'Holder',
  inheritAttrs: false,
  props: [
    'prefixCls',
    'class',
    'type',
    'icon',
    'content',
    'onAllRemoved',
    'top',
    'bottom',
    'duration',
    'getContainer',
    'getPopupContainer',
    'placement',
    'closable',
    'closeIcon',
    'showProgress',
    'pauseOnHover',
    'stack',
    'maxCount',
    'rtl',
  ],
  setup(props: HolderProps, { expose }) {
    const { getPrefixCls, getPopupContainer, direction, configProvider } = useConfigInject(
      'notification',
      props,
    );
    const prefixCls = computed(() => props.prefixCls || getPrefixCls('notification'));
    const contextNotification = computed(() => configProvider.notification?.value);
    // =============================== Style ===============================
    const getStyles = (placement: NotificationPlacement) =>
      getPlacementStyle(placement, props.top ?? DEFAULT_OFFSET, props.bottom ?? DEFAULT_OFFSET);

    // Style
    const [, hashId] = useStyle(prefixCls);

    const getClassName = () =>
      classNames(hashId.value, {
        [`${prefixCls.value}-rtl`]: props.rtl ?? direction.value === 'rtl',
      });

    // ============================== Motion ===============================
    const getNotificationMotion = () => getMotion(prefixCls.value);

    // ============================== Origin ===============================
    const mergedStack = computed<NotificationStack>(() => {
      const rawStack = unref(props.stack);
      return rawStack === undefined ? { threshold: 3 } : rawStack;
    });

    const [api, holder] = useVcNotification({
      prefixCls: prefixCls.value,
      getStyles,
      getClassName,
      motion: getNotificationMotion,
      closable: props.closable ?? true,
      closeIcon: getCloseIcon(
        prefixCls.value,
        typeof props.closeIcon === 'function'
          ? props.closeIcon()
          : props.closeIcon ?? contextNotification.value?.closeIcon,
      ),
      duration: props.duration ?? DEFAULT_DURATION,
      showProgress: props.showProgress,
      pauseOnHover: props.pauseOnHover,
      stack: mergedStack,
      getContainer: () =>
        props.getContainer?.() ||
        props.getPopupContainer?.() ||
        getPopupContainer.value?.() ||
        document.body,
      maxCount: props.maxCount,
      hashId: hashId.value,
      onAllRemoved: props.onAllRemoved,
    });

    // ================================ Ref ================================
    expose({
      ...api,
      prefixCls: prefixCls.value,
      hashId,
      notification: contextNotification,
    });
    return holder;
  },
});

// ==============================================================================
// ==                                   Hook                                   ==
// ==============================================================================
export function useInternalNotification(
  notificationConfig?: HolderProps | Ref<HolderProps>,
): readonly [NotificationInstance, () => VNode] {
  const holderRef = shallowRef<HolderRef>(null);
  const holderKey = Symbol('notificationHolderKey');
  // ================================ API ================================
  // Wrap with notification content

  // >>> Open
  const open = (config: ArgsProps) => {
    if (!holderRef.value) {
      return;
    }
    const resolvedConfig = unref(notificationConfig);
    const {
      open: originOpen,
      prefixCls,
      hashId,
      notification: contextNotificationRef,
    } = holderRef.value;
    const contextNotification = contextNotificationRef?.value ?? contextNotificationRef;
    const noticePrefixCls = `${prefixCls}-notice`;

    const {
      message,
      description,
      icon,
      type,
      btn,
      actions,
      class: className,
      style,
      closable,
      closeIcon,
      showProgress,
      pauseOnHover,
      ...restConfig
    } = config;
    const mergedActions = actions ?? btn;
    const resolvedCloseIcon =
      closeIcon !== undefined
        ? closeIcon
        : resolvedConfig?.closeIcon !== undefined
        ? resolvedConfig.closeIcon
        : contextNotification?.closeIcon;
    const rawClosable: NotificationClosable =
      closable !== undefined
        ? closable
        : resolvedConfig?.closable !== undefined
        ? resolvedConfig.closable
        : true;
    const resolvedClosable: NotificationClosable =
      rawClosable && typeof rawClosable === 'object'
        ? {
            ...rawClosable,
            ...(rawClosable.closeIcon !== undefined
              ? {
                  closeIcon: getCloseIcon(
                    prefixCls,
                    typeof rawClosable.closeIcon === 'function'
                      ? rawClosable.closeIcon()
                      : rawClosable.closeIcon,
                  ),
                }
              : {}),
          }
        : rawClosable;
    return originOpen({
      placement: resolvedConfig?.placement ?? 'topRight',
      ...restConfig,
      closable: resolvedClosable,
      ...(resolvedCloseIcon !== undefined
        ? {
            closeIcon: getCloseIcon(
              prefixCls,
              typeof resolvedCloseIcon === 'function' ? resolvedCloseIcon() : resolvedCloseIcon,
            ),
          }
        : {}),
      showProgress: showProgress ?? resolvedConfig?.showProgress,
      pauseOnHover: pauseOnHover ?? resolvedConfig?.pauseOnHover,
      content: () => (
        <PureContent
          prefixCls={noticePrefixCls}
          icon={typeof icon === 'function' ? icon() : icon}
          type={type}
          message={typeof message === 'function' ? message() : message}
          description={typeof description === 'function' ? description() : description}
          btn={typeof mergedActions === 'function' ? mergedActions() : mergedActions}
        />
      ),
      style: { ...(contextNotification?.style || {}), ...(style || {}) },
      // @ts-ignore
      class: classNames(
        type && `${noticePrefixCls}-${type}`,
        hashId?.value ?? hashId,
        contextNotification?.className,
        className,
      ),
    });
  };

  // >>> destroy
  const destroy = (key?: Key) => {
    if (key !== undefined) {
      holderRef.value?.close(key);
    } else {
      holderRef.value?.destroy();
    }
  };

  const wrapAPI = {
    open,
    destroy,
  } as NotificationInstance;

  const keys = ['success', 'info', 'warning', 'error'] as const;
  keys.forEach(type => {
    wrapAPI[type] = config =>
      open({
        ...config,
        type,
      });
  });

  // ============================== Return ===============================
  return [
    wrapAPI,
    () => {
      const resolvedConfig = unref(notificationConfig);
      return (
        <Holder
          key={holderKey}
          {...resolvedConfig}
          stack={resolvedConfig ? unref(resolvedConfig.stack) : undefined}
          ref={holderRef}
        />
      );
    },
  ] as const;
}

export default function useNotification(
  notificationConfig?: NotificationConfig | Ref<NotificationConfig>,
) {
  return useInternalNotification(notificationConfig);
}
