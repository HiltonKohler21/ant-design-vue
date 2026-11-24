import type { App } from 'vue';
import dataFnsGenerateConfig from '../vc-picker/generate/dateFns';
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

export type DatePickerProps = PickerProps<Date> & ExtraDatePickerProps<Date>;
export type MonthPickerProps = Omit<PickerDateProps<Date>, 'picker'> & ExtraDatePickerProps<Date>;
export type WeekPickerProps = Omit<PickerDateProps<Date>, 'picker'> & ExtraDatePickerProps<Date>;
export type RangePickerProps = BaseRangePickerProps<Date> & ExtraRangePickerProps<Date>;

const { DatePicker, WeekPicker, MonthPicker, YearPicker, TimePicker, QuarterPicker, RangePicker } =
  generatePicker<Date>(dataFnsGenerateConfig);

const PurePanel = generatePurePanel<Date>(dataFnsGenerateConfig, {
  displayName: 'ADatePickerPurePanel',
});
const PureRangePanel = generatePurePanel<Date>(dataFnsGenerateConfig, {
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
