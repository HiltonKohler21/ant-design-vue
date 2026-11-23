import type { PropType, ExtractPropTypes } from 'vue';

export type ShowCollapsibleIconMode = 'auto' | boolean;

export interface SplitterProps {
  prefixCls?: string;
  className?: string;
  style?: Record<string, any>;
  rootClassName?: string;
  layout?: 'horizontal' | 'vertical';
  onResizeStart?: (sizes: number[]) => void;
  onResize?: (sizes: number[]) => void;
  onResizeEnd?: (sizes: number[]) => void;
  onCollapse?: (collapsed: boolean[], sizes: number[]) => void;
  lazy?: boolean;
}

export interface PanelProps {
  className?: string;
  style?: Record<string, any>;
  min?: number | string;
  max?: number | string;
  size?: number | string;
  collapsible?:
    | boolean
    | { start?: boolean; end?: boolean; showCollapsibleIcon?: ShowCollapsibleIconMode };
  resizable?: boolean;
  defaultSize?: number | string;
  destroyOnHidden?: boolean;
}

export const splitterProps = () => ({
  prefixCls: String,
  rootClassName: String,
  layout: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
  lazy: { type: Boolean, default: false },
  onResizeStart: Function as PropType<(sizes: number[]) => void>,
  onResize: Function as PropType<(sizes: number[]) => void>,
  onResizeEnd: Function as PropType<(sizes: number[]) => void>,
  onCollapse: Function as PropType<(collapsed: boolean[], sizes: number[]) => void>,
});

export type SplitterPropsType = Partial<ExtractPropTypes<ReturnType<typeof splitterProps>>>;

export const splitterPanelProps = () => ({
  size: [Number, String] as PropType<number | string>,
  defaultSize: [Number, String] as PropType<number | string>,
  min: [Number, String] as PropType<number | string>,
  max: [Number, String] as PropType<number | string>,
  resizable: { type: Boolean, default: true },
  collapsible: {
    type: [Boolean, Object] as PropType<PanelProps['collapsible']>,
    default: undefined,
  },
  destroyOnHidden: { type: Boolean, default: false },
});
