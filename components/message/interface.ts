import type { CSSProperties, Ref } from 'vue';
import type { Key, VueNode } from '../_util/type';
import type {
  SemanticClassNames,
  SemanticStyles,
  SemanticClassNamesType,
  SemanticStylesType,
} from '../_util/hooks/useMergeSemantic';

export type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';

export type MessageSemanticName =
  | 'list'
  | 'listContent'
  | 'root'
  | 'wrapper'
  | 'icon'
  | 'title'
  | 'content';
export type MessageSemanticClassNames = SemanticClassNames<MessageSemanticName>;
export type MessageSemanticStyles = SemanticStyles<MessageSemanticName>;
export type MessageClassNamesType = SemanticClassNamesType<ArgsProps, MessageSemanticName>;
export type MessageStylesType = SemanticStylesType<ArgsProps, MessageSemanticName>;

export type MessageStackConfig = boolean | { threshold?: number };

export interface ConfigOptions {
  top?: number | string;
  duration?: number;
  prefixCls?: string;
  getContainer?: () => HTMLElement;
  transitionName?: string;
  maxCount?: number;
  rtl?: boolean;
  stack?: MessageStackConfig | Ref<MessageStackConfig>;
  pauseOnHover?: boolean;
  classNames?: MessageClassNamesType;
  styles?: MessageStylesType;
}

export interface ArgsProps {
  content: string | (() => VueNode) | VueNode;
  duration?: number;
  type?: NoticeType;
  onClose?: () => void;
  icon?: (() => VueNode) | VueNode;
  key?: string | number;
  style?: CSSProperties;
  class?: string;
  className?: string;
  classNames?: MessageClassNamesType;
  styles?: MessageStylesType;
  onClick?: (e: Event) => void;
  pauseOnHover?: boolean;
}

export type JointContent = VueNode | ArgsProps;

export interface MessageType extends PromiseLike<boolean> {
  (): void;
}

export type TypeOpen = (
  content: JointContent,
  duration?: number | VoidFunction, // Also can use onClose directly
  onClose?: VoidFunction,
) => MessageType;

export interface MessageInstance {
  info: TypeOpen;
  success: TypeOpen;
  error: TypeOpen;
  warning: TypeOpen;
  loading: TypeOpen;
  open(args: ArgsProps): MessageType;
  destroy(key?: Key): void;
}
