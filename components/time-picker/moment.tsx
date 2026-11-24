import type { Moment } from 'moment';
import type { App, CSSProperties } from 'vue';
import createTimePicker from './time-picker';
import type {
  TimePickerClassNamesType,
  TimePickerSemanticClassNames,
  TimePickerSemanticStyles,
  TimePickerStylesType,
} from './time-picker';
import momentGenerateConfig from '../vc-picker/generate/moment';
import type { PickerTimeProps, RangePickerTimeProps } from '../date-picker/generatePicker';

export type {
  TimePickerSemanticClassNames,
  TimePickerSemanticStyles,
  TimePickerClassNamesType,
  TimePickerStylesType,
};

const { TimePicker, TimeRangePicker, PurePanel } = createTimePicker<Moment>(momentGenerateConfig);

export interface TimeRangePickerProps
  extends Omit<RangePickerTimeProps<Moment>, 'picker' | 'classNames' | 'styles'> {
  popupClassName?: string;
  popupStyle?: CSSProperties;
  valueFormat?: string;
  classNames?: TimePickerClassNamesType<TimeRangePickerProps>;
  styles?: TimePickerStylesType<TimeRangePickerProps>;
}
export interface TimePickerProps
  extends Omit<PickerTimeProps<Moment>, 'picker' | 'classNames' | 'styles'> {
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
