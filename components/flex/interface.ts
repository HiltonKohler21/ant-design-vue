import type { CSSProperties, ExtractPropTypes } from 'vue';
import type { SizeType } from '../config-provider/SizeContext';
import { anyType, booleanType, someType, stringType } from '../_util/type';

export type FlexOrientation = 'horizontal' | 'vertical';

export const flexProps = () => ({
  prefixCls: stringType(),
  rootClassName: stringType(),
  /** flex 主轴方向（antd 6.x 推荐，优先级高于 vertical） */
  orientation: stringType<FlexOrientation>(),
  vertical: booleanType(),
  wrap: stringType<CSSProperties['flex-wrap']>(),
  justify: stringType<CSSProperties['justify-content']>(),
  align: stringType<CSSProperties['align-items']>(),
  flex: someType<CSSProperties['flex']>([Number, String]),
  gap: someType<CSSProperties['gap'] | SizeType>([Number, String]),
  component: anyType(),
});

export type FlexProps = Partial<ExtractPropTypes<ReturnType<typeof flexProps>> & HTMLElement>;
