import type { ComputedRef, ExtractPropTypes, InjectionKey, PropType, Ref, CSSProperties } from 'vue';
import { computed, inject, provide } from 'vue';
import type { ValidateMessages } from '../form/interface';
import type { RequiredMark } from '../form/Form';
import type { RenderEmptyHandler } from './renderEmpty';
import type { TransformCellTextProps } from '../table/interface';
import type { Locale } from '../locale-provider';
import type { DerivativeFunc } from '../_util/cssinjs';
import type { AliasToken, SeedToken } from '../theme/internal';
import type { MapToken, OverrideToken } from '../theme/interface';
import type { VueNode } from '../_util/type';
import { objectType } from '../_util/type';

export const defaultIconPrefixCls = 'anticon';

type GlobalFormCOntextProps = {
  validateMessages?: Ref<ValidateMessages>;
};

export type DirectionType = 'ltr' | 'rtl' | undefined;

export const GlobalFormContextKey: InjectionKey<GlobalFormCOntextProps> =
  Symbol('GlobalFormContextKey');

export const useProvideGlobalForm = (state: GlobalFormCOntextProps) => {
  provide(GlobalFormContextKey, state);
};

export const useInjectGlobalForm = () => {
  return inject(GlobalFormContextKey, { validateMessages: computed(() => undefined) });
};

export const GlobalConfigContextKey: InjectionKey<GlobalFormCOntextProps> =
  Symbol('GlobalConfigContextKey');

export interface CSPConfig {
  nonce?: string;
}
export interface Theme {
  primaryColor?: string;
  infoColor?: string;
  successColor?: string;
  processingColor?: string;
  errorColor?: string;
  warningColor?: string;
}

export type SizeType = 'small' | 'middle' | 'large' | undefined;

export type Direction = 'ltr' | 'rtl';

/**
 * 组件视觉变体（antd 5.13+）
 * @see https://ant.design/components/input-cn#input-demo-variant
 */
export const Variants = ['outlined', 'borderless', 'filled', 'underlined'] as const;

export type Variant = (typeof Variants)[number];

/** 组件级配置：className + style（antd 5.x ConfigProvider 的组件默认配置） */
export interface ComponentStyleConfig {
  className?: string;
  style?: CSSProperties;
}

/** 各组件 Config 类型（含 variant 的组件扩展） */
export type AlertConfig = ComponentStyleConfig;
export type AnchorConfig = ComponentStyleConfig;
export type AvatarConfig = ComponentStyleConfig;
export type BadgeConfig = ComponentStyleConfig;
export type BreadcrumbConfig = ComponentStyleConfig;
export type ButtonConfig = ComponentStyleConfig & {
  variant?: Variant;
  color?: string;
  autoInsertSpace?: boolean;
};
export type CalendarConfig = ComponentStyleConfig;
export type CardConfig = ComponentStyleConfig & { variant?: 'borderless' | 'outlined' };
export type CarouselConfig = ComponentStyleConfig;
export type CascaderConfig = ComponentStyleConfig & { variant?: Variant };
export type CheckboxConfig = ComponentStyleConfig;
export type CollapseConfig = ComponentStyleConfig;
export type ColorPickerConfig = ComponentStyleConfig;
export type DatePickerConfig = ComponentStyleConfig & { variant?: Variant };
export type DescriptionsConfig = ComponentStyleConfig;
export type DividerConfig = ComponentStyleConfig;
export type DrawerConfig = ComponentStyleConfig;
export type DropdownConfig = ComponentStyleConfig;
export type FloatButtonConfig = ComponentStyleConfig;
export type FloatButtonGroupConfig = ComponentStyleConfig;
export type InputNumberConfig = ComponentStyleConfig & { variant?: Variant };
export type LayoutConfig = ComponentStyleConfig;
export type ListConfig = ComponentStyleConfig;
export type MentionsConfig = ComponentStyleConfig & { variant?: Variant };
export type MenuConfig = ComponentStyleConfig;
export type ModalConfig = ComponentStyleConfig;
export type PopconfirmConfig = ComponentStyleConfig;
export type PopoverConfig = ComponentStyleConfig;
export type ProgressConfig = ComponentStyleConfig;
export type RadioConfig = ComponentStyleConfig;
export type RangePickerConfig = ComponentStyleConfig & { variant?: Variant };
export type RateConfig = ComponentStyleConfig;
export type ResultConfig = ComponentStyleConfig;
export type SegmentedConfig = ComponentStyleConfig;
export type SkeletonConfig = ComponentStyleConfig;
export type SliderConfig = ComponentStyleConfig;
export type SpinConfig = ComponentStyleConfig;
export type SplitterConfig = ComponentStyleConfig;
export type StatisticConfig = ComponentStyleConfig;
export type StepsConfig = ComponentStyleConfig;
export type TabsConfig = ComponentStyleConfig;
export type TagConfig = ComponentStyleConfig;
export type TextAreaConfig = ComponentStyleConfig & { variant?: Variant };
export type TimePickerConfig = ComponentStyleConfig & { variant?: Variant };
export type TimelineConfig = ComponentStyleConfig;
export type TooltipConfig = ComponentStyleConfig;
export type TourConfig = ComponentStyleConfig;
export type TransferConfig = ComponentStyleConfig;
export type TreeConfig = ComponentStyleConfig;
export type TreeSelectConfig = ComponentStyleConfig & { variant?: Variant };
export type TypographyConfig = ComponentStyleConfig;
export type UploadConfig = ComponentStyleConfig;

