import type { CSSProperties } from 'vue';
import { ref } from 'vue';
import Notification from '../vc-notification';
import type { VueNode } from '../_util/type';
import { globalConfig, globalConfigForApi } from '../config-provider';
import type { NotificationInstance as VCNotificationInstance } from '../vc-notification/Notification';
import classNames from '../_util/classNames';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import type {
  DivProps,
  NotificationClassNamesType,
  NotificationClosable,
  NotificationClosableType,
  NotificationConfig,
  NotificationSemanticClassNames,
  NotificationSemanticName,
  NotificationSemanticStyles,
  NotificationStack,
  NotificationStylesType,
  StackConfig,
} from './interface';
import useStyle from './style';
import useNotification from './useNotification';
import PurePanel, { getCloseIcon, PureContent, resolveClosableConfig } from './PurePanel';
import type { PurePanelProps } from './PurePanel';
import { getPlacementStyle } from './util';

export type {
  DivProps,
  NotificationClassNamesType,
  NotificationClosable,
  NotificationClosableType,
  NotificationConfig,
  NotificationSemanticClassNames,
  NotificationSemanticName,
  NotificationSemanticStyles,
  NotificationStack,
  NotificationStylesType,
  PurePanelProps,
  StackConfig,
};

export type NotificationPlacement =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight';

export type IconType = 'success' | 'info' | 'error' | 'warning';

export interface ConfigProps {
  top?: string | number;
  bottom?: string | number;
  duration?: number | null | false;
  prefixCls?: string;
  placement?: NotificationPlacement;
  getContainer?: () => HTMLElement;
  closable?: NotificationClosable;
  closeIcon?: VueNode | (() => VueNode);
  showProgress?: boolean;
  pauseOnHover?: boolean;
  stack?: NotificationStack;
  rtl?: boolean;
  maxCount?: number;
  props?: DivProps;
}

const notificationInstance: { [key: string]: VCNotificationInstance } = {};
let defaultDuration: number | null | false = 4.5;
let defaultTop = '24px';
let defaultBottom = '24px';
let defaultPrefixCls = '';
let defaultPlacement: NotificationPlacement = 'topRight';
let defaultGetContainer = () => document.body;
let defaultClosable: NotificationClosable = true;
let defaultCloseIcon: VueNode | (() => VueNode) | undefined = undefined;
let defaultShowProgress = false;
let defaultPauseOnHover = true;
const defaultStack = ref<NotificationStack>({ threshold: 3 });
let rtl = false;
let maxCount: number;
let defaultDivProps: DivProps | undefined = undefined;

function setNotificationConfig(options: ConfigProps) {
  const {
    duration,
    placement,
    bottom,
    top,
    getContainer,
    closable,
    closeIcon,
    prefixCls,
    showProgress,
    pauseOnHover,
    stack,
    props,
  } = options;
  if (prefixCls !== undefined) {
    defaultPrefixCls = prefixCls;
  }
  if (duration !== undefined) {
    defaultDuration = duration;
  }
  if (placement !== undefined) {
    defaultPlacement = placement;
  }
  if (bottom !== undefined) {
    defaultBottom = typeof bottom === 'number' ? `${bottom}px` : bottom;
  }
  if (top !== undefined) {
    defaultTop = typeof top === 'number' ? `${top}px` : top;
  }
  if (getContainer !== undefined) {
    defaultGetContainer = getContainer;
  }
  if (closable !== undefined) {
    defaultClosable = closable;
  }
  if (closeIcon !== undefined) {
    defaultCloseIcon = closeIcon;
  }
  if (showProgress !== undefined) {
    defaultShowProgress = showProgress;
  }
  if (pauseOnHover !== undefined) {
    defaultPauseOnHover = pauseOnHover;
  }
  if (stack !== undefined) {
    defaultStack.value = stack;
  }
  if (options.rtl !== undefined) {
    rtl = options.rtl;
  }
  if (options.maxCount !== undefined) {
    maxCount = options.maxCount;
  }
  if (props !== undefined) {
    defaultDivProps = props;
  }
}

function getNotificationInstance(
  {
    prefixCls: customizePrefixCls,
    placement = defaultPlacement,
    getContainer = defaultGetContainer,
    top,
    bottom,
    closeIcon = defaultCloseIcon,
    appContext,
  }: NotificationArgsProps,
  callback: (n: VCNotificationInstance) => void,
) {
  const { getPrefixCls } = globalConfig();
  const prefixCls = getPrefixCls('notification', customizePrefixCls || defaultPrefixCls);
  const cacheKey = `${prefixCls}-${placement}-${rtl}`;
  const cacheInstance = notificationInstance[cacheKey];
  if (cacheInstance) {
    Promise.resolve(cacheInstance).then(instance => {
      callback(instance);
    });

    return;
  }

  const notificationClass = classNames(`${prefixCls}-${placement}`, {
    [`${prefixCls}-rtl`]: rtl === true,
  });
  Notification.newInstance(
    {
      name: 'notification',
      prefixCls: customizePrefixCls || defaultPrefixCls,
      useStyle,
      class: notificationClass,
      style: getPlacementStyle(placement, top ?? defaultTop, bottom ?? defaultBottom),
      appContext,
      getContainer,
      closeIcon: ({ prefixCls: currentPrefixCls }) => getCloseIcon(currentPrefixCls, closeIcon),
      maxCount,
      stack: defaultStack,
      hasTransitionName: true,
    },
    (notification: any) => {
      notificationInstance[cacheKey] = notification;
      callback(notification);
    },
  );
}

