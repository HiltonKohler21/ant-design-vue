import type { CSSProperties, ExtractPropTypes } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import useVariant from '../form/hooks/useVariant';
import type {
  CellRender,
  PickerComponents,
  RangePickerTimeProps,
  TimePickerClassNamesType,
  TimePickerPopupSemanticClassNames,
  TimePickerPopupSemanticStyles,
  TimePickerSemanticClassNames,
  TimePickerSemanticStyles,
  TimePickerStylesType,
} from '../date-picker/generatePicker';
import generatePicker from '../date-picker/generatePicker';
import {
  commonProps,
  datePickerProps,
  rangePickerProps,
} from '../date-picker/generatePicker/props';
import type { CommonProps, DatePickerProps } from '../date-picker/generatePicker/props';
import generatePurePanel from '../date-picker/PurePanel';
import type { GenerateConfig } from '../vc-picker/generate';
import type { PanelMode, RangeValue } from '../vc-picker/interface';
import type { RangePickerSharedProps } from '../vc-picker/RangePicker';
import devWarning from '../vc-util/devWarning';
import { useInjectFormItemContext } from '../form/FormItemContext';
import omit from '../_util/omit';

import type { InputStatus } from '../_util/statusUtils';
import { anyType, booleanType, objectType, someType, stringType } from '../_util/type';
import type { CustomSlotsType, VueNode } from '../_util/type';

export type {
  TimePickerPopupSemanticClassNames,
  TimePickerPopupSemanticStyles,
  TimePickerSemanticClassNames,
  TimePickerSemanticStyles,
  TimePickerClassNamesType,
  TimePickerStylesType,
};

export interface TimePickerLocale {
  placeholder?: string;
  rangePlaceholder?: [string, string];
}

export const timePickerProps = () => ({
  rootClassName: String,
  format: String,
  showNow: booleanType(),
  showHour: booleanType(),
  showMinute: booleanType(),
  showSecond: booleanType(),
  use12Hours: booleanType(),
  hourStep: Number,
  minuteStep: Number,
  secondStep: Number,
  hideDisabledOptions: booleanType(),
  changeOnScroll: booleanType(),
  popupClassName: String,
  popupStyle: objectType<CSSProperties>(),
  classNames: someType<TimePickerClassNamesType<any>>([Object, Function]),
  styles: someType<TimePickerStylesType<any>>([Object, Function]),
  prefix: anyType<VueNode>(),
  suffix: {
    type: [Boolean, String, Number, Object, Function, Array] as any,
    default: undefined,
  },
  status: stringType<InputStatus>(),
});
type CommonTimePickerProps = Partial<ExtractPropTypes<ReturnType<typeof timePickerProps>>>;
export type TimeRangePickerProps<DateType> = Omit<
  RangePickerTimeProps<DateType>,
  | 'picker'
  | 'defaultPickerValue'
  | 'defaultValue'
  | 'value'
  | 'onChange'
  | 'onPanelChange'
  | 'onOk'
  | 'classNames'
  | 'styles'
> & {
  popupClassName?: string;
  popupStyle?: CSSProperties;
  valueFormat?: string;
  classNames?: TimePickerClassNamesType<any>;
  styles?: TimePickerStylesType<any>;
  prefix?: VueNode;
  suffix?: VueNode;
  cellRender?: CellRender<DateType>;
  components?: PickerComponents;
  changeOnScroll?: boolean;
  needConfirm?: boolean;
  onClear?: () => void;
  defaultPickerValue?: RangeValue<DateType> | RangeValue<string>;
  defaultValue?: RangeValue<DateType> | RangeValue<string>;
  value?: RangeValue<DateType> | RangeValue<string>;
  onChange?: (
    value: RangeValue<DateType> | RangeValue<string> | null,
    dateString: [string, string],
  ) => void;
  'onUpdate:value'?: (value: RangeValue<DateType> | RangeValue<string> | null) => void;
  onPanelChange?: (
    values: RangeValue<DateType> | RangeValue<string>,
    modes: [PanelMode, PanelMode],
  ) => void;
  onOk?: (dates: RangeValue<DateType> | RangeValue<string>) => void;
};

export type TimePickerProps<DateType> = Omit<CommonProps<DateType>, 'classNames' | 'styles'> &
  DatePickerProps<DateType> &
  CommonTimePickerProps & {
    addon?: () => void;
    classNames?: TimePickerClassNamesType<any>;
    styles?: TimePickerStylesType<any>;
  };

function createTimePicker<
  DateType,
  DTimePickerProps extends TimePickerProps<DateType> = TimePickerProps<DateType>,
  DTimeRangePickerProps extends TimeRangePickerProps<DateType> = TimeRangePickerProps<DateType>,
