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

export const progressStatuses = ['normal', 'exception', 'active', 'success'] as const;
export type ProgressStatusesType = (typeof progressStatuses)[number];
const ProgressType = ['line', 'circle', 'dashboard'] as const;
export type ProgressType = (typeof ProgressType)[number];
const ProgressSize = ['default', 'small'] as const;
export type ProgressSize = (typeof ProgressSize)[number] | number | [number, number];
export type StringGradients = { [percentage: string]: string };
type FromToGradients = { from: string; to: string };
export type ProgressGradient = { direction?: string } & (StringGradients | FromToGradients);

export interface SuccessProps {
  percent?: number;
  /** @deprecated Use `percent` instead */
  progress?: number;
  strokeColor?: string;
}

export const progressProps = () => ({
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
  /** 5.20+ 百分比文字位置：inner（进度条内）/ outer（进度条外） */
  percentPosition: stringType<'inner' | 'outer'>(),
  strokeColor: anyType<string | string[] | ProgressGradient>(),
  trailColor: String,
  /** @deprecated Use `size` instead */
  width: Number,
  success: objectType<SuccessProps>(),
  gapDegree: Number,
  gapPosition: stringType<'top' | 'bottom' | 'left' | 'right'>(),
  size: someType<ProgressSize | number | [number, number]>([String, Number, Array]),
  steps: Number,
  /** @deprecated Use `success` instead */
  successPercent: Number,
  title: String,
  progressStatus: stringType<ProgressStatusesType>(),
});

export type ProgressProps = Partial<ExtractPropTypes<ReturnType<typeof progressProps>>>;
