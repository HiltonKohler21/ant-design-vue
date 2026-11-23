import type {
  ComputedRef,
  ExtractPropTypes,
  InjectionKey,
  PropType,
  Ref,
  CSSProperties,
} from 'vue';
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
import type { ShowWaveEffect, WaveConfig } from '../_util/wave/interface';

export type { ShowWaveEffect, WaveConfig };

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

/** 组件级配置：className + style（antd 5.x/6.x ConfigProvider 的组件默认配置） */
export interface ComponentStyleConfig {
  className?: string;
  style?: CSSProperties;
}

export interface SemanticComponentStyleConfig extends ComponentStyleConfig {
  classNames?: Record<string, any>;
  styles?: Record<string, any>;
}

/** 各组件 Config 类型（对齐 antd@6.7.2 全量 72 个组件配置） */
export type AffixConfig = ComponentStyleConfig;
export type AlertConfig = SemanticComponentStyleConfig & {
  variant?: 'outlined' | 'filled';
  closable?: boolean | Record<string, any>;
  closeIcon?: any;
  successIcon?: any;
  infoIcon?: any;
  warningIcon?: any;
  errorIcon?: any;
};
export type AnchorConfig = SemanticComponentStyleConfig;
export type AppConfig = ComponentStyleConfig;
export type AutoCompleteConfig = SemanticComponentStyleConfig & {
  allowClear?: boolean | { clearIcon?: any };
  variant?: Variant;
};
export type AvatarConfig = ComponentStyleConfig;
export type BadgeConfig = SemanticComponentStyleConfig;
export type BorderBeamConfig = ComponentStyleConfig;
export type BreadcrumbConfig = SemanticComponentStyleConfig & {
  separator?: any;
  dropdownIcon?: any;
};
export type ButtonConfig = SemanticComponentStyleConfig & {
  variant?: Variant | 'solid' | 'dashed' | 'text' | 'link';
  color?: string;
  autoInsertSpace?: boolean;
  shape?: string;
  loadingIcon?: any;
};
export type CalendarConfig = SemanticComponentStyleConfig;
export type CardConfig = SemanticComponentStyleConfig & { variant?: 'borderless' | 'outlined' };
export type CardMetaConfig = SemanticComponentStyleConfig;
export type CarouselConfig = ComponentStyleConfig;
export type CascaderConfig = SemanticComponentStyleConfig & {
  variant?: Variant;
  allowClear?: boolean | { clearIcon?: any };
  expandIcon?: any;
  loadingIcon?: any;
  removeIcon?: any;
  suffix?: any;
  suffixIcon?: any;
  clearIcon?: any;
  searchIcon?: any;
};
export type CheckboxConfig = SemanticComponentStyleConfig;
export type CollapseConfig = SemanticComponentStyleConfig & {
  expandIcon?: (panelProps: any) => any;
};
export type ColorPickerConfig = SemanticComponentStyleConfig & {
  arrow?: boolean | { pointAtCenter?: boolean };
};
export type DatePickerConfig = SemanticComponentStyleConfig & {
  variant?: Variant;
  suffix?: any;
  suffixIcon?: any;
  allowClear?: boolean;
  clearIcon?: any;
};
export type DescriptionsConfig = SemanticComponentStyleConfig;
export type DividerConfig = SemanticComponentStyleConfig & {
  variant?: 'solid' | 'dashed' | 'dotted';
};
export type DrawerConfig = SemanticComponentStyleConfig & {
  closeIcon?: any;
  closable?: boolean | Record<string, any>;
  mask?: any;
  focusable?: any;
};
export type DropdownConfig = SemanticComponentStyleConfig;
export type FloatButtonConfig = SemanticComponentStyleConfig & { backTopIcon?: any };
export type FloatButtonGroupConfig = SemanticComponentStyleConfig & { closeIcon?: any };
export type FormConfig = SemanticComponentStyleConfig & {
  validateMessages?: ValidateMessages;
  requiredMark?: RequiredMark;
  colon?: boolean;
  scrollToFirstError?: any;
  variant?: Variant;
  tooltip?: any;
  labelAlign?: string;
  labelWrap?: boolean;
};
export type InputConfig = SemanticComponentStyleConfig & {
  autocomplete?: string;
  autoComplete?: string;
  allowClear?: boolean | { clearIcon?: any };
  variant?: Variant;
};
export type InputPasswordConfig = SemanticComponentStyleConfig & {
  iconRender?: (visible: boolean) => any;
  variant?: Variant;
};
export type InputSearchConfig = SemanticComponentStyleConfig & {
  searchIcon?: any;
  variant?: Variant;
};
export type InputNumberConfig = SemanticComponentStyleConfig & {
  variant?: Variant;
  allowClear?: boolean | { clearIcon?: any };
};
export type LayoutConfig = ComponentStyleConfig;
export type ListConfig = ComponentStyleConfig & {
  item?: { classNames?: Record<string, any>; styles?: Record<string, any> };
};
export type ListyConfig = SemanticComponentStyleConfig;
export type MasonryConfig = SemanticComponentStyleConfig;
export type MentionsConfig = SemanticComponentStyleConfig & {
  variant?: Variant;
  allowClear?: boolean | { clearIcon?: any };
};
export type MenuConfig = SemanticComponentStyleConfig & {
  expandIcon?: any;
};
export type ModalConfig = SemanticComponentStyleConfig & {
  closeIcon?: any;
  closable?: boolean | Record<string, any>;
  centered?: boolean;
  okButtonProps?: Record<string, any>;
  cancelButtonProps?: Record<string, any>;
  mask?: any;
  focusable?: any;
  infoIcon?: any;
  successIcon?: any;
  errorIcon?: any;
  warningIcon?: any;
};
export type OTPConfig = SemanticComponentStyleConfig & { variant?: Variant };
export type PaginationConfig = SemanticComponentStyleConfig & {
  showSizeChanger?: boolean;
  totalBoundaryShowSizeChanger?: number;
};
export type PopconfirmConfig = SemanticComponentStyleConfig & {
  arrow?: boolean | { pointAtCenter?: boolean };
  trigger?: any;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
};
export type PopoverConfig = SemanticComponentStyleConfig & {
  arrow?: boolean | { pointAtCenter?: boolean };
  trigger?: any;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
};
export type ProgressConfig = SemanticComponentStyleConfig;
export type QRcodeConfig = SemanticComponentStyleConfig;
export type RadioConfig = SemanticComponentStyleConfig;
export type RangePickerConfig = SemanticComponentStyleConfig & {
  variant?: Variant;
  separator?: any;
};
export type RateConfig = ComponentStyleConfig;
export type ResultConfig = SemanticComponentStyleConfig;
export type RibbonConfig = SemanticComponentStyleConfig;
export type SegmentedConfig = SemanticComponentStyleConfig;
export type SelectConfig = SemanticComponentStyleConfig & {
  showSearch?: boolean;
  variant?: Variant;
  autoComplete?: string;
  allowClear?: boolean | { clearIcon?: any };
  clearIcon?: any;
  loadingIcon?: any;
  menuItemSelectedIcon?: any;
  removeIcon?: any;
  suffix?: any;
  suffixIcon?: any;
};
export type SkeletonConfig = SemanticComponentStyleConfig;
export type SliderConfig = SemanticComponentStyleConfig;
export type SpaceConfig = SemanticComponentStyleConfig & { size?: SizeType | number };
export type SpinConfig = SemanticComponentStyleConfig & { indicator?: any };
export type SplitterConfig = SemanticComponentStyleConfig;
export type StatisticConfig = SemanticComponentStyleConfig;
export type StepsConfig = SemanticComponentStyleConfig & { variant?: 'filled' | 'outlined' };
export type TabsConfig = SemanticComponentStyleConfig & {
  indicator?: any;
  indicatorSize?: any;
  more?: any;
  moreIcon?: any;
  addIcon?: any;
  removeIcon?: any;
};
export type TagConfig = SemanticComponentStyleConfig & {
  variant?: 'filled' | 'solid' | 'outlined';
  closeIcon?: any;
  closable?: boolean | Record<string, any>;
};
export type TextAreaConfig = SemanticComponentStyleConfig & {
  autocomplete?: string;
  autoComplete?: string;
  allowClear?: boolean | { clearIcon?: any };
  variant?: Variant;
};
export type TimePickerConfig = SemanticComponentStyleConfig & {
  variant?: Variant;
  suffix?: any;
  suffixIcon?: any;
  allowClear?: boolean;
  clearIcon?: any;
};
export type TimelineConfig = SemanticComponentStyleConfig & { variant?: 'filled' | 'outlined' };
export type TooltipConfig = SemanticComponentStyleConfig & {
  arrow?: boolean | { pointAtCenter?: boolean };
  trigger?: any;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  unique?: boolean;
};
export type TourConfig = SemanticComponentStyleConfig & { closeIcon?: any };
export type TransferConfig = SemanticComponentStyleConfig & { selectionsIcon?: any };
export type TreeConfig = SemanticComponentStyleConfig;
export type TreeSelectConfig = SemanticComponentStyleConfig & {
  variant?: Variant;
  allowClear?: boolean | { clearIcon?: any };
  switcherIcon?: any;
};
export type TypographyConfig = SemanticComponentStyleConfig;
export type UploadConfig = SemanticComponentStyleConfig & {
  customRequest?: any;
  progress?: any;
  accept?: string;
};
export type WatermarkConfig = ComponentStyleConfig;
export type ImageConfig = SemanticComponentStyleConfig & {
  preview?: {
    closeIcon?: any;
    classNames?: Record<string, any>;
    styles?: Record<string, any>;
    mask?: any;
  };
  fallback?: string;
};
export type EmptyConfig = SemanticComponentStyleConfig & { image?: any };
export type SwitchConfig = SemanticComponentStyleConfig;
export type MessageConfig = SemanticComponentStyleConfig;
export type TableConfig = SemanticComponentStyleConfig & {
  expandable?: { expandIcon?: any };
  rowKey?: any;
  scroll?: any;
};
export type NotificationConfig = SemanticComponentStyleConfig & { closeIcon?: any };
export type FlexConfig = ComponentStyleConfig & { vertical?: boolean };
export type WarningConfig = { strict?: boolean };

