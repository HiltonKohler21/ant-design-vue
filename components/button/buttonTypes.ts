import PropTypes from '../_util/vue-types';

import type { ExtractPropTypes, PropType } from 'vue';
import type { SemanticNames, SemanticStylesMap } from '../_util/semantic';
import type { SizeType } from '../config-provider';
import { eventType } from '../_util/type';
import type { MouseEventHandler } from '../_util/EventInterface';

export type ButtonType = 'link' | 'default' | 'primary' | 'ghost' | 'dashed' | 'text';
export type ButtonShape = 'default' | 'circle' | 'round';

export type ButtonHTMLType = 'submit' | 'button' | 'reset';

export type LegacyButtonType = ButtonType | 'danger';
export function convertLegacyProps(type?: LegacyButtonType): ButtonProps {
  if (type === 'danger') {
    return { danger: true };
  }
  return { type };
}

export const buttonProps = () => ({
  rootClassName: String,
  /** 语义化 classNames（antd 5.25+）：icon */
  classNames: { type: Object as PropType<SemanticNames<'icon'>>, default: undefined },
  /** 图标位置（antd 5.17+） */
  iconPosition: { type: String as PropType<'start' | 'end'>, default: 'start' },
  /** 5.21+ 替代 type，可选 outlined/dashed/solid/filled/text/link */
  variant: String as PropType<'outlined' | 'dashed' | 'solid' | 'filled' | 'text' | 'link'>,
  /** 5.21+ 按钮颜色（primary/danger/default） */
  color: String as PropType<'primary' | 'danger' | 'default'>,
  /** 语义化 styles（antd 5.25+）：icon */
  styles: { type: Object as PropType<SemanticStylesMap<'icon'>>, default: undefined },
  prefixCls: String,
  type: String as PropType<ButtonType>,
  htmlType: { type: String as PropType<ButtonHTMLType>, default: 'button' },
  shape: { type: String as PropType<ButtonShape> },
  size: {
    type: String as PropType<SizeType>,
  },
  loading: {
    type: [Boolean, Object] as PropType<boolean | { delay?: number }>,
    default: (): boolean | { delay?: number } => false,
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
