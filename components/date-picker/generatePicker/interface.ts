import type {
  PickerBaseProps as RCPickerBaseProps,
  PickerDateProps as RCPickerDateProps,
  PickerTimeProps as RCPickerTimeProps,
} from '../../vc-picker/Picker';
import type {
  RangePickerBaseProps as RCRangePickerBaseProps,
  RangePickerDateProps as RCRangePickerDateProps,
  RangePickerTimeProps as RCRangePickerTimeProps,
} from '../../vc-picker/RangePicker';
import type { Locale as RcPickerLocale, PanelMode } from '../../vc-picker/interface';
import type { TimePickerLocale } from '../../time-picker';
import type { SizeType, Variant } from '../../config-provider';
import type { VueNode } from '../../_util/type';
import type {
  DatePickerClassNamesType,
  DatePickerPopupSemanticClassNames,
  DatePickerPopupSemanticStyles,
  DatePickerSemanticClassNames,
  DatePickerSemanticStyles,
  DatePickerSemanticType,
  DatePickerStylesType,
  TimePickerClassNamesType,
  TimePickerPopupSemanticClassNames,
  TimePickerPopupSemanticStyles,
  TimePickerSemanticClassNames,
  TimePickerSemanticStyles,
  TimePickerStylesType,
} from '../hooks/useMergedPickerSemantic';
import type { AllowClearConfig, FormatType, MaskFormatConfig } from '../util';

export type {
  DatePickerPopupSemanticClassNames,
  DatePickerPopupSemanticStyles,
  DatePickerSemanticClassNames,
  DatePickerSemanticStyles,
  DatePickerClassNamesType,
  DatePickerStylesType,
  DatePickerSemanticType,
  TimePickerPopupSemanticClassNames,
  TimePickerPopupSemanticStyles,
  TimePickerSemanticClassNames,
  TimePickerSemanticStyles,
  TimePickerClassNamesType,
  TimePickerStylesType,
  AllowClearConfig,
  FormatType,
  MaskFormatConfig,
};

export interface CellRenderInfo<DateType = any> {
  originNode: VueNode;
  today: DateType;
  range?: 'start' | 'end';
  type: PanelMode;
  locale?: RcPickerLocale;
  subType?: 'hour' | 'minute' | 'second' | 'meridiem';
}

export type CellRender<DateType = any> = (
  current: DateType | number | string,
  info: CellRenderInfo<DateType>,
) => VueNode;

export interface PickerComponents {
  button?: any;
  okButton?: any;
  nowButton?: any;
  rangeItem?: any;
  input?: any;
  date?: any;
  time?: any;
  week?: any;
  month?: any;
  quarter?: any;
  year?: any;
  decade?: any;
}

type InjectDefaultProps<Props> = Omit<
  Props,
  | 'locale'
  | 'generateConfig'
  | 'prevIcon'
  | 'nextIcon'
  | 'superPrevIcon'
  | 'superNextIcon'
  | 'hideHeader'
  | 'components'
  | 'format'
  | 'allowClear'
> & {
  locale?: PickerLocale;
  size?: SizeType;
  bordered?: boolean;
  variant?: Variant;
  needConfirm?: boolean;
  format?: FormatType<any>;
  allowClear?: boolean | AllowClearConfig;
  prefix?: VueNode;
  suffix?: VueNode;
  classNames?: DatePickerClassNamesType<any>;
  styles?: DatePickerStylesType<any>;
  minDate?: any;
  maxDate?: any;
  cellRender?: CellRender<any>;
  components?: PickerComponents;
  changeOnScroll?: boolean;
  previewValue?: false | 'hover';
  preserveInvalidOnBlur?: boolean;
  showWeek?: boolean;
  onClear?: () => void;
};

export type PickerLocale = {
  lang: RcPickerLocale & AdditionalPickerLocaleLangProps;
  timePickerLocale: TimePickerLocale;
} & AdditionalPickerLocaleProps;

export type AdditionalPickerLocaleProps = {
  dateFormat?: string;
  dateTimeFormat?: string;
  weekFormat?: string;
  monthFormat?: string;
};

export type AdditionalPickerLocaleLangProps = {
  placeholder: string;
  yearPlaceholder?: string;
  quarterPlaceholder?: string;
  monthPlaceholder?: string;
  weekPlaceholder?: string;
  rangeYearPlaceholder?: [string, string];
  rangeQuarterPlaceholder?: [string, string];
  rangeMonthPlaceholder?: [string, string];
  rangeWeekPlaceholder?: [string, string];
  rangePlaceholder?: [string, string];
  fieldDateFormat?: string;
  fieldDateTimeFormat?: string;
  fieldYearFormat?: string;
  fieldMonthFormat?: string;
  fieldWeekFormat?: string;
  fieldQuarterFormat?: string;
  fieldTimeFormat?: string;
  cellYearFormat?: string;
  clear?: string;
};

// Picker Props
export type PickerBaseProps<DateType> = InjectDefaultProps<RCPickerBaseProps<DateType>>;
export type PickerDateProps<DateType> = InjectDefaultProps<RCPickerDateProps<DateType>>;
export type PickerTimeProps<DateType> = InjectDefaultProps<RCPickerTimeProps<DateType>>;

export type PickerProps<DateType> =
  | PickerBaseProps<DateType>
  | PickerDateProps<DateType>
  | PickerTimeProps<DateType>;

// Range Picker Props
export type RangePickerBaseProps<DateType> = InjectDefaultProps<RCRangePickerBaseProps<DateType>>;
export type RangePickerDateProps<DateType> = InjectDefaultProps<RCRangePickerDateProps<DateType>>;
export type RangePickerTimeProps<DateType> = InjectDefaultProps<RCRangePickerTimeProps<DateType>>;

export type RangePickerProps<DateType> =
  | RangePickerBaseProps<DateType>
  | RangePickerDateProps<DateType>
  | RangePickerTimeProps<DateType>;