export interface ConfigComponentProps {
  affix?: AffixConfig;
  alert?: AlertConfig;
  anchor?: AnchorConfig;
  app?: AppConfig;
  autoComplete?: AutoCompleteConfig;
  avatar?: AvatarConfig;
  badge?: BadgeConfig;
  borderBeam?: BorderBeamConfig;
  breadcrumb?: BreadcrumbConfig;
  button?: ButtonConfig;
  calendar?: CalendarConfig;
  card?: CardConfig;
  cardMeta?: CardMetaConfig;
  carousel?: CarouselConfig;
  cascader?: CascaderConfig;
  checkbox?: CheckboxConfig;
  collapse?: CollapseConfig;
  colorPicker?: ColorPickerConfig;
  datePicker?: DatePickerConfig;
  descriptions?: DescriptionsConfig;
  divider?: DividerConfig;
  drawer?: DrawerConfig;
  dropdown?: DropdownConfig;
  empty?: EmptyConfig;
  flex?: FlexConfig;
  floatButton?: FloatButtonConfig;
  floatButtonGroup?: FloatButtonGroupConfig;
  form?: FormConfig;
  image?: ImageConfig;
  input?: InputConfig;
  inputNumber?: InputNumberConfig;
  inputPassword?: InputPasswordConfig;
  inputSearch?: InputSearchConfig;
  layout?: LayoutConfig;
  list?: ListConfig;
  listy?: ListyConfig;
  masonry?: MasonryConfig;
  mentions?: MentionsConfig;
  menu?: MenuConfig;
  message?: MessageConfig;
  modal?: ModalConfig;
  notification?: NotificationConfig;
  otp?: OTPConfig;
  pagination?: PaginationConfig;
  popconfirm?: PopconfirmConfig;
  popover?: PopoverConfig;
  progress?: ProgressConfig;
  qrcode?: QRcodeConfig;
  radio?: RadioConfig;
  rangePicker?: RangePickerConfig;
  rate?: RateConfig;
  result?: ResultConfig;
  ribbon?: RibbonConfig;
  segmented?: SegmentedConfig;
  select?: SelectConfig;
  skeleton?: SkeletonConfig;
  slider?: SliderConfig;
  space?: SpaceConfig;
  spin?: SpinConfig;
  splitter?: SplitterConfig;
  statistic?: StatisticConfig;
  steps?: StepsConfig;
  switch?: SwitchConfig;
  table?: TableConfig;
  tabs?: TabsConfig;
  tag?: TagConfig;
  textArea?: TextAreaConfig;
  timePicker?: TimePickerConfig;
  timeline?: TimelineConfig;
  tooltip?: TooltipConfig;
  tour?: TourConfig;
  transfer?: TransferConfig;
  tree?: TreeConfig;
  treeSelect?: TreeSelectConfig;
  typography?: TypographyConfig;
  upload?: UploadConfig;
  watermark?: WatermarkConfig;
  wave?: WaveConfig;
}

