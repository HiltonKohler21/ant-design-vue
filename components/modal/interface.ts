import type { CSSProperties, FunctionalComponent } from 'vue';
import type { ButtonProps as ButtonPropsType, LegacyButtonType } from '../button/buttonTypes';
import type { Direction } from '../config-provider';
import type { Breakpoint } from '../_util/responsiveObserve';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks/useMergeSemantic';
import type { VueNode } from '../_util/type';

export type MousePosition = { x: number; y: number } | null;

export interface ModalClosableType {
  closeIcon?: VueNode;
  disabled?: boolean;
  afterClose?: () => void;
  onClose?: () => void;
  'aria-label'?: string;
  [key: `aria-${string}`]: any;
  [key: `data-${string}`]: any;
}

export type ClosableType = boolean | ModalClosableType;

export interface MaskConfig {
  enabled?: boolean;
  blur?: boolean;
  closable?: boolean;
}

export type MaskType = boolean | MaskConfig;

export interface ModalFocusableConfig {
  trap?: boolean;
  focusTriggerAfterClose?: boolean;
}

export type ModalSemanticName =
  | 'root'
  | 'mask'
  | 'wrapper'
  | 'container'
  | 'content'
  | 'header'
  | 'title'
  | 'body'
  | 'footer'
  | 'close';

export type ModalSemanticClassNames = SemanticClassNames<ModalSemanticName>;
export type ModalSemanticStyles = SemanticStyles<ModalSemanticName>;

export type ModalClassNamesType<P = Record<string, any>> =
  | ModalSemanticClassNames
  | ((info: { props: P }) => ModalSemanticClassNames);

export type ModalStylesType<P = Record<string, any>> =
  | ModalSemanticStyles
  | ((info: { props: P }) => ModalSemanticStyles);

export interface ModalFooterRenderExtra {
  OkBtn: FunctionalComponent;
  CancelBtn: FunctionalComponent;
}

export type ModalFooterRender = (originNode: VueNode, extra: ModalFooterRenderExtra) => VueNode;

export type ModalWidthType = string | number | Partial<Record<Breakpoint, string | number>>;

export type getContainerFunc = () => HTMLElement;

export interface ModalFuncProps {
  prefixCls?: string;
  class?: string;
  rootClassName?: string;
  rootStyle?: CSSProperties;
  open?: boolean;
  loading?: boolean;
  title?: string | (() => VueNode) | VueNode;
  footer?: string | (() => VueNode) | ModalFooterRender | VueNode;
  closable?: ClosableType;
  content?: string | (() => VueNode) | VueNode;
  // TODO: find out exact types
  onOk?: (...args: any[]) => any;
  onCancel?: (...args: any[]) => any;
  afterClose?: () => void;
  okButtonProps?: ButtonPropsType;
  cancelButtonProps?: ButtonPropsType;
  centered?: boolean;
  width?: ModalWidthType;
  okText?: string | (() => VueNode) | VueNode;
  okType?: LegacyButtonType;
  cancelText?: string | (() => VueNode) | VueNode;
  icon?: (() => VueNode) | VueNode;
  wrapClassName?: string;
  /* Deprecated */
  iconType?: string;
  mask?: MaskType;
  maskClosable?: boolean;
  zIndex?: number;
  okCancel?: boolean;
  style?: CSSProperties | string;
  maskStyle?: CSSProperties;
  type?: 'info' | 'success' | 'error' | 'warn' | 'warning' | 'confirm';
  keyboard?: boolean;
  getContainer?: string | HTMLElement | getContainerFunc | false | null;
  autoFocusButton?: null | 'ok' | 'cancel';
  transitionName?: string;
  maskTransitionName?: string;
  direction?: Direction;
  bodyStyle?: CSSProperties;
  closeIcon?: string | (() => VueNode) | VueNode;
  modalRender?: (arg: { originVNode: VueNode }) => VueNode;
  focusTriggerAfterClose?: boolean;
  focusable?: ModalFocusableConfig & {
    autoFocusButton?: null | 'ok' | 'cancel';
  };
  classNames?: ModalClassNamesType<ModalFuncProps>;
  styles?: ModalStylesType<ModalFuncProps>;

  /** @deprecated please use `appContext` instead */
  parentContext?: any;
  appContext?: any;

  /** @deprecated please use `open` instead */
  visible?: boolean;
}

export type ModalFunc = (props: ModalFuncProps) => {
  destroy: () => void;
  update: (newConfig: ModalFuncProps | ((prevConfig: ModalFuncProps) => ModalFuncProps)) => void;
};

export interface ModalLocale {
  okText: string;
  cancelText: string;
  justOkText: string;
}
