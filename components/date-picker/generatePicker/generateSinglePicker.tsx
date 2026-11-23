import CalendarOutlined from '@ant-design/icons-vue/CalendarOutlined';
import ClockCircleOutlined from '@ant-design/icons-vue/ClockCircleOutlined';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import RCPicker from '../../vc-picker';
import EnhancedPicker from './EnhancedPicker';
import type { PanelMode, PickerMode } from '../../vc-picker/interface';
import type { GenerateConfig } from '../../vc-picker/generate/index';
import enUS from '../locale/en_US';
import { getPlaceholder, transPlacement2DropdownAlign } from '../util';
import { useLocaleReceiver } from '../../locale-provider/LocaleReceiver';
import { getTimeProps, Components } from '.';
import type { CSSProperties } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import useConfigInject, { useComponentConfig } from '../../config-provider/hooks/useConfigInject';
import useVariant from '../../form/hooks/useVariant';
import classNames from '../../_util/classNames';
import type { CommonProps, DatePickerProps } from './props';
import { commonProps, datePickerProps } from './props';

import devWarning from '../../vc-util/devWarning';
import { FormItemInputContext, useInjectFormItemContext } from '../../form/FormItemContext';
import { getMergedStatus, getStatusClassNames } from '../../_util/statusUtils';
import { useCompactItemContext } from '../../space/Compact';
import type { CustomSlotsType } from '../../_util/type';
//CSSINJS
import useStyle from '../style';

