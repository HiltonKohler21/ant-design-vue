import type { CSSProperties, HTMLAttributes, Ref } from 'vue';
import type { Key, VueNode } from '../_util/type';
import type {
  SemanticClassNames,
  SemanticClassNamesType,
  SemanticStyles,
  SemanticStylesType,
} from '../_util/hooks/useMergeSemantic';

export interface DivProps extends HTMLAttributes {
  'data-testid'?: string;
}

export const NotificationPlacements = [
  'top',
  'topLeft',
  'topRight',
  'bottom',
  'bottomLeft',
  'bottomRight',
] as const;

export type NotificationPlacement = (typeof NotificationPlacements)[number];

export type IconType = 'success' | 'info' | 'error' | 'warning';

export type NotificationSemanticName =
  | 'list'
  | 'listContent'
  | 'wrapper'
  | 'root'
  | 'title'
  | 'description'
  | 'actions'
  | 'icon'
  | 'section'
  | 'close'
  | 'progress';

export type NotificationSemanticClassNames = SemanticClassNames<NotificationSemanticName>;
export type NotificationSemanticStyles = SemanticStyles<NotificationSemanticName>;

export type NotificationClassNamesType<Props = ArgsProps> = SemanticClassNamesType<
  Props,
  NotificationSemanticName
>;

export type NotificationStylesType<Props = ArgsProps> = SemanticStylesType<
  Props,
  NotificationSemanticName
>;

export interface NotificationClosableType {
  closeIcon?: (() => VueNode) | VueNode;
  disabled?: boolean;
  onClose?: () => void;
  'aria-label'?: string;
  [key: `aria-${string}`]: any;
  [key: `data-${string}`]: any;
}

export type NotificationClosable = boolean | null | NotificationClosableType;

export interface StackConfig {
  threshold?: number;
  offset?: number;
  gap?: number;
}

export type NotificationStack = boolean | StackConfig;

export interface ArgsProps {
  /** @deprecated Please use `title` instead */
  message?: (() => VueNode) | VueNode;
  title?: (() => VueNode) | VueNode;
  description?: (() => VueNode) | VueNode;
  /** @deprecated Please use `actions` instead */
  btn?: (() => VueNode) | VueNode;
  /** btn 的替代（支持多按钮） */
  actions?: (() => VueNode) | VueNode;
  showProgress?: boolean;
  pauseOnHover?: boolean;
  key?: Key;
  onClose?: () => void;
  duration?: number | null | false;
  icon?: (() => VueNode) | VueNode;
  placement?: NotificationPlacement;
  style?: CSSProperties;
  class?: string;
  className?: string;
  classNames?: NotificationClassNamesType<ArgsProps>;
  styles?: NotificationStylesType<ArgsProps>;
  readonly type?: IconType;
  onClick?: () => void;
  closable?: NotificationClosable;
  closeIcon?: (() => VueNode) | VueNode;
  props?: DivProps;
  role?: 'alert' | 'status';
}

type StaticFn = (args: ArgsProps) => void;

export interface NotificationInstance {
  success: StaticFn;
  error: StaticFn;
  info: StaticFn;
  warning: StaticFn;
  open: StaticFn;
  destroy(key?: Key): void;
}

export interface GlobalConfigProps {
  top?: number | string;
  bottom?: number | string;
  duration?: number | null | false;
  prefixCls?: string;
  getContainer?: () => HTMLElement;
  placement?: NotificationPlacement;
  closable?: NotificationClosable;
  closeIcon?: (() => VueNode) | VueNode;
  showProgress?: boolean;
  pauseOnHover?: boolean;
  stack?: NotificationStack;
  rtl?: boolean;
  maxCount?: number;
  props?: DivProps;
}

export interface NotificationConfig {
  top?: number | string;
  bottom?: number | string;
  duration?: number | null | false;
  prefixCls?: string;
  getContainer?: () => HTMLElement;
  placement?: NotificationPlacement;
  closable?: NotificationClosable;
  closeIcon?: (() => VueNode) | VueNode;
  showProgress?: boolean;
  pauseOnHover?: boolean;
  stack?: NotificationStack | Ref<NotificationStack>;
  maxCount?: number;
  rtl?: boolean;
  classNames?: NotificationClassNamesType<NotificationConfig>;
  styles?: NotificationStylesType<NotificationConfig>;
}
