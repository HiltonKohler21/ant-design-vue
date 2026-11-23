import PropTypes from '../_util/vue-types';

import type { ExtractPropTypes, PropType } from 'vue';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks/useMergeSemantic';
import type { SizeType } from '../config-provider';
import type { PresetColorKey } from '../theme/interface';
import type { VueNode } from '../_util/type';
import { eventType } from '../_util/type';
import type { MouseEventHandler } from '../_util/EventInterface';

export type ButtonType = 'link' | 'default' | 'primary' | 'ghost' | 'dashed' | 'text';
export type ButtonShape = 'default' | 'circle' | 'round';
export type ButtonVariantType = 'outlined' | 'dashed' | 'solid' | 'filled' | 'text' | 'link';
export type ButtonColorType = 'default' | 'primary' | 'danger' | PresetColorKey;

export type ButtonHTMLType = 'submit' | 'button' | 'reset';

export type ButtonSemanticName = 'root' | 'icon' | 'content';
export type ButtonSemanticClassNames = SemanticClassNames<ButtonSemanticName>;
export type ButtonSemanticStyles = SemanticStyles<ButtonSemanticName>;
export type ButtonClassNamesType =
  | ButtonSemanticClassNames
  | ((info: { props: ButtonProps }) => ButtonSemanticClassNames);
export type ButtonStylesType =
  | ButtonSemanticStyles
  | ((info: { props: ButtonProps }) => ButtonSemanticStyles);

export type LegacyButtonType = ButtonType | 'danger';
export function convertLegacyProps(type?: LegacyButtonType): ButtonProps {
  if (type === 'danger') {
    return { danger: true };
  }
  return { type };
}

export const buttonProps = () => ({
  rootClassName: String,
  /** 语义化 classNames（antd 6.x 支持对象或函数）：root / icon / content */
  classNames: {
    type: [Object, Function] as PropType<ButtonClassNamesType>,
    default: undefined,
  },
  /** 图标位置（antd 6.x 推荐，优先级高于 iconPosition） */
  iconPlacement: { type: String as PropType<'start' | 'end'>, default: undefined },
  /** @deprecated 请使用 `iconPlacement` 替代 */
  iconPosition: { type: String as PropType<'start' | 'end'>, default: 'start' },
  /** 5.21+ 替代 type，可选 outlined/dashed/solid/filled/text/link */
  variant: String as PropType<ButtonVariantType>,
  /** 5.21+ 按钮颜色（default/primary/danger 及 antd 5.23+ PresetColors） */
  color: String as PropType<ButtonColorType>,
  /** 5.17+ 两个中文字符之间自动插入空格 */
  autoInsertSpace: { type: Boolean, default: undefined },
  /** 语义化 styles（antd 6.x 支持对象或函数）：root / icon / content */
  styles: {
    type: [Object, Function] as PropType<ButtonStylesType>,
    default: undefined,
  },
  prefixCls: String,
  type: String as PropType<ButtonType>,
  htmlType: { type: String as PropType<ButtonHTMLType>, default: 'button' },
  shape: { type: String as PropType<ButtonShape> },
  size: {
    type: String as PropType<SizeType>,
  },
  loading: {
    type: [Boolean, Object] as PropType<boolean | { delay?: number; icon?: VueNode }>,
    default: (): boolean | { delay?: number; icon?: VueNode } => false,
  },
  disabled: { type: Boolean, default: undefined },
  ghost: { type: Boolean, default: undefined },
  block: { type: Boolean, default: undefined },
  danger: { type: Boolean, default: undefined },
  icon: PropTypes.any,
  href: String,
  target: String,
  title: String,
  onClick: eventType<MouseEventHandler>(),
  onMousedown: eventType<MouseEventHandler>(),
});

export type ButtonProps = Partial<ExtractPropTypes<ReturnType<typeof buttonProps>>>;

export default buttonProps;