>(generateConfig: GenerateConfig<DateType>) {
  const DatePicker = generatePicker<DateType>(generateConfig, {
    ...timePickerProps(),
    order: { type: Boolean, default: true },
  });

  const { TimePicker: InternalTimePicker, RangePicker: InternalRangePicker } = DatePicker as any;
  const PurePanel = generatePurePanel<DateType>(generateConfig, {
    defaultPicker: 'time',
    displayName: 'ATimePickerPurePanel',
  });

  const TimePicker = defineComponent<DTimePickerProps>({
    name: 'ATimePicker',
    inheritAttrs: false,
    props: {
      ...commonProps<any>(),
      ...datePickerProps<any>(),
      ...timePickerProps(),
      addon: { type: Function },
    } as any,
    slots: Object as CustomSlotsType<{
      addon?: any;
      renderExtraFooter?: any;
      prefix?: any;
      suffix?: any;
      suffixIcon?: any;
      clearIcon?: any;
      cellRender?: any;
      default: any;
    }>,
    setup(p, { slots, expose, emit, attrs }) {
      const props = p as unknown as DTimePickerProps;
      const formItemContext = useInjectFormItemContext();
      const [mergedVariant] = useVariant(
        'timePicker',
        computed(() => props.variant),
        computed(() => props.bordered),
      );
      devWarning(
        !(slots.addon || props.addon),
        'TimePicker',
        '`addon` is deprecated. Please use `v-slot:renderExtraFooter` instead.',
      );
      const pickerRef = ref();
      expose({
        focus: () => {
          pickerRef.value?.focus();
        },
        blur: () => {
          pickerRef.value?.blur();
        },
      });
      const onChange = (value: DateType | string, dateString: string) => {
        emit('update:value', value);
        emit('change', value, dateString);
        formItemContext.onFieldChange();
      };
      const onOpenChange = (open: boolean) => {
        emit('update:open', open);
        emit('openChange', open);
      };
      const onFocus = (e: FocusEvent) => {
        emit('focus', e);
      };
      const onBlur = (e: FocusEvent) => {
        emit('blur', e);
        formItemContext.onFieldBlur();
      };
      const onOk = (value: DateType) => {
        emit('ok', value);
      };
      const onClear = () => {
        emit('clear');
        props.onClear?.();
      };
      return () => {
        const { id = formItemContext.id.value } = props;
        return (
          <InternalTimePicker
            {...attrs}
            {...omit(props, ['onUpdate:value', 'onUpdate:open', 'rootClassName', 'onClear'])}
            variant={mergedVariant.value}
            rootClassName={props.rootClassName}
            id={id}
            popupClassName={props.popupClassName}
            popupStyle={props.popupStyle}
            mode={undefined}
            ref={pickerRef}
            renderExtraFooter={
              props.addon || slots.addon || props.renderExtraFooter || slots.renderExtraFooter
            }
            onChange={onChange}
            onOpenChange={onOpenChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onOk={onOk}
            onClear={onClear}
            v-slots={slots}
          />
        );
      };
    },
  });

  const TimeRangePicker = defineComponent<DTimeRangePickerProps>({
    name: 'ATimeRangePicker',
    inheritAttrs: false,
    props: {
      ...commonProps<any>(),
      ...rangePickerProps<any>(),
      ...timePickerProps(),
      order: { type: Boolean, default: true },
    } as any,
    slots: Object as CustomSlotsType<{
      renderExtraFooter?: any;
      prefix?: any;
      suffix?: any;
      suffixIcon?: any;
      clearIcon?: any;
      cellRender?: any;
      default: any;
    }>,
    setup(p, { slots, expose, emit, attrs }) {
      const props = p as unknown as DTimeRangePickerProps;
      const pickerRef = ref();
      const formItemContext = useInjectFormItemContext();
      expose({
        focus: () => {
          pickerRef.value?.focus();
        },
        blur: () => {
          pickerRef.value?.blur();
        },
      });
      const onChange = (
        values: RangeValue<string> | RangeValue<DateType>,
        dateStrings: [string, string],
      ) => {
        emit('update:value', values);
        emit('change', values, dateStrings);
        formItemContext.onFieldChange();
      };
      const onOpenChange = (open: boolean) => {
        emit('update:open', open);
        emit('openChange', open);
      };
      const onFocus = (e: FocusEvent) => {
        emit('focus', e);
      };
      const onBlur = (e: FocusEvent) => {
        emit('blur', e);
        formItemContext.onFieldBlur();
      };
      const onPanelChange = (
        values: RangeValue<string> | RangeValue<DateType>,
        modes: [PanelMode, PanelMode],
      ) => {
        emit('panelChange', values, modes);
      };
      const onOk = (values: RangeValue<string | DateType>) => {
        emit('ok', values);
      };
      const onClear = () => {
        emit('clear');
        props.onClear?.();
      };
      const onCalendarChange: RangePickerSharedProps<DateType>['onCalendarChange'] = (
        values: RangeValue<string> | RangeValue<DateType>,
        dateStrings: [string, string],
        info,
      ) => {
        emit('calendarChange', values, dateStrings, info);
      };
      return () => {
        const { id = formItemContext.id.value } = props;
        return (
          <InternalRangePicker
            {...attrs}
            {...omit(props, ['onUpdate:open', 'onUpdate:value', 'onClear'] as any)}
            id={id}
            popupClassName={props.popupClassName}
            popupStyle={props.popupStyle}
            picker="time"
            mode={undefined}
            ref={pickerRef}
            onChange={onChange}
            onOpenChange={onOpenChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onPanelChange={onPanelChange}
            onOk={onOk}
            onClear={onClear}
            onCalendarChange={onCalendarChange}
            v-slots={slots}
          />
        );
      };
    },
  });

  return {
    TimePicker,
    TimeRangePicker,
    PurePanel,
  };
}

export default createTimePicker;
