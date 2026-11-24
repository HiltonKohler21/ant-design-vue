import type { ExtractPropTypes, PropType } from 'vue';
import PropTypes from '../_util/vue-types';
import type { MouseEventHandler } from '../_util/EventInterface';
import { stringType, booleanType, functionType, objectType } from '../_util/type';
import type { BadgeProps } from '../badge';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks/useMergeSemantic';

export type FloatButtonType = 'default' | 'primary';

export type FloatButtonShape = 'circle' | 'square';

export type FloatButtonGroupTrigger = 'click' | 'hover';

export type FloatButtonGroupPlacement = 'top' | 'right' | 'bottom' | 'left';

export type FloatButtonBadgeProps = Omit<BadgeProps, 'status' | 'text' | 'title' | 'children'>;

export type FloatButtonSemanticName = 'root' | 'icon' | 'content';
export type FloatButtonSemanticClassNames = SemanticClassNames<FloatButtonSemanticName>;
export type FloatButtonSemanticStyles = SemanticStyles<FloatButtonSemanticName>;

export type FloatButtonGroupSemanticName =
  | 'root'
  | 'list'
  | 'item'
  | 'itemIcon'
  | 'itemContent'
  | 'trigger'
  | 'triggerIcon'
  | 'triggerContent';
export type FloatButtonGroupSemanticClassNames = SemanticClassNames<FloatButtonGroupSemanticName>;
export type FloatButtonGroupSemanticStyles = SemanticStyles<FloatButtonGroupSemanticName>;

const floatButtonBaseProps = () => ({
  prefixCls: String,
  rootClassName: String,
  icon: PropTypes.any,
  content: PropTypes.any,
  description: PropTypes.any,
  type: stringType<FloatButtonType>('default'),
  shape: stringType<FloatButtonShape>('circle'),
  tooltip: PropTypes.any,
  href: String,
  target: String,
  badge: objectType<FloatButtonBadgeProps>(),
  disabled: { type: Boolean, default: undefined },
  htmlType: { type: String as PropType<'button' | 'submit' | 'reset'>, default: 'button' },
  /** 5.28+ 点击回顶部 */
  backTop: { type: Boolean, default: false },
  onClick: functionType<MouseEventHandler>(),
});

type FloatButtonBaseProps = Partial<ExtractPropTypes<ReturnType<typeof floatButtonBaseProps>>>;

export type FloatButtonClassNamesType =
  | FloatButtonSemanticClassNames
  | ((info: { props: FloatButtonBaseProps }) => FloatButtonSemanticClassNames);

export type FloatButtonStylesType =
  | FloatButtonSemanticStyles
  | ((info: { props: FloatButtonBaseProps }) => FloatButtonSemanticStyles);

export const floatButtonProps = () => {
  return {
    ...floatButtonBaseProps(),
    classNames: { type: [Object, Function] as PropType<FloatButtonClassNamesType> },
    styles: { type: [Object, Function] as PropType<FloatButtonStylesType> },
  };
};

export type FloatButtonProps = Partial<ExtractPropTypes<ReturnType<typeof floatButtonProps>>>;

export const floatButtonContentProps = () => {
  return {
    prefixCls: stringType<FloatButtonProps['prefixCls']>(),
    classNames: objectType<FloatButtonSemanticClassNames>(),
    styles: objectType<FloatButtonSemanticStyles>(),
  };
};

export type FloatButtonContentProps = Partial<
  ExtractPropTypes<ReturnType<typeof floatButtonContentProps>>
>;

const floatButtonGroupBaseProps = () => ({
  /** 配置式子按钮（替代 children） */
  items: { type: Array as PropType<Record<string, any>[]>, default: undefined },
  ...floatButtonBaseProps(),
  closeIcon: PropTypes.any,
  // 包含的 Float Button
  // 触发方式 (有触发方式为菜单模式）
  trigger: stringType<FloatButtonGroupTrigger>(),
  // 自定义菜单弹出位置
  placement: stringType<FloatButtonGroupPlacement>('top'),
  // 受控展开
  open: booleanType(),
  // 展开收起的回调
  onOpenChange: functionType<(open: boolean) => void>(),
  'onUpdate:open': functionType<(open: boolean) => void>(),
});

type FloatButtonGroupBaseProps = Partial<
  ExtractPropTypes<ReturnType<typeof floatButtonGroupBaseProps>>
>;

export type FloatButtonGroupClassNamesType =
  | FloatButtonGroupSemanticClassNames
  | ((info: { props: FloatButtonGroupBaseProps }) => FloatButtonGroupSemanticClassNames);

export type FloatButtonGroupStylesType =
  | FloatButtonGroupSemanticStyles
  | ((info: { props: FloatButtonGroupBaseProps }) => FloatButtonGroupSemanticStyles);

export const floatButtonGroupProps = () => {
  return {
    ...floatButtonGroupBaseProps(),
    classNames: { type: [Object, Function] as PropType<FloatButtonGroupClassNamesType> },
    styles: { type: [Object, Function] as PropType<FloatButtonGroupStylesType> },
  };
};

export type FloatButtonGroupProps = Partial<
  ExtractPropTypes<ReturnType<typeof floatButtonGroupProps>>
>;

export const backTopProps = () => {
  return {
    ...floatButtonProps(),
    prefixCls: String,
    duration: Number,
    showProgress: { type: Boolean, default: false },
    target: functionType<() => HTMLElement | Window | Document>(),
    visibilityHeight: Number,
    onClick: functionType<MouseEventHandler>(),
  };
};

export type BackTopProps = Partial<ExtractPropTypes<ReturnType<typeof backTopProps>>>;
