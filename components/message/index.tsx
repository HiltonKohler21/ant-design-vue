import type { CSSProperties } from 'vue';
import { unref } from 'vue';
import Notification from '../vc-notification';
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined';
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled';
import InfoCircleFilled from '@ant-design/icons-vue/InfoCircleFilled';
import type { Key, VueNode } from '../_util/type';
import type { NotificationInstance } from '../vc-notification/Notification';
import classNames from '../_util/classNames';
import { mergeSemantic } from '../_util/hooks/useMergeSemantic';
import useStyle from './style';
import useMessage from './useMessage';
import PurePanel, { renderMessageIcon } from './PurePanel';
import type {
  MessageSemanticName,
  MessageSemanticClassNames,
  MessageSemanticStyles,
  MessageClassNamesType,
  MessageStylesType,
  MessageStackConfig,
} from './interface';

export type {
  MessageSemanticName,
  MessageSemanticClassNames,
  MessageSemanticStyles,
  MessageClassNamesType,
  MessageStylesType,
  MessageStackConfig,
};

let defaultDuration = 3;
let defaultTop: string;
let messageInstance: NotificationInstance;
let key = 1;
let localPrefixCls = '';
let transitionName = 'move-up';
let hasTransitionName = false;
let getContainer = () => document.body;
let maxCount: number;
let rtl = false;
let defaultStack: MessageStackConfig | undefined;
let defaultPauseOnHover: boolean | undefined;
let defaultClassNames: MessageClassNamesType | undefined;
let defaultStyles: MessageStylesType | undefined;

export function getKeyThenIncreaseKey() {
  return key++;
}

export interface ConfigOptions {
  top?: string | number;
  duration?: number;
  prefixCls?: string;
  getContainer?: () => HTMLElement;
  transitionName?: string;
  maxCount?: number;
  rtl?: boolean;
  stack?: MessageStackConfig;
  pauseOnHover?: boolean;
  classNames?: MessageClassNamesType;
  styles?: MessageStylesType;
}

function setMessageConfig(options: ConfigOptions) {
  if (options.top !== undefined) {
    defaultTop = typeof options.top === 'number' ? `${options.top}px` : options.top;
    messageInstance = null; // delete messageInstance for new defaultTop
  }
  if (options.duration !== undefined) {
    defaultDuration = options.duration;
  }

  if (options.prefixCls !== undefined) {
    localPrefixCls = options.prefixCls;
  }
  if (options.getContainer !== undefined) {
    getContainer = options.getContainer;
    messageInstance = null; // delete messageInstance for new getContainer
  }
  if (options.transitionName !== undefined) {
    transitionName = options.transitionName;
    messageInstance = null; // delete messageInstance for new transitionName
    hasTransitionName = true;
  }
  if (options.maxCount !== undefined) {
    maxCount = options.maxCount;
    messageInstance = null;
  }
  if (options.rtl !== undefined) {
    rtl = options.rtl;
  }
  if (options.stack !== undefined) {
    defaultStack = unref(options.stack);
    messageInstance = null;
  }
  if (options.pauseOnHover !== undefined) {
    defaultPauseOnHover = options.pauseOnHover;
  }
  if (options.classNames !== undefined) {
    defaultClassNames = options.classNames;
  }
  if (options.styles !== undefined) {
    defaultStyles = options.styles;
  }
}

function getMessageInstance(args: MessageArgsProps, callback: (i: NotificationInstance) => void) {
  if (messageInstance) {
    callback(messageInstance);
    return;
  }

  const [holderClassNames, holderStyles] = mergeSemantic<
    MessageSemanticClassNames,
    MessageSemanticStyles,
    MessageArgsProps
  >([defaultClassNames], [defaultStyles], { props: args });

  Notification.newInstance(
    {
      appContext: args.appContext,
      prefixCls: args.prefixCls || localPrefixCls,
      rootPrefixCls: args.rootPrefixCls,
      transitionName,
      hasTransitionName,
      class: holderClassNames.list,
      style: { top: defaultTop, ...holderStyles.list }, // 覆盖原来的样式
      getContainer: getContainer || args.getPopupContainer,
      maxCount,
      stack: defaultStack,
      name: 'message',
      useStyle,
    },
    (instance: any) => {
      if (messageInstance) {
        callback(messageInstance);
        return;
      }
      messageInstance = instance;
      callback(instance);
    },
  );
}

export type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';

export interface ThenableArgument {
  (val: any): void;
}

const typeToIcon = {
  info: InfoCircleFilled,
  success: CheckCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
  loading: LoadingOutlined,
};
export const typeList = Object.keys(typeToIcon) as NoticeType[];
export interface MessageType extends PromiseLike<any> {
  (): void;
}

