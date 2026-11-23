import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { tourProps as VCTourProps, tourStepProps as VCTourStepProps } from '../vc-tour';
import type { VueNode } from '../_util/type';

export const tourProps = () => ({
  ...VCTourProps(),
  steps: { type: Array as PropType<TourStepProps[]> },
  prefixCls: { type: String },
  current: { type: Number },
  type: { type: String as PropType<'default' | 'primary'> }, //	default	类型，影响底色与文字颜色
  /** 自定义底部操作按钮渲染 */
  actionsRender: { type: Function as PropType<(originNode: any, info: any) => any> },
  'onUpdate:current': Function as PropType<(val: number) => void>,
});

export type TourProps = Partial<ExtractPropTypes<ReturnType<typeof tourProps>>>;

export interface TourBtnProps {
  children?: () => VueNode;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

export const tourStepProps = () => ({
  ...VCTourStepProps(),
  cover: { type: Object as PropType<VueNode> }, // 展示的图片或者视频
  nextButtonProps: {
    type: Object as PropType<TourBtnProps>,
  },
  prevButtonProps: {
    type: Object as PropType<TourBtnProps>,
  },
  current: { type: Number },
  /** 5.4+ 自定义底部操作按钮渲染 */
  actionsRender: { type: Function as PropType<(originNode: any, info: any) => any> },
  type: { type: String as PropType<'default' | 'primary'> }, //	default	类型，影响底色与文字颜色
});

export type TourStepProps = Partial<ExtractPropTypes<ReturnType<typeof tourStepProps>>>;

export interface TourLocale {
  Next: string;
  Previous: string;
  Finish: string;
}
