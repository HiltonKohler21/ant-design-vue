import { shallowRef, computed, defineComponent, unref } from 'vue';
import type { ComputedRef, Ref, VNode } from 'vue';
import { useNotification as useVcNotification } from '../vc-notification';
import type { NotificationAPI } from '../vc-notification';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import useStyle from './style';
import type {
  MessageInstance,
  ArgsProps,
  MessageType,
  ConfigOptions,
  NoticeType,
  TypeOpen,
  MessageSemanticClassNames,
  MessageSemanticStyles,
} from './interface';

import { PureContent } from './PurePanel';
import { getMotion } from '../vc-trigger/utils/motionUtil';
import type { Key } from '../_util/type';
import { wrapPromiseFn } from '../_util/util';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import { globalConfig } from '../config-provider';
import type { MessageConfig } from '../config-provider/context';
import classNames from '../_util/classNames';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';

const DEFAULT_OFFSET = 8;
const DEFAULT_DURATION = 3;

// ==============================================================================
// ==                                  Holder                                  ==
// ==============================================================================
type HolderProps = ConfigOptions & {
  onAllRemoved?: VoidFunction;
};

type MaybeRefConfig = HolderProps | Ref<HolderProps> | ComputedRef<HolderProps>;

interface HolderRef extends NotificationAPI {
  prefixCls: string;
  hashId: string;
  message?: ComputedRef<MessageConfig>;
}

const Holder = defineComponent({
  name: 'Holder',
  inheritAttrs: false,
  props: [
    'top',
    'prefixCls',
    'getContainer',
    'maxCount',
    'duration',
    'rtl',
    'stack',
    'pauseOnHover',
    'classNames',
    'styles',
    'transitionName',
    'onAllRemoved',
    'animation',
    'staticGetContainer',
  ],
  setup(props, { expose }) {
    const { getPrefixCls, getPopupContainer, direction, holderRender } = useConfigInject(
      'message',
      props,
    );
    const {
      componentConfig: contextMessage,
      classNames: contextClassNames,
      styles: contextStyles,
    } = useComponentConfig('message');

    const prefixCls = computed(() => getPrefixCls('message', props.prefixCls));

    const [, hashId] = useStyle(prefixCls);

    const resolveHolderSemantic = () =>
      mergeSemantic<MessageSemanticClassNames, MessageSemanticStyles, ArgsProps>(
        [contextClassNames.value, props.classNames],
        [contextStyles.value, props.styles],
        { props: props as unknown as ArgsProps },
      );

    // =============================== Style ===============================
    const getStyles = () => {
      const [, holderStyles] = resolveHolderSemantic();
      const top = props.top ?? DEFAULT_OFFSET;
      return {
        left: '50%',
        transform: 'translateX(-50%)',
        top: typeof top === 'number' ? `${top}px` : top,
        ...holderStyles.list,
      };
    };
    const getClassName = () => {
      const [holderClassNames] = resolveHolderSemantic();
      return classNames(
        hashId.value,
        props.rtl ?? direction.value === 'rtl' ? `${prefixCls.value}-rtl` : '',
        holderClassNames.list,
      );
    };

    // ============================== Motion ===============================
    const getNotificationMotion = () =>
      getMotion({
        prefixCls: prefixCls.value,
        animation: props.animation ?? `move-up`,
        transitionName: props.transitionName,
      });

    // ============================ Close Icon =============================
    const mergedCloseIcon = (
      <span class={`${prefixCls.value}-close-x`}>
        <CloseOutlined class={`${prefixCls.value}-close-icon`} />
      </span>
    );
    // ============================== Origin ===============================
    const stackRef = computed(() => unref(props.stack));
    const [api, holder] = useVcNotification({
      //@ts-ignore
      getStyles,
      prefixCls: prefixCls.value,
      getClassName,
      motion: getNotificationMotion,
      closable: false,
      closeIcon: mergedCloseIcon,
      duration: props.duration ?? DEFAULT_DURATION,
      getContainer: props.staticGetContainer ?? getPopupContainer.value,
      maxCount: props.maxCount,
      stack: stackRef,
      pauseOnHover: props.pauseOnHover,
      onAllRemoved: props.onAllRemoved,
    });

    // ================================ Ref ================================
    expose({
      ...api,
      prefixCls,
      hashId,
      message: contextMessage,
    });
    return () => {
      const dom = holder();
      const mergedHolderRender = holderRender.value ?? globalConfig().holderRender;
      return mergedHolderRender ? mergedHolderRender(dom) : dom;
    };
  },
});

