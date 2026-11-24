import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { tourProps as VCTourProps, tourStepProps as VCTourStepProps } from '../vc-tour';
import type { VueNode } from '../_util/type';
import { anyType, objectType, someType } from '../_util/type';
import type {
  SemanticClassNames,
  SemanticClassNamesType,
  SemanticStyles,
  SemanticStylesType,
} from '../_util/hooks/useMergeSemantic';

export type TourSemanticName =
  | 'root'
  | 'cover'
  | 'close'
  | 'mask'
  | 'section'
  | 'footer'
  | 'actions'
  | 'indicator'
  | 'indicators'
  | 'header'
  | 'title'
  | 'description';

export type TourSemanticClassNames = SemanticClassNames<TourSemanticName>;
export type TourSemanticStyles = SemanticStyles<TourSemanticName>;
export type TourClassNamesType<Props = any> = SemanticClassNamesType<Props, TourSemanticName>;
export type TourStylesType<Props = any> = SemanticStylesType<Props, TourSemanticName>;

export interface TourGap {
  offset?: number | [number, number];
  radius?: number;
}

export const tourProps = () => ({
  ...VCTourProps(),
  steps: { type: Array as PropType<TourStepProps[]> },
  prefixCls: { type: String },
  current: { type: Number },
  type: { type: String as PropType<'default' | 'primary'> }, // default 类型，影响底色与文字颜色
  /** 自定义指示器 */
  indicatorsRender: { type: Function as PropType<(current: number, total: number) => VueNode> },
  /** 自定义底部操作按钮渲染 */
  actionsRender: { type: Function as PropType<(originNode: any, info: any) => any> },
  /** 是否启用键盘快捷行为 */
  keyboard: { type: Boolean, default: true },
  /** 自定义关闭按钮 */
  closeIcon: anyType<VueNode | boolean>(),
  /** 是否显示关闭按钮 */
  closable: someType<boolean | { closeIcon?: VueNode; [key: string]: any }>([Boolean, Object]),
  /** 禁用高亮区域交互 */
  disabledInteraction: { type: Boolean, default: false },
  /** 控制高亮区域的圆角边框和显示间距 */
  gap: objectType<TourGap>(),
  /** 设置 Tour 浮层的渲染节点 */
  getPopupContainer: Function as PropType<(node: HTMLElement) => HTMLElement>,
  /** 语义化 classNames（支持对象或函数） */
  classNames: [Object, Function] as PropType<TourClassNamesType>,
  /** 语义化 styles（支持对象或函数） */
  styles: [Object, Function] as PropType<TourStylesType>,
  'onUpdate:current': Function as PropType<(val: number) => void>,
});

export type TourProps = Partial<ExtractPropTypes<ReturnType<typeof tourProps>>>;

export interface TourBtnProps {
  children?: VueNode | (() => VueNode);
  onClick?: (e?: MouseEvent) => void;
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
  /** 自定义指示器 */
  indicatorsRender: { type: Function as PropType<(current: number, total: number) => VueNode> },
  /** 自定义底部操作按钮渲染 */
  actionsRender: { type: Function as PropType<(originNode: any, info: any) => any> },
  /** 自定义关闭按钮 */
  closeIcon: anyType<VueNode | boolean>(),
  /** 是否显示关闭按钮 */
  closable: someType<boolean | { closeIcon?: VueNode; [key: string]: any }>([Boolean, Object]),
  /** 语义化 classNames */
  classNames: objectType<TourSemanticClassNames>(),
  /** 语义化 styles */
  styles: objectType<TourSemanticStyles>(),
  type: { type: String as PropType<'default' | 'primary'> }, // default 类型，影响底色与文字颜色
});

export type TourStepProps = Partial<ExtractPropTypes<ReturnType<typeof tourStepProps>>>;

export interface TourLocale {
  Next: string;
  Previous: string;
  Finish: string;
}