export interface NotificationArgsProps {
  /** @deprecated Please use `title` instead */
  message?: VueNode | (() => VueNode);
  title?: VueNode | (() => VueNode);
  description?: VueNode | (() => VueNode);
  /** @deprecated Please use `actions` instead */
  btn?: VueNode | (() => VueNode);
  actions?: VueNode | (() => VueNode);
  key?: string;
  onClose?: () => void;
  duration?: number | null | false;
  icon?: VueNode | (() => VueNode);
  placement?: NotificationPlacement;
  maxCount?: number;
  style?: CSSProperties;
  prefixCls?: string;
  class?: string;
  className?: string;
  classNames?: NotificationClassNamesType<NotificationArgsProps>;
  styles?: NotificationStylesType<NotificationArgsProps>;
  readonly type?: IconType;
  onClick?: () => void;
  top?: string | number;
  bottom?: string | number;
  getContainer?: () => HTMLElement;
  closable?: NotificationClosable;
  closeIcon?: VueNode | (() => VueNode);
  showProgress?: boolean;
  pauseOnHover?: boolean;
  role?: 'alert' | 'status';
  props?: DivProps;
  appContext?: any;
}

function notice(args: NotificationArgsProps) {
  const { icon, type, description, title, message, actions, btn, role = 'alert' } = args;
  const rawDuration = args.duration === undefined ? defaultDuration : args.duration;
  const normalizedDuration = rawDuration === false ? null : rawDuration;
  const contextNotification = globalConfigForApi.notification;
  const { getPrefixCls } = globalConfig();
  const resolvedPrefixCls = getPrefixCls('notification', args.prefixCls || defaultPrefixCls);
  const noticePrefixCls = `${resolvedPrefixCls}-notice`;
  const mergedTitle = title ?? message;
  const mergedActions = actions ?? btn;

  const mergedProps: NotificationArgsProps = {
    ...args,
    title: mergedTitle,
    actions: mergedActions,
    placement: args.placement ?? defaultPlacement,
    duration: rawDuration,
    showProgress: args.showProgress ?? defaultShowProgress,
    pauseOnHover: args.pauseOnHover ?? defaultPauseOnHover,
    role,
  };

  const [mergedClassNames, mergedStyles] = mergeSemantic<
    NotificationSemanticClassNames,
    NotificationSemanticStyles,
    NotificationArgsProps
  >(
    [contextNotification?.classNames, args.classNames],
    [contextNotification?.styles, args.styles],
    {
      props: mergedProps,
    },
  );

  const rawClosable = args.closable !== undefined ? args.closable : defaultClosable;
  const mergedCloseIcon =
    args.closeIcon !== undefined
      ? args.closeIcon
      : defaultCloseIcon !== undefined
      ? defaultCloseIcon
      : contextNotification?.closeIcon;

  const { closable: resolvedClosable, closeIcon: wrappedCloseIcon } = resolveClosableConfig(
    resolvedPrefixCls,
    rawClosable,
    mergedCloseIcon,
    mergedClassNames.close,
    mergedStyles.close,
  );

  getNotificationInstance(
    {
      ...args,
      closeIcon: mergedCloseIcon,
    },
    notification => {
      notification.notice({
        content: ({ prefixCls: outerPrefixCls }) => (
          <PureContent
            prefixCls={`${outerPrefixCls}-notice`}
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
        duration: normalizedDuration,
        closable: resolvedClosable,
        ...(wrappedCloseIcon !== undefined ? { closeIcon: wrappedCloseIcon } : {}),
        showProgress: args.showProgress ?? defaultShowProgress,
        pauseOnHover: args.pauseOnHover ?? defaultPauseOnHover,
        onClose: args.onClose,
        onClick: args.onClick,
        key: args.key,
        props: args.props ?? defaultDivProps,
        style: {
          ...(contextNotification?.style as CSSProperties),
          ...(mergedStyles.root || {}),
          ...(args.style || {}),
        },
        class: classNames(
          type && `${noticePrefixCls}-${type}`,
          contextNotification?.className,
          mergedClassNames.root,
          args.class,
          args.className,
        ),
      });
    },
  );
}

const api: any = {
  open: notice,
  close(key: string) {
    Object.keys(notificationInstance).forEach(cacheKey =>
      Promise.resolve(notificationInstance[cacheKey]).then(instance => {
        instance.removeNotice(key);
      }),
    );
  },
  config: setNotificationConfig,
  destroy() {
    Object.keys(notificationInstance).forEach(cacheKey => {
      Promise.resolve(notificationInstance[cacheKey]).then(instance => {
        instance.destroy();
      });
      delete notificationInstance[cacheKey]; // lgtm[js/missing-await]
    });
  },
};

const iconTypes: IconType[] = ['success', 'info', 'warning', 'error'];
iconTypes.forEach(type => {
  api[type] = args =>
    api.open({
      ...args,
      type,
    });
});

api.warn = api.warning;
api.useNotification = useNotification;
api._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;

export interface NotificationInstance {
  success(args: NotificationArgsProps): void;
  error(args: NotificationArgsProps): void;
  info(args: NotificationArgsProps): void;
  warning(args: NotificationArgsProps): void;
  open(args: NotificationArgsProps): void;
}

export interface NotificationApi extends NotificationInstance {
  warn(args: NotificationArgsProps): void;
  close(key: string): void;
  config(options: ConfigProps): void;
  destroy(): void;
  useNotification: typeof useNotification;
  /** @private Internal Component. Do not use in your production. */
  _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
}

/** @private test Only function. Not work on production */
export const getInstance = async (cacheKey: string) =>
  process.env.NODE_ENV === 'test' ? notificationInstance[cacheKey] : null;

export default api as NotificationApi;
