import type { App, CSSProperties } from 'vue';
import createTimePicker from './time-picker';
import type {
  TimePickerClassNamesType,
  TimePickerSemanticClassNames,
  TimePickerSemanticStyles,
  TimePickerStylesType,
} from './time-picker';
import dateFnsGenerateConfig from '../vc-picker/generate/dateFns';
import type { PickerTimeProps, RangePickerTimeProps } from '../date-picker/generatePicker';

export type {
  TimePickerSemanticClassNames,
  TimePickerSemanticStyles,
  TimePickerClassNamesType,
  TimePickerStylesType,
};

const { TimePicker, TimeRangePicker, PurePanel } = createTimePicker<Date>(dateFnsGenerateConfig);

export interface TimeRangePickerProps
  extends Omit<RangePickerTimeProps<Date>, 'picker' | 'classNames' | 'styles'> {
  popupClassName?: string;
  popupStyle?: CSSProperties;
  valueFormat?: string;
  classNames?: TimePickerClassNamesType<TimeRangePickerProps>;
  styles?: TimePickerStylesType<TimeRangePickerProps>;
}
export interface TimePickerProps
  extends Omit<PickerTimeProps<Date>, 'picker' | 'classNames' | 'styles'> {
  popupClassName?: string;
  popupStyle?: CSSProperties;
  valueFormat?: string;
  classNames?: TimePickerClassNamesType<TimePickerProps>;
  styles?: TimePickerStylesType<TimePickerProps>;
}
/* istanbul ignore next */
export { TimePicker, TimeRangePicker };
export default Object.assign(TimePicker, {
  TimePicker,
  TimeRangePicker,
  RangePicker: TimeRangePicker,
  _InternalPanelDoNotUseOrYouWillBeFired: PurePanel,
  install: (app: App) => {
    app.component(TimePicker.name, TimePicker);
    app.component(TimeRangePicker.name, TimeRangePicker);
    return app;
  },
});
