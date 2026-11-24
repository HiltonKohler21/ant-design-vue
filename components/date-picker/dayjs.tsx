import type { Dayjs } from 'dayjs';
import type { App } from 'vue';
import dayjsGenerateConfig from '../vc-picker/generate/dayjs';
import type {
  PickerProps,
  PickerDateProps,
  RangePickerProps as BaseRangePickerProps,
  DatePickerSemanticClassNames,
  DatePickerSemanticStyles,
  DatePickerClassNamesType,
  DatePickerStylesType,
  DatePickerSemanticType,
} from './generatePicker';
import generatePicker from './generatePicker';
import type { ExtraDatePickerProps, ExtraRangePickerProps } from './generatePicker/props';
import generatePurePanel from './PurePanel';

export type {
  DatePickerSemanticClassNames,
  DatePickerSemanticStyles,
  DatePickerClassNamesType,
  DatePickerStylesType,
  DatePickerSemanticType,
};

export type DatePickerProps = PickerProps<Dayjs> & ExtraDatePickerProps<Dayjs>;
export type MonthPickerProps = Omit<PickerDateProps<Dayjs>, 'picker'> & ExtraDatePickerProps<Dayjs>;
export type WeekPickerProps = Omit<PickerDateProps<Dayjs>, 'picker'> & ExtraDatePickerProps<Dayjs>;
export type RangePickerProps = BaseRangePickerProps<Dayjs> & ExtraRangePickerProps<Dayjs>;

const { DatePicker, WeekPicker, MonthPicker, YearPicker, TimePicker, QuarterPicker, RangePicker } =
  generatePicker<Dayjs>(dayjsGenerateConfig);

const PurePanel = generatePurePanel<Dayjs>(dayjsGenerateConfig, {
  displayName: 'ADatePickerPurePanel',
});
const PureRangePanel = generatePurePanel<Dayjs>(dayjsGenerateConfig, {
  isRange: true,
  displayName: 'ADateRangePickerPurePanel',
});

/* istanbul ignore next */
export { RangePicker, WeekPicker, MonthPicker, QuarterPicker, generatePicker };

export default Object.assign(DatePicker, {
  WeekPicker,
  MonthPicker,
  YearPicker,
  RangePicker,
  TimePicker,
  QuarterPicker,
  generatePicker,
  _InternalPanelDoNotUseOrYouWillBeFired: PurePanel,
  _InternalRangePanelDoNotUseOrYouWillBeFired: PureRangePanel,
  install: (app: App) => {
    app.component(DatePicker.name, DatePicker);
    app.component(RangePicker.name, RangePicker);
    app.component(MonthPicker.name, MonthPicker);
    app.component(WeekPicker.name, WeekPicker);
    app.component(QuarterPicker.name, QuarterPicker);
    return app;
  },
});