export const WarningContextKey: InjectionKey<ComputedRef<WarningConfig | undefined>> =
  Symbol('WarningContextKey');

export const useProvideWarningContext = (warning: ComputedRef<WarningConfig | undefined>) => {
  provide(WarningContextKey, warning);
};

export const useInjectWarningContext = () => {
  return inject(
    WarningContextKey,
    computed<WarningConfig | undefined>(() => undefined),
  );
};

export type MappingAlgorithm = DerivativeFunc<SeedToken, MapToken>;

export interface ThemeConfig {
  token?: Partial<AliasToken>;
  components?: OverrideToken;
  algorithm?: MappingAlgorithm | MappingAlgorithm[];
  hashed?: boolean;
  inherit?: boolean;
  /**
   * 开启纯 CSS 变量模式（对齐 antd v6）：
   * 样式只生成一次，主题切换仅修改变量值，不再重新序列化样式。
   */
  cssVar?: boolean | { prefix?: string; key?: string };
  /**
   * 关闭运行时样式生成（需配合预先提取的静态 CSS 使用，对齐 antd v6 zeroRuntime）。
   */
  zeroRuntime?: boolean;
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
  input: objectType<InputConfig>(),
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
  space: objectType<SpaceConfig>(),
  virtual: { type: Boolean, default: undefined },
  dropdownMatchSelectWidth: { type: [Number, Boolean], default: undefined },
  /** 5.25+ 替代 dropdownMatchSelectWidth */
  popupMatchSelectWidth: { type: [Number, Boolean], default: undefined },
  /** 5.25+ 弹层溢出配置 */
  popupOverflow: { type: String as PropType<'viewport' | 'scroll'>, default: undefined },
  /** 5.25+ 静态方法占位容器渲染 */
  holderRender: { type: Function as PropType<(children: any) => any>, default: undefined },
  form: objectType<FormConfig>(),
  pagination: objectType<PaginationConfig>(),
  theme: objectType<ThemeConfig>(),
  select: objectType<SelectConfig>(),
  wave: objectType<WaveConfig>(),
  // ====================== 组件级默认配置（对齐 antd@6.7.2 全量 72 个组件配置）======================
  affix: objectType<AffixConfig>(),
  alert: objectType<AlertConfig>(),
  anchor: objectType<AnchorConfig>(),
  app: objectType<AppConfig>(),
  autoComplete: objectType<AutoCompleteConfig>(),
  avatar: objectType<AvatarConfig>(),
  badge: objectType<BadgeConfig>(),
  borderBeam: objectType<BorderBeamConfig>(),
  breadcrumb: objectType<BreadcrumbConfig>(),
  button: objectType<ButtonConfig>(),
  calendar: objectType<CalendarConfig>(),
  card: objectType<CardConfig>(),
  cardMeta: objectType<CardMetaConfig>(),
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
  inputPassword: objectType<InputPasswordConfig>(),
  inputSearch: objectType<InputSearchConfig>(),
  layout: objectType<LayoutConfig>(),
  list: objectType<ListConfig>(),
  listy: objectType<ListyConfig>(),
  masonry: objectType<MasonryConfig>(),
  mentions: objectType<MentionsConfig>(),
  menu: objectType<MenuConfig>(),
  modal: objectType<ModalConfig>(),
  otp: objectType<OTPConfig>(),
  popconfirm: objectType<PopconfirmConfig>(),
  popover: objectType<PopoverConfig>(),
  progress: objectType<ProgressConfig>(),
  qrcode: objectType<QRcodeConfig>(),
  radio: objectType<RadioConfig>(),
  rangePicker: objectType<RangePickerConfig>(),
  rate: objectType<RateConfig>(),
  result: objectType<ResultConfig>(),
  ribbon: objectType<RibbonConfig>(),
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
  watermark: objectType<WatermarkConfig>(),
  image: objectType<ImageConfig>(),
  empty: objectType<EmptyConfig>(),
  switch: objectType<SwitchConfig>(),
  message: objectType<MessageConfig>(),
  table: objectType<TableConfig>(),
  notification: objectType<NotificationConfig>(),
  flex: objectType<FlexConfig>(),
  warning: objectType<WarningConfig>(),
});