export interface MessageArgsProps {
  content: string | (() => VueNode) | VueNode;
  duration?: number;
  type?: NoticeType;
  prefixCls?: string;
  rootPrefixCls?: string;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  onClose?: () => void;
  icon?: (() => VueNode) | VueNode;
  key?: string | number;
  style?: CSSProperties;
  class?: string;
  className?: string;
  classNames?: MessageClassNamesType;
  styles?: MessageStylesType;
  appContext?: any;
  onClick?: (e: MouseEvent) => void;
  pauseOnHover?: boolean;
}

function notice(args: MessageArgsProps): MessageType {
  const duration = args.duration !== undefined ? args.duration : defaultDuration;

  const target = args.key || getKeyThenIncreaseKey();
  const [mergedClassNames, mergedStyles] = mergeSemantic<
    MessageSemanticClassNames,
    MessageSemanticStyles,
    MessageArgsProps
  >([defaultClassNames, args.classNames], [defaultStyles, args.styles], {
    props: args,
  });

  const closePromise = new Promise(resolve => {
    const callback = () => {
      if (typeof args.onClose === 'function') {
        args.onClose();
      }
      return resolve(true);
    };
    getMessageInstance(args, instance => {
      instance.notice({
        key: target,
        duration,
        pauseOnHover: args.pauseOnHover ?? defaultPauseOnHover,
        style: { ...mergedStyles.root, ...args.style },
        class: classNames(mergedClassNames.root, args.class, args.className),
        content: ({ prefixCls }) => {
          const Icon = typeToIcon[args.type];
          const iconNode = Icon ? <Icon /> : '';
          const rawIcon = typeof args.icon === 'function' ? args.icon() : args.icon || iconNode;
          const renderedIcon = renderMessageIcon(rawIcon, mergedClassNames.icon, mergedStyles.icon);
          const messageClass = classNames(
            `${prefixCls}-custom-content`,
            {
              [`${prefixCls}-${args.type}`]: args.type,
              [`${prefixCls}-rtl`]: rtl === true,
            },
            mergedClassNames.wrapper,
          );
          const textClass =
            classNames(mergedClassNames.content, mergedClassNames.title) || undefined;
          const textStyle =
            mergedStyles.content || mergedStyles.title
              ? [mergedStyles.content, mergedStyles.title]
              : undefined;
          return (
            <div class={messageClass} style={mergedStyles.wrapper}>
              {renderedIcon}
              <span class={textClass} style={textStyle}>
                {typeof args.content === 'function' ? args.content() : args.content}
              </span>
            </div>
          );
        },
        onClose: callback,
        onClick: args.onClick,
      });
    });
  });
  const result: any = () => {
    if (messageInstance) {
      messageInstance.removeNotice(target);
    }
  };
  result.then = (filled: ThenableArgument, rejected: ThenableArgument) =>
    closePromise.then(filled, rejected);
  result.promise = closePromise;
  return result;
}

type ConfigDuration = number;
type JointContent = VueNode | MessageArgsProps;
export type ConfigOnClose = () => void;

function isArgsProps(content: JointContent): content is MessageArgsProps {
  return (
    Object.prototype.toString.call(content) === '[object Object]' &&
    !!(content as MessageArgsProps).content
  );
}

const api: any = {
  open: notice,
  config: setMessageConfig,
  destroy(messageKey?: Key) {
    if (messageInstance) {
      if (messageKey) {
        const { removeNotice } = messageInstance;
        removeNotice(messageKey);
      } else {
        const { destroy } = messageInstance;
        destroy();
        messageInstance = null;
      }
    }
  },
};

export function attachTypeApi(originalApi: MessageApi, type: NoticeType) {
  originalApi[type] = (
    content: JointContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose,
  ) => {
    if (isArgsProps(content)) {
      return originalApi.open({ ...content, type });
    }

    if (typeof duration === 'function') {
      onClose = duration;
      duration = undefined;
    }

    return originalApi.open({ content, duration, type, onClose });
  };
}

typeList.forEach(type => attachTypeApi(api, type));

api.warn = api.warning;
api.useMessage = useMessage;
api._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;

export interface MessageInstance {
  info(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  success(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  error(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  warning(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  loading(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  open(args: MessageArgsProps): MessageType;
  useMessage: typeof useMessage;
}

export interface MessageApi extends MessageInstance {
  warn(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  config(options: ConfigOptions): void;
  destroy(messageKey?: Key): void;
  /** @private Internal Component. Do not use in your production. */
  _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
}

/** @private test Only function. Not work on production */
export const getInstance = () => (process.env.NODE_ENV === 'test' ? messageInstance : null);

export default api as MessageApi;