export type MappingAlgorithm = DerivativeFunc<SeedToken, MapToken>;

export interface ThemeConfig {
  token?: Partial<AliasToken>;
  components?: OverrideToken;
  algorithm?: MappingAlgorithm | MappingAlgorithm[];
  hashed?: boolean;
  inherit?: boolean;
}

export const configProviderProps = () => ({
  iconPrefixCls: String,
  getTargetContainer: {
    type: Function as PropType<() => HTMLElement | Window>,
  },
  getPopupContainer: {
    type: Function as PropType<(triggerNode?: HTMLElement) => HTMLElement>,
  },
  prefixCls: String,
  getPrefixCls: {
    type: Function as PropType<(suffixCls?: string, customizePrefixCls?: string) => string>,
  },
  renderEmpty: {
    type: Function as PropType<RenderEmptyHandler>,
  },
  transformCellText: {
    type: Function as PropType<(tableProps: TransformCellTextProps) => any>,
  },
  csp: objectType<CSPConfig>(),
  variant: { type: String as PropType<Variant> },
  input: objectType<{ autocomplete?: string; variant?: Variant }>(),
  autoInsertSpaceInButton: { type: Boolean, default: undefined },
  locale: objectType<Locale>(),
  pageHeader: objectType<{ ghost?: boolean }>(),
  componentSize: {
    type: String as PropType<SizeType>,
  },
  componentDisabled: { type: Boolean, default: undefined },
  direction: {
    type: String as PropType<'ltr' | 'rtl'>,
    default: 'ltr',
  },
  space: objectType<{ size?: SizeType | number }>(),
  virtual: { type: Boolean, default: undefined },
  dropdownMatchSelectWidth: { type: [Number, Boolean], default: true },
  /** 5.25+ 替代 dropdownMatchSelectWidth */
  popupMatchSelectWidth: { type: [Number, Boolean], default: undefined },
  /** 5.25+ 弹层溢出配置 */
  popupOverflow: { type: String as PropType<'viewport' | 'scroll'>, default: undefined },
  /** 5.25+ 静态方法占位容器渲染 */
  holderRender: { type: Function as PropType<(children: any) => any>, default: undefined },
  form: objectType<{
    validateMessages?: ValidateMessages;
    requiredMark?: RequiredMark;
    colon?: boolean;
  }>(),
  pagination: objectType<{
    showSizeChanger?: boolean;
  }>(),
  theme: objectType<ThemeConfig>(),
  select: objectType<{
    showSearch?: boolean;
    variant?: Variant;
  }>(),
  wave: objectType<{
    disabled?: boolean;
  }>(),
  // ====================== 组件级默认配置（antd 5.x camelCase）======================
  alert: objectType<AlertConfig>(),
  anchor: objectType<AnchorConfig>(),
  avatar: objectType<AvatarConfig>(),
  badge: objectType<BadgeConfig>(),
  breadcrumb: objectType<BreadcrumbConfig>(),
  button: objectType<ButtonConfig>(),
  calendar: objectType<CalendarConfig>(),
  card: objectType<CardConfig>(),
  carousel: objectType<CarouselConfig>(),
  cascader: objectType<CascaderConfig>(),
  checkbox: objectType<CheckboxConfig>(),
  collapse: objectType<CollapseConfig>(),
  colorPicker: objectType<ColorPickerConfig>(),
  datePicker: objectType<DatePickerConfig>(),
  descriptions: objectType<DescriptionsConfig>(),
  divider: objectType<DividerConfig>(),
  drawer: objectType<DrawerConfig>(),
  dropdown: objectType<DropdownConfig>(),
  floatButton: objectType<FloatButtonConfig>(),
  floatButtonGroup: objectType<FloatButtonGroupConfig>(),
  inputNumber: objectType<InputNumberConfig>(),
  layout: objectType<LayoutConfig>(),
  list: objectType<ListConfig>(),
  mentions: objectType<MentionsConfig>(),
  menu: objectType<MenuConfig>(),
  modal: objectType<ModalConfig>(),
  popconfirm: objectType<PopconfirmConfig>(),
  popover: objectType<PopoverConfig>(),
  progress: objectType<ProgressConfig>(),
  radio: objectType<RadioConfig>(),
  rangePicker: objectType<RangePickerConfig>(),
  rate: objectType<RateConfig>(),
  result: objectType<ResultConfig>(),
  segmented: objectType<SegmentedConfig>(),
  skeleton: objectType<SkeletonConfig>(),
  slider: objectType<SliderConfig>(),
  spin: objectType<SpinConfig>(),
  splitter: objectType<SplitterConfig>(),
  statistic: objectType<StatisticConfig>(),
  steps: objectType<StepsConfig>(),
  tabs: objectType<TabsConfig>(),
  tag: objectType<TagConfig>(),
  textArea: objectType<TextAreaConfig>(),
  timePicker: objectType<TimePickerConfig>(),
  timeline: objectType<TimelineConfig>(),
  tooltip: objectType<TooltipConfig>(),
  tour: objectType<TourConfig>(),
  transfer: objectType<TransferConfig>(),
  tree: objectType<TreeConfig>(),
  treeSelect: objectType<TreeSelectConfig>(),
  typography: objectType<TypographyConfig>(),
  upload: objectType<UploadConfig>(),
});

