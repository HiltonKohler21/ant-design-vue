import type { CSSProperties, PropType, ExtractPropTypes } from 'vue';
import type { VueNode } from '../_util/type';
import { anyType } from '../_util/type';

export type ShowCollapsibleIconMode = 'auto' | boolean;
export type SplitterOrientation = 'horizontal' | 'vertical';

export type SplitterDraggerClassName = string | { default?: string; active?: string };
export type SplitterDraggerStyle =
  | CSSProperties
  | { default?: CSSProperties; active?: CSSProperties };

export interface SplitterCollapsibleIcon {
  start?: VueNode;
  end?: VueNode;
}

export interface SplitterCollapsibleConfig {
  motion?: boolean;
  icon?: SplitterCollapsibleIcon;
}

export interface SplitterSemanticClassNames {
  root?: string;
  panel?: string;
  dragger?: SplitterDraggerClassName;
}

export interface SplitterSemanticStyles {
  root?: CSSProperties;
  panel?: CSSProperties;
  dragger?: SplitterDraggerStyle;
}

export type SplitterClassNamesType =
  | SplitterSemanticClassNames
  | ((info: { props: SplitterProps }) => SplitterSemanticClassNames);

export type SplitterStylesType =
  | SplitterSemanticStyles
  | ((info: { props: SplitterProps }) => SplitterSemanticStyles);

export interface SplitterProps {
  prefixCls?: string;
  className?: string;
  style?: Record<string, any>;
  rootClassName?: string;
  /** @deprecated Please use `orientation` instead */
  layout?: SplitterOrientation;
  orientation?: SplitterOrientation;
  vertical?: boolean;
  destroyOnHidden?: boolean;
  collapsible?: SplitterCollapsibleConfig;
  collapsibleIcon?: SplitterCollapsibleIcon;
  draggerIcon?: VueNode;
  draggerClassName?: SplitterDraggerClassName;
  draggerStyle?: SplitterDraggerStyle;
  classNames?: SplitterClassNamesType;
  styles?: SplitterStylesType;
  onDraggerDoubleClick?: (index: number) => void;
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
  layout: { type: String as PropType<SplitterOrientation>, default: undefined },
  orientation: { type: String as PropType<SplitterOrientation>, default: undefined },
  vertical: { type: Boolean, default: undefined },
  lazy: { type: Boolean, default: false },
  destroyOnHidden: { type: Boolean, default: false },
  collapsible: {
    type: Object as PropType<SplitterCollapsibleConfig>,
    default: undefined,
  },
  collapsibleIcon: {
    type: Object as PropType<SplitterCollapsibleIcon>,
    default: undefined,
  },
  draggerIcon: anyType<VueNode>(),
  draggerClassName: {
    type: [String, Object] as PropType<SplitterDraggerClassName>,
    default: undefined,
  },
  draggerStyle: {
    type: Object as PropType<SplitterDraggerStyle>,
    default: undefined,
  },
  classNames: {
    type: [Object, Function] as PropType<SplitterClassNamesType>,
    default: undefined,
  },
  styles: {
    type: [Object, Function] as PropType<SplitterStylesType>,
    default: undefined,
  },
  onDraggerDoubleClick: Function as PropType<(index: number) => void>,
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
  destroyOnHidden: { type: Boolean, default: undefined },
});
