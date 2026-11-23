import type { VueNode } from '../_util/type';
import {
  booleanType,
  someType,
  functionType,
  stringType,
  anyType,
  objectType,
} from '../_util/type';
import type { ExtractPropTypes } from 'vue';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks/useMergeSemantic';

export const progressStatuses = ['normal', 'exception', 'active', 'success'] as const;
export type ProgressStatusesType = (typeof progressStatuses)[number];
const ProgressType = ['line', 'circle', 'dashboard'] as const;
export type ProgressType = (typeof ProgressType)[number];
const ProgressSize = ['default', 'small'] as const;
export type ProgressSize = (typeof ProgressSize)[number] | number | [number, number];
export type StringGradients = { [percentage: string]: string };
type FromToGradients = { from: string; to: string };
export type ProgressGradient = { direction?: string } & (StringGradients | FromToGradients);

export type GapPosition = 'top' | 'bottom' | 'left' | 'right';
export type GapPlacement = GapPosition | 'start' | 'end';

export interface PercentPositionType {
  align?: 'start' | 'center' | 'end';
  type?: 'inner' | 'outer';
}

export interface SuccessProps {
  percent?: number;
  /** @deprecated Use `percent` instead */
  progress?: number;
  strokeColor?: string;
}

const progressBaseProps = () => ({
  rootClassName: String,
  prefixCls: String,
  type: stringType<ProgressType>(),
  percent: Number,
  format: functionType<(percent?: number, successPercent?: number) => VueNode>(),
  status: stringType<ProgressStatusesType>(),
  showInfo: booleanType(),
  strokeWidth: Number,
  strokeLinecap: stringType<'butt' | 'square' | 'round'>(),
  /** 5.20+ 替代 strokeLinecap，true 等价 'round' */
  rounding: { type: Boolean, default: undefined },
  /** 5.20+ 百分比文字位置：inner/outer 或 { align, type } */
  percentPosition: someType<'inner' | 'outer' | PercentPositionType>([String, Object]),
  strokeColor: anyType<string | string[] | ProgressGradient>(),
  /** @deprecated Please use `railColor` instead */
  trailColor: String,
  railColor: String,
  /** @deprecated Use `size` instead */
  width: Number,
  success: objectType<SuccessProps>(),
  gapDegree: Number,
  /** @deprecated Please use `gapPlacement` instead */
  gapPosition: stringType<GapPosition>(),
  gapPlacement: stringType<GapPlacement>(),
  size: someType<ProgressSize | number | [number, number]>([String, Number, Array]),
  steps: Number,
  /** @deprecated Use `success` instead */
  successPercent: Number,
  title: String,
  progressStatus: stringType<ProgressStatusesType>(),
});

type ProgressBaseProps = Partial<ExtractPropTypes<ReturnType<typeof progressBaseProps>>>;

export type ProgressSemanticName = 'root' | 'body' | 'rail' | 'track' | 'indicator';
export type ProgressSemanticClassNames = SemanticClassNames<ProgressSemanticName>;
export type ProgressSemanticStyles = SemanticStyles<ProgressSemanticName>;
export type ProgressClassNamesType =
  | ProgressSemanticClassNames
  | ((info: { props: ProgressBaseProps }) => ProgressSemanticClassNames);
export type ProgressStylesType =
  | ProgressSemanticStyles
  | ((info: { props: ProgressBaseProps }) => ProgressSemanticStyles);

export const progressProps = () => ({
  ...progressBaseProps(),
  classNames: someType<ProgressClassNamesType>([Object, Function]),
  styles: someType<ProgressStylesType>([Object, Function]),
});

export type ProgressProps = Partial<ExtractPropTypes<ReturnType<typeof progressProps>>>;