export type ConfigProviderProps = Partial<ExtractPropTypes<ReturnType<typeof configProviderProps>>>;

export interface ConfigProviderInnerProps {
  csp?: ComputedRef<CSPConfig>;
  variant?: ComputedRef<Variant>;
  autoInsertSpaceInButton?: ComputedRef<boolean>;
  locale?: ComputedRef<Locale>;
  direction?: ComputedRef<'ltr' | 'rtl'>;
  space?: ComputedRef<{
    size?: number | SizeType;
  }>;
  virtual?: ComputedRef<boolean>;
  dropdownMatchSelectWidth?: ComputedRef<number | boolean>;
  popupMatchSelectWidth?: ComputedRef<number | boolean>;
  popupOverflow?: ComputedRef<'viewport' | 'scroll'>;
  holderRender?: ComputedRef<(children: any) => any>;
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  iconPrefixCls: ComputedRef<string>;
  theme?: ComputedRef<ThemeConfig>;
  renderEmpty?: (name?: string) => VueNode;
  getTargetContainer?: ComputedRef<() => HTMLElement | Window>;
  getPopupContainer?: ComputedRef<(triggerNode?: HTMLElement) => HTMLElement>;
  pageHeader?: ComputedRef<{
    ghost?: boolean;
  }>;
  input?: ComputedRef<{
    autocomplete?: string;
    variant?: Variant;
  }>;
  pagination?: ComputedRef<{
    showSizeChanger?: boolean;
  }>;
  form?: ComputedRef<{
    validateMessages?: ValidateMessages;
    requiredMark?: RequiredMark;
    colon?: boolean;
  }>;
  select?: ComputedRef<{
    showSearch?: boolean;
    variant?: Variant;
  }>;
  componentSize?: ComputedRef<SizeType>;
  componentDisabled?: ComputedRef<boolean>;
  transformCellText?: ComputedRef<(tableProps: TransformCellTextProps) => any>;
  wave?: ComputedRef<{
    disabled?: boolean;
  }>;
  flex?: ComputedRef<{
    vertical?: boolean;
  }>;
  // ====================== 组件级默认配置 ======================
  alert?: ComputedRef<AlertConfig>;
  anchor?: ComputedRef<AnchorConfig>;
  avatar?: ComputedRef<AvatarConfig>;
  badge?: ComputedRef<BadgeConfig>;
  breadcrumb?: ComputedRef<BreadcrumbConfig>;
  button?: ComputedRef<ButtonConfig>;
  calendar?: ComputedRef<CalendarConfig>;
  card?: ComputedRef<CardConfig>;
  carousel?: ComputedRef<CarouselConfig>;
  cascader?: ComputedRef<CascaderConfig>;
  checkbox?: ComputedRef<CheckboxConfig>;
  collapse?: ComputedRef<CollapseConfig>;
  colorPicker?: ComputedRef<ColorPickerConfig>;
  datePicker?: ComputedRef<DatePickerConfig>;
  descriptions?: ComputedRef<DescriptionsConfig>;
  divider?: ComputedRef<DividerConfig>;
  drawer?: ComputedRef<DrawerConfig>;
  dropdown?: ComputedRef<DropdownConfig>;
  floatButton?: ComputedRef<FloatButtonConfig>;
  floatButtonGroup?: ComputedRef<FloatButtonGroupConfig>;
  inputNumber?: ComputedRef<InputNumberConfig>;
  layout?: ComputedRef<LayoutConfig>;
  list?: ComputedRef<ListConfig>;
  mentions?: ComputedRef<MentionsConfig>;
  menu?: ComputedRef<MenuConfig>;
  modal?: ComputedRef<ModalConfig>;
  popconfirm?: ComputedRef<PopconfirmConfig>;
  popover?: ComputedRef<PopoverConfig>;
  progress?: ComputedRef<ProgressConfig>;
  radio?: ComputedRef<RadioConfig>;
  rangePicker?: ComputedRef<RangePickerConfig>;
  rate?: ComputedRef<RateConfig>;
  result?: ComputedRef<ResultConfig>;
  segmented?: ComputedRef<SegmentedConfig>;
  skeleton?: ComputedRef<SkeletonConfig>;
  slider?: ComputedRef<SliderConfig>;
  spin?: ComputedRef<SpinConfig>;
  splitter?: ComputedRef<SplitterConfig>;
  statistic?: ComputedRef<StatisticConfig>;
  steps?: ComputedRef<StepsConfig>;
  tabs?: ComputedRef<TabsConfig>;
  tag?: ComputedRef<TagConfig>;
  textArea?: ComputedRef<TextAreaConfig>;
  timePicker?: ComputedRef<TimePickerConfig>;
  timeline?: ComputedRef<TimelineConfig>;
  tooltip?: ComputedRef<TooltipConfig>;
  tour?: ComputedRef<TourConfig>;
  transfer?: ComputedRef<TransferConfig>;
  tree?: ComputedRef<TreeConfig>;
  treeSelect?: ComputedRef<TreeSelectConfig>;
  typography?: ComputedRef<TypographyConfig>;
  upload?: ComputedRef<UploadConfig>;
}

export const configProviderKey: InjectionKey<ConfigProviderInnerProps> = Symbol('configProvider');

export const defaultConfigProvider: ConfigProviderInnerProps = {
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls;
    return suffixCls ? `ant-${suffixCls}` : 'ant';
  },
  iconPrefixCls: computed(() => defaultIconPrefixCls),
  getPopupContainer: computed(() => () => document.body),
  direction: computed(() => 'ltr'),
};

export const useConfigContextInject = () => {
  return inject(configProviderKey, defaultConfigProvider);
};

export const useConfigContextProvider = (props: ConfigProviderInnerProps) => {
  return provide(configProviderKey, props);
};
