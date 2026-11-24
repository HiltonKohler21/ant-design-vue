import type { ComputedRef, Ref, VNode } from 'vue';
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
  NotificationSemanticClassNames,
  NotificationSemanticStyles,
} from './interface';

import useStyle from './style';
import { getCloseIcon, PureContent, resolveClosableConfig } from './PurePanel';
import { getMotion, getPlacementStyle } from './util';
import { globalConfig } from '../config-provider';
import { useComponentConfig } from '../config-provider/context';
import type { NotificationConfig as CPNotificationConfig } from '../config-provider/context';
import classNames from '../_util/classNames';
import type { Key } from '../_util/type';
import { mergeSemantic, useMergeSemantic } from '../_util/hooks/useMergeSemantic';

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
  notification?: ComputedRef<CPNotificationConfig>;
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
    'classNames',
    'styles',
  ],
  setup(props: HolderProps, { expose }) {
    const {
      getPrefixCls,
      getPopupContainer,
      direction,
      holderRender,
      componentConfig: contextNotification,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('notification');

    const prefixCls = computed(() => props.prefixCls || getPrefixCls('notification'));

    const [holderMergedClassNames, holderMergedStyles] = useMergeSemantic<
      NotificationSemanticClassNames,
      NotificationSemanticStyles,
      HolderProps
    >(
      () => [contextClassNames.value as any, props.classNames],
      () => [contextStyles.value as any, props.styles],
      () => ({ props }),
    );

    // =============================== Style ===============================
    const getStyles = (placement: NotificationPlacement) => ({
      ...getPlacementStyle(placement, props.top ?? DEFAULT_OFFSET, props.bottom ?? DEFAULT_OFFSET),
      ...(holderMergedStyles.value.list || {}),
    });

    // Style
    const [, hashId] = useStyle(prefixCls);

    const getClassName = () =>
      classNames(
        hashId.value,
        {
          [`${prefixCls.value}-rtl`]: props.rtl ?? direction.value === 'rtl',
        },
        holderMergedClassNames.value.list,
      );

    // ============================== Motion ===============================
    const getNotificationMotion = () => getMotion(prefixCls.value);

    // ============================== Origin ===============================
    const mergedStack = computed<NotificationStack>(() => {
      const rawStack = unref(props.stack);
      return rawStack === undefined ? { threshold: 3 } : rawStack;
    });

    const resolvedDuration = props.duration === false ? null : props.duration ?? DEFAULT_DURATION;
    const initialClosable = resolveClosableConfig(
      prefixCls.value,
      props.closable !== undefined ? props.closable : true,
      props.closeIcon !== undefined ? props.closeIcon : contextNotification.value?.closeIcon,
      holderMergedClassNames.value.close,
      holderMergedStyles.value.close,
    );

    const [api, holder] = useVcNotification({
      prefixCls: prefixCls.value,
      getStyles,
      getClassName,
      motion: getNotificationMotion,
      closable: initialClosable.closable,
      closeIcon:
        initialClosable.closeIcon ??
        getCloseIcon(
          prefixCls.value,
          props.closeIcon !== undefined ? props.closeIcon : contextNotification.value?.closeIcon,
          holderMergedClassNames.value.close,
          holderMergedStyles.value.close,
        ),
      duration: resolvedDuration as number | undefined,
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
    return () => {
      const dom = holder();
      const mergedHolderRender = holderRender?.value ?? globalConfig().holderRender;
      return mergedHolderRender ? mergedHolderRender(dom) : dom;
    };
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
    const contextNotification = contextNotificationRef?.value ?? (contextNotificationRef as any);
    const noticePrefixCls = `${prefixCls}-notice`;

    const {
      title,
      message,
      description,
      icon,
      type,
      btn,
      actions,
      class: className,
      className: aliasClassName,
      style,
      classNames: configClassNames,
      styles: configStyles,
      closable,
      closeIcon,
      showProgress,
      pauseOnHover,
      duration,
      role = 'alert',
      props: divProps,
      ...restConfig
    } = config;

    const mergedTitle = title ?? message;
    const mergedActions = actions ?? btn;
    const rawDuration = duration !== undefined ? duration : resolvedConfig?.duration;
    const normalizedDuration = rawDuration === false ? null : rawDuration;

    const mergedProps: ArgsProps = {
      ...config,
      title: mergedTitle,
      actions: mergedActions,
      placement: config.placement ?? resolvedConfig?.placement ?? 'topRight',
      duration: rawDuration ?? DEFAULT_DURATION,
      showProgress: showProgress ?? resolvedConfig?.showProgress,
      pauseOnHover: pauseOnHover ?? resolvedConfig?.pauseOnHover,
      role,
    };

    const [mergedClassNames, mergedStyles] = mergeSemantic<
      NotificationSemanticClassNames,
      NotificationSemanticStyles,
      ArgsProps
    >(
      [contextNotification?.classNames, resolvedConfig?.classNames, configClassNames],
      [contextNotification?.styles, resolvedConfig?.styles, configStyles],
      { props: mergedProps },
    );

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

    const { closable: resolvedClosable, closeIcon: wrappedCloseIcon } = resolveClosableConfig(
      prefixCls,
      rawClosable,
      resolvedCloseIcon,
      mergedClassNames.close,
      mergedStyles.close,
    );

    return originOpen({
      placement: resolvedConfig?.placement ?? 'topRight',
      ...restConfig,
      ...(normalizedDuration !== undefined ? { duration: normalizedDuration } : {}),
      props: divProps,
      closable: resolvedClosable,
      ...(wrappedCloseIcon !== undefined ? { closeIcon: wrappedCloseIcon } : {}),
      showProgress: showProgress ?? resolvedConfig?.showProgress,
      pauseOnHover: pauseOnHover ?? resolvedConfig?.pauseOnHover,
      content: () => (
        <PureContent
          prefixCls={noticePrefixCls}
          icon={icon}
          type={type}
          title={mergedTitle}
          description={description}
          actions={mergedActions}
          role={role}
          classNames={mergedClassNames}
          styles={mergedStyles}
        />
      ),
      style: {
        ...(contextNotification?.style || {}),
        ...(mergedStyles.root || {}),
        ...(style || {}),
      },
      // @ts-ignore
      class: classNames(
        type && `${noticePrefixCls}-${type}`,
        hashId?.value ?? hashId,
        contextNotification?.className,
        mergedClassNames.root,
        className,
        aliasClassName,
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