// ==============================================================================
// ==                                   Hook                                   ==
// ==============================================================================
let keyIndex = 0;

export function useInternalMessage(
  messageConfig?: MaybeRefConfig,
): readonly [MessageInstance, () => VNode] {
  const holderRef = shallowRef<HolderRef>(null);
  const holderKey = Symbol('messageHolderKey');
  // ================================ API ================================

  // Wrap with notification content
  // >>> close
  const close = (key: Key) => {
    holderRef.value?.close(key);
  };

  // >>> Open
  const open = (config: ArgsProps): MessageType => {
    if (!holderRef.value) {
      const fakeResult: any = () => {};
      fakeResult.then = () => {};
      return fakeResult;
    }

    const { open: originOpen, prefixCls, hashId, message: contextMessage } = holderRef.value;
    const noticePrefixCls = `${prefixCls}-notice`;
    const {
      content,
      icon,
      type,
      key,
      class: className,
      className: propClassName,
      style,
      classNames: configClassNames,
      styles: configStyles,
      onClose,
      ...restConfig
    } = config;
    const ctxMsg = contextMessage?.value || (contextMessage as any);
    const resolvedMessageConfig = unref(messageConfig);

    let mergedKey: Key = key!;
    if (mergedKey === undefined || mergedKey === null) {
      keyIndex += 1;
      mergedKey = `antd-message-${keyIndex}`;
    }

    const mergedPropsForSemantic = {
      ...resolvedMessageConfig,
      ...config,
    } as ArgsProps;

    const [mergedClassNames, mergedStyles] = mergeSemantic<
      MessageSemanticClassNames,
      MessageSemanticStyles,
      ArgsProps
    >(
      [ctxMsg?.classNames, resolvedMessageConfig?.classNames, configClassNames],
      [ctxMsg?.styles, resolvedMessageConfig?.styles, configStyles],
      { props: mergedPropsForSemantic },
    );

    const mergedRootStyle =
      ctxMsg?.style || mergedStyles.root || style
        ? { ...ctxMsg?.style, ...mergedStyles.root, ...style }
        : undefined;

    return wrapPromiseFn(resolve => {
      originOpen({
        ...restConfig,
        key: mergedKey,
        content: () => (
          <PureContent
            prefixCls={prefixCls}
            type={type}
            icon={typeof icon === 'function' ? icon() : icon}
            classNames={mergedClassNames}
            styles={mergedStyles}
          >
            {typeof content === 'function' ? content() : content}
          </PureContent>
        ),
        placement: 'top',
        // @ts-ignore
        class: classNames(
          type && `${noticePrefixCls}-${type}`,
          hashId,
          ctxMsg?.className,
          mergedClassNames.root,
          className,
          propClassName,
        ),
        // @ts-ignore
        style: mergedRootStyle,
        onClose: () => {
          onClose?.();
          resolve();
        },
      });

      // Return close function
      return () => {
        close(mergedKey);
      };
    });
  };

  // >>> destroy
  const destroy = (key?: Key) => {
    if (key !== undefined) {
      close(key);
    } else {
      holderRef.value?.destroy();
    }
  };

  const wrapAPI = {
    open,
    destroy,
  } as MessageInstance;

  const keys: NoticeType[] = ['info', 'success', 'warning', 'error', 'loading'];
  keys.forEach(type => {
    const typeOpen: TypeOpen = (jointContent, duration, onClose) => {
      let config: ArgsProps;
      if (jointContent && typeof jointContent === 'object' && 'content' in jointContent) {
        config = jointContent;
      } else {
        config = {
          content: jointContent as VNode,
        };
      }

      // Params
      let mergedDuration: number | undefined;
      let mergedOnClose: VoidFunction | undefined;
      if (typeof duration === 'function') {
        mergedOnClose = duration;
      } else {
        mergedDuration = duration;
        mergedOnClose = onClose;
      }

      const mergedConfig = {
        onClose: mergedOnClose,
        duration: mergedDuration,
        ...config,
        type,
      };

      return open(mergedConfig);
    };

    wrapAPI[type] = typeOpen;
  });

  // ============================== Return ===============================
  return [
    wrapAPI,
    () => <Holder key={holderKey} {...unref(messageConfig)} ref={holderRef} />,
  ] as const;
}

export default function useMessage(
  messageConfig?: ConfigOptions | Ref<ConfigOptions> | ComputedRef<ConfigOptions>,
) {
  return useInternalMessage(messageConfig);
}