export type ConfigProviderProps = Partial<ExtractPropTypes<ReturnType<typeof configProviderProps>>>;

export interface ConfigProviderInnerProps {
  csp?: ComputedRef<CSPConfig>;
  variant?: ComputedRef<Variant>;
  autoInsertSpaceInButton?: ComputedRef<boolean>;
  locale?: ComputedRef<Locale>;
  direction?: ComputedRef<'ltr' | 'rtl'>;
  space?: ComputedRef<SpaceConfig>;
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
  input?: ComputedRef<InputConfig>;
  pagination?: ComputedRef<PaginationConfig>;
  form?: ComputedRef<FormConfig>;
  select?: ComputedRef<SelectConfig>;
  componentSize?: ComputedRef<SizeType>;
  componentDisabled?: ComputedRef<boolean>;
  transformCellText?: ComputedRef<(tableProps: TransformCellTextProps) => any>;
  wave?: ComputedRef<WaveConfig>;
  flex?: ComputedRef<FlexConfig>;
  image?: ComputedRef<ImageConfig>;
  empty?: ComputedRef<EmptyConfig>;
  switch?: ComputedRef<SwitchConfig>;
  message?: ComputedRef<MessageConfig>;
  table?: ComputedRef<TableConfig>;
  notification?: ComputedRef<NotificationConfig>;
  warning?: ComputedRef<WarningConfig>;
  // ====================== 组件级默认配置 ======================
  affix?: ComputedRef<AffixConfig>;
  alert?: ComputedRef<AlertConfig>;
  anchor?: ComputedRef<AnchorConfig>;
  app?: ComputedRef<AppConfig>;
  autoComplete?: ComputedRef<AutoCompleteConfig>;
  avatar?: ComputedRef<AvatarConfig>;
  badge?: ComputedRef<BadgeConfig>;
  borderBeam?: ComputedRef<BorderBeamConfig>;
  breadcrumb?: ComputedRef<BreadcrumbConfig>;
  button?: ComputedRef<ButtonConfig>;
  calendar?: ComputedRef<CalendarConfig>;
  card?: ComputedRef<CardConfig>;
  cardMeta?: ComputedRef<CardMetaConfig>;
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
  inputPassword?: ComputedRef<InputPasswordConfig>;
  inputSearch?: ComputedRef<InputSearchConfig>;
  layout?: ComputedRef<LayoutConfig>;
  list?: ComputedRef<ListConfig>;
  listy?: ComputedRef<ListyConfig>;
  masonry?: ComputedRef<MasonryConfig>;
  mentions?: ComputedRef<MentionsConfig>;
  menu?: ComputedRef<MenuConfig>;
  modal?: ComputedRef<ModalConfig>;
  otp?: ComputedRef<OTPConfig>;
  popconfirm?: ComputedRef<PopconfirmConfig>;
  popover?: ComputedRef<PopoverConfig>;
  progress?: ComputedRef<ProgressConfig>;
  qrcode?: ComputedRef<QRcodeConfig>;
  radio?: ComputedRef<RadioConfig>;
  rangePicker?: ComputedRef<RangePickerConfig>;
  rate?: ComputedRef<RateConfig>;
  result?: ComputedRef<ResultConfig>;
  ribbon?: ComputedRef<RibbonConfig>;
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
  watermark?: ComputedRef<WatermarkConfig>;
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

const EMPTY_CONFIG_OBJECT: Record<string, any> = {};

export function mergeSemanticClassNames<T extends Record<string, any>>(
  ctxClassNames?: T,
  propClassNames?: T,
): T {
  if (!ctxClassNames && !propClassNames) return EMPTY_CONFIG_OBJECT as T;
  const merged: Record<string, any> = { ...ctxClassNames };
  if (propClassNames) {
    Object.keys(propClassNames).forEach(key => {
      const ctxVal = merged[key];
      const propVal = propClassNames[key];
      if (ctxVal && propVal && typeof ctxVal === 'object' && typeof propVal === 'object') {
        merged[key] = mergeSemanticClassNames(ctxVal, propVal);
      } else if (ctxVal && propVal) {
        merged[key] = `${ctxVal} ${propVal}`;
      } else if (propVal !== undefined) {
        merged[key] = propVal;
      }
    });
  }
  return merged as T;
}

export function mergeSemanticStyles<T extends Record<string, any>>(
  ctxStyles?: T,
  propStyles?: T,
): T {
  if (!ctxStyles && !propStyles) return EMPTY_CONFIG_OBJECT as T;
  const merged: Record<string, any> = { ...ctxStyles };
  if (propStyles) {
    Object.keys(propStyles).forEach(key => {
      const ctxVal = merged[key];
      const propVal = propStyles[key];
      if (ctxVal && propVal && typeof ctxVal === 'object' && typeof propVal === 'object') {
        merged[key] = { ...ctxVal, ...propVal };
      } else if (propVal !== undefined) {
        merged[key] = propVal;
      }
    });
  }
  return merged as T;
}

export type ComponentConfigResult<T extends keyof ConfigComponentProps> = {
  getPrefixCls: ConfigProviderInnerProps['getPrefixCls'];
  direction: ConfigProviderInnerProps['direction'];
  getPopupContainer: ConfigProviderInnerProps['getPopupContainer'];
  renderEmpty: ConfigProviderInnerProps['renderEmpty'];
  popupOverflow: ConfigProviderInnerProps['popupOverflow'];
  holderRender: ConfigProviderInnerProps['holderRender'];
  componentConfig: ComputedRef<NonNullable<ConfigComponentProps[T]>>;
  className: ComputedRef<string | undefined>;
  style: ComputedRef<CSSProperties | undefined>;
  classNames: ComputedRef<Record<string, any>>;
  styles: ComputedRef<Record<string, any>>;
};

export function useComponentConfig<T extends keyof ConfigComponentProps>(
  propName: T,
): ComponentConfigResult<T> {
  const configProvider = useConfigContextInject();
  const componentConfig = computed<NonNullable<ConfigComponentProps[T]>>(
    () =>
      ((configProvider as any)[propName]?.value || EMPTY_CONFIG_OBJECT) as NonNullable<
        ConfigComponentProps[T]
      >,
  );
  const className = computed(() => (componentConfig.value as any)?.className as string | undefined);
  const style = computed(() => (componentConfig.value as any)?.style as CSSProperties | undefined);
  const classNames = computed(
    () =>
      ((componentConfig.value as any)?.classNames || EMPTY_CONFIG_OBJECT) as Record<string, any>,
  );
  const styles = computed(
    () => ((componentConfig.value as any)?.styles || EMPTY_CONFIG_OBJECT) as Record<string, any>,
  );

  return {
    getPrefixCls: configProvider.getPrefixCls,
    direction: configProvider.direction,
    getPopupContainer: configProvider.getPopupContainer,
    renderEmpty: configProvider.renderEmpty,
    popupOverflow: configProvider.popupOverflow,
    holderRender: configProvider.holderRender,
    componentConfig,
    className,
    style,
    classNames,
    styles,
  };
}