export default function generateSinglePicker<DateType, ExtraProps = {}>(
  generateConfig: GenerateConfig<DateType>,
  extraProps: ExtraProps,
) {
  function getPicker(picker?: PickerMode, displayName?: string) {
    const comProps = {
      ...commonProps<DateType>(),
      ...datePickerProps<DateType>(),
      ...extraProps,
    };
    return defineComponent({
      compatConfig: { MODE: 3 },
      name: displayName,
      inheritAttrs: false,
      props: comProps,
      slots: Object as CustomSlotsType<{
        suffixIcon?: any;
        prevIcon?: any;
        nextIcon?: any;
        superPrevIcon?: any;
        superNextIcon?: any;
        dateRender?: any;
        renderExtraFooter?: any;
        monthCellRender?: any;
        monthCellContentRender?: any;
        clearIcon?: any;
        default?: any;
      }>,
      setup(_props, { slots, expose, attrs, emit }) {
        // 兼容 vue 3.2.7
        const props = _props as unknown as CommonProps<DateType> &
          DatePickerProps<DateType> &
          ExtraProps;
        const formItemContext = useInjectFormItemContext();
        const formItemInputContext = FormItemInputContext.useInject();
        // =================== Warning =====================
        if (process.env.NODE_ENV !== 'production') {
          devWarning(
            picker !== 'quarter',
            displayName || 'DatePicker',
            `DatePicker.${displayName} is legacy usage. Please use DatePicker[picker='${picker}'] directly.`,
          );

          devWarning(
            !props.dropdownClassName,
            displayName || 'DatePicker',
            '`dropdownClassName` is deprecated. Please use `popupClassName` instead.',
          );
          devWarning(
            !(props.monthCellContentRender || slots.monthCellContentRender),
            displayName || 'DatePicker',
            '`monthCellContentRender` is deprecated. Please use `monthCellRender"` instead.',
          );

          devWarning(
            !attrs.getCalendarContainer,
            displayName || 'DatePicker',
            '`getCalendarContainer` is deprecated. Please use `getPopupContainer"` instead.',
          );
        }

        const { prefixCls, direction, getPopupContainer, size, rootPrefixCls, disabled } =
          useConfigInject('picker', props);
        const pickerConfigKey = picker === 'time' ? 'timePicker' : 'datePicker';
        const {
          componentConfig: pickerConfig,
          className: contextClassName,
          style: contextStyle,
          classNames: contextClassNames,
          styles: contextStyles,
        } = useComponentConfig(pickerConfigKey);
        const [mergedVariant, enableVariantCls] = useVariant(
          pickerConfigKey,
          computed(() => props.variant),
          computed(() => props.bordered),
        );
        const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction);
        const mergedSize = computed(() => compactSize.value || size.value);
        // style
        const [wrapSSR, hashId] = useStyle(prefixCls);

        const pickerRef = ref();
        expose({
          focus: () => {
            pickerRef.value?.focus();
          },
          blur: () => {
            pickerRef.value?.blur();
          },
        });
        const maybeToString = (date: any) => {
          if (Array.isArray(date)) {
            return props.valueFormat
              ? date.map(d => (d ? generateConfig.toString(d, props.valueFormat) : d))
              : date;
          }
          return props.valueFormat ? generateConfig.toString(date, props.valueFormat) : date;
        };
        const onChange = (date: any, dateString: any) => {
          const value = maybeToString(date);
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
        const onPanelChange = (date: DateType, mode: PanelMode | null) => {
          const value = maybeToString(date);
          emit('panelChange', value, mode);
        };
        const onOk = (date: any) => {
          const value = maybeToString(date);
          emit('ok', value);
        };

        const [contextLocale] = useLocaleReceiver('DatePicker', enUS);

        const parseValue = (val: any) => {
          if (props.multiple) {
            if (val === undefined) return undefined;
            if (!val) return [];
            const arr = Array.isArray(val) ? val : [val];
            return props.valueFormat
              ? arr.map(item =>
                  item ? generateConfig.toDate(item as string | DateType, props.valueFormat) : item,
                )
              : arr;
          }
          if (val) {
            return props.valueFormat
              ? generateConfig.toDate(val as string | DateType, props.valueFormat)
              : val;
          }
          return (val === '' ? undefined : val) as DateType;
        };

        const value = computed(() => parseValue(props.value));
        const defaultValue = computed(() => parseValue(props.defaultValue));
        const defaultPickerValue = computed(() => {
          if (props.defaultPickerValue) {
            return props.valueFormat
              ? generateConfig.toDate(
                  props.defaultPickerValue as string | DateType,
                  props.valueFormat,
                )
              : props.defaultPickerValue;
          }
          return (
            props.defaultPickerValue === '' ? undefined : props.defaultPickerValue
          ) as DateType;
        });

        return () => {
          const locale = { ...contextLocale.value, ...props.locale };
          const p = { ...props, ...attrs };
          const {
            bordered: _bordered,
            variant: _variant,
            multiple,
            maxTagCount,
            maxTagPlaceholder,
            needConfirm,
            placeholder,
            suffixIcon = slots.suffixIcon?.() ??
              pickerConfig.value.suffix ??
              pickerConfig.value.suffixIcon,
            showToday = true,
            transitionName,
            allowClear = pickerConfig.value.allowClear ?? true,
            dateRender = slots.dateRender,
            renderExtraFooter = slots.renderExtraFooter,
            monthCellRender = slots.monthCellRender ||
              (props as any).monthCellContentRender ||
              slots.monthCellContentRender,
            clearIcon = slots.clearIcon?.() ?? pickerConfig.value.clearIcon,
            id = formItemContext.id.value,
            rootClassName,
            ...restProps
          } = p;
          const showTime = (p.showTime as string) === '' ? true : p.showTime;
          const { format } = p as any;

          let additionalOverrideProps: any = {};
          if (picker) {
            additionalOverrideProps.picker = picker;
          }
          const mergedPicker = picker || p.picker || 'date';

          additionalOverrideProps = {
            ...additionalOverrideProps,
            ...(showTime
              ? getTimeProps({
                  format,
                  picker: mergedPicker,
                  ...(typeof showTime === 'object' ? showTime : {}),
                })
              : {}),
            ...(mergedPicker === 'time'
              ? getTimeProps({ format, ...restProps, picker: mergedPicker })
              : {}),
          };
          const pre = prefixCls.value;
          const suffixNode = (
            <>
              {suffixIcon || (picker === 'time' ? <ClockCircleOutlined /> : <CalendarOutlined />)}
              {formItemInputContext.hasFeedback && formItemInputContext.feedbackIcon}
            </>
          );
          const defaultNeedsConfirm =
            (mergedPicker === 'date' && !!showTime) || mergedPicker === 'time';
          const useEnhanced =
            !!multiple || (needConfirm !== undefined && needConfirm !== defaultNeedsConfirm);

          const sharedPickerProps = {
            monthCellRender,
            dateRender,
            renderExtraFooter,
            ref: pickerRef,
            placeholder: getPlaceholder(locale, mergedPicker, placeholder),
            suffixIcon: suffixNode,
            dropdownAlign: transPlacement2DropdownAlign(direction.value, props.placement),
            clearIcon: clearIcon || <CloseCircleFilled />,
            allowClear,
            transitionName: transitionName || `${rootPrefixCls.value}-slide-up`,
            ...restProps,
            ...additionalOverrideProps,
            id,
            picker: mergedPicker,
            value: value.value,
            defaultValue: defaultValue.value,
            defaultPickerValue: defaultPickerValue.value,
            showToday,
            locale: locale!.lang,
            class: classNames(
              rootClassName,
              contextClassName.value,
              contextClassNames.value.root,
              {
                [`${pre}-${mergedSize.value}`]: mergedSize.value,
                [`${pre}-borderless`]: mergedVariant.value === 'borderless',
                [`${pre}-${mergedVariant.value}`]: enableVariantCls.value,
              },
              getStatusClassNames(
                pre,
                getMergedStatus(formItemInputContext.status, props.status),
                formItemInputContext.hasFeedback,
              ),
              attrs.class,
              hashId.value,
              compactItemClassnames.value,
            ),
            style: [contextStyle.value, contextStyles.value.root, attrs.style as CSSProperties],
            disabled: disabled.value,
            prefixCls: pre,
            getPopupContainer: attrs.getCalendarContainer || getPopupContainer.value,
            generateConfig,
            prevIcon: slots.prevIcon?.() || <span class={`${pre}-prev-icon`} />,
            nextIcon: slots.nextIcon?.() || <span class={`${pre}-next-icon`} />,
            superPrevIcon: slots.superPrevIcon?.() || <span class={`${pre}-super-prev-icon`} />,
            superNextIcon: slots.superNextIcon?.() || <span class={`${pre}-super-next-icon`} />,
            components: Components,
            direction: direction.value,
            dropdownClassName: classNames(
              hashId.value,
              contextClassNames.value.popup?.root,
              props.popupClassName,
              props.dropdownClassName,
            ),
            onChange,
            onOpenChange,
            onFocus,
            onBlur,
            onPanelChange,
            onOk,
          };

          if (useEnhanced) {
            return wrapSSR(
              <EnhancedPicker
                {...(sharedPickerProps as any)}
                multiple={!!multiple}
                maxTagCount={maxTagCount}
                maxTagPlaceholder={maxTagPlaceholder}
                needConfirm={needConfirm}
              />,
            );
          }

          return wrapSSR(<RCPicker {...(sharedPickerProps as any)} />);
        };
      },
    });
  }

  const DatePicker = getPicker(undefined, 'ADatePicker');
  const WeekPicker = getPicker('week', 'AWeekPicker');
  const MonthPicker = getPicker('month', 'AMonthPicker');
  const YearPicker = getPicker('year', 'AYearPicker');
  const TimePicker = getPicker('time', 'TimePicker'); // 给独立组件 TimePicker 使用，此处名称不用更改
  const QuarterPicker = getPicker('quarter', 'AQuarterPicker');

  return {
    DatePicker,
    WeekPicker,
    MonthPicker,
    YearPicker,
    TimePicker,
    QuarterPicker,
  };
}
