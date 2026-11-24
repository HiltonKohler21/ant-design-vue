import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import SwapRightOutlined from '@ant-design/icons-vue/SwapRightOutlined';
import { RangePicker as VCRangePicker } from '../../vc-picker';
import type { GenerateConfig } from '../../vc-picker/generate/index';
import enUS from '../locale/en_US';
import { useLocaleReceiver } from '../../locale-provider/LocaleReceiver';
import {
  composeMinMaxDisabledDate,
  getLocaleDefaultFormat,
  getRangePlaceholder,
  normalizeFormat,
  resolveAllowClearConfig,
  resolveSuffixNode,
  transPlacement2DropdownAlign,
} from '../util';
import { getTimeProps, Components } from '.';
import type { CSSProperties, VNode } from 'vue';
import {
  cloneVNode,
  computed,
  defineComponent,
  Fragment,
  h,
  isVNode,
  onBeforeUnmount,
  ref,
  render,
  watch,
} from 'vue';
import useConfigInject, { useComponentConfig } from '../../config-provider/hooks/useConfigInject';
import useVariant from '../../form/hooks/useVariant';
import classNames from '../../_util/classNames';
import type { CommonProps, RangePickerProps } from './props';
import { commonProps, rangePickerProps } from './props';
import type { PanelMode, RangeValue } from '../../vc-picker/interface';
import type { RangePickerSharedProps } from '../../vc-picker/RangePicker';
import { FormItemInputContext, useInjectFormItemContext } from '../../form/FormItemContext';
import omit from '../../_util/omit';
import { getMergedStatus, getStatusClassNames } from '../../_util/statusUtils';
import useMergedPickerSemantic, {
  applyPickerPopupSemantics,
  applyPickerRootSemantics,
  hasPopupSubSemantics,
} from '../hooks/useMergedPickerSemantic';

//CSSINJS
import useStyle from '../style';
import { useCompactItemContext } from '../../space/Compact';
import devWarning from '../../vc-util/devWarning';
import type { CustomSlotsType } from '../../_util/type';

export default function generateRangePicker<DateType, ExtraProps = {}>(
  generateConfig: GenerateConfig<DateType>,
  extraProps: ExtraProps,
) {
  const RangePicker = defineComponent({
    compatConfig: { MODE: 3 },
    name: 'ARangePicker',
    inheritAttrs: false,
    props: {
      ...commonProps<DateType>(),
      ...rangePickerProps<DateType>(),
      ...extraProps,
    },
    slots: Object as CustomSlotsType<{
      prefix?: any;
      suffix?: any;
      suffixIcon?: any;
      prevIcon?: any;
      nextIcon?: any;
      superPrevIcon?: any;
      superNextIcon?: any;
      dateRender?: any;
      cellRender?: any;
      renderExtraFooter?: any;
      default?: any;
      separator?: any;
      clearIcon?: any;
    }>,
    setup(_props, { expose, slots, attrs, emit }) {
      const props = _props as unknown as CommonProps<DateType> & RangePickerProps<DateType>;
      const formItemContext = useInjectFormItemContext();
      const formItemInputContext = FormItemInputContext.useInject();

      // =================== Warning =====================
      if (process.env.NODE_ENV !== 'production') {
        devWarning(
          !props.dropdownClassName,
          'RangePicker',
          '`dropdownClassName` is deprecated. Please use `popupClassName` instead.',
        );
        devWarning(
          !attrs.getCalendarContainer,
          'DatePicker',
          '`getCalendarContainer` is deprecated. Please use `getPopupContainer"` instead.',
        );
      }

      const { prefixCls, direction, getPopupContainer, size, rootPrefixCls, disabled } =
        useConfigInject('picker', props);
      const { componentConfig: rangePickerConfig, className: rangePickerClassName } =
        useComponentConfig('rangePicker');
      const { componentConfig: datePickerConfig, className: datePickerClassName } =
        useComponentConfig('datePicker');
      const { componentConfig: timePickerConfig, className: timePickerClassName } =
        useComponentConfig('timePicker');
      const [mergedVariant, enableVariantCls] = useVariant(
        'rangePicker',
        computed(() => props.variant),
        computed(() => props.bordered),
        props.picker === 'time' ? 'timePicker' : 'datePicker',
      );
      const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction);
      const mergedSize = computed(() => compactSize.value || size.value);
      const mergedStatus = computed(() =>
        getMergedStatus(formItemInputContext.status, props.status),
      );
      // style
      const [wrapSSR, hashId] = useStyle(prefixCls);

      const pickerType = props.picker === 'time' ? 'timePicker' : 'datePicker';
      const { mergedClassNames, mergedStyles } = useMergedPickerSemantic(
        pickerType,
        () => props.classNames,
        () => props.styles,
        () => props.popupClassName || props.dropdownClassName,
        () => props.popupStyle,
        () => ({
          ...props,
          size: mergedSize.value,
          disabled: disabled.value,
          status: mergedStatus.value,
          variant: mergedVariant.value,
          picker: props.picker || 'date',
        }),
        { includeRangeConfig: true },
      );

      const rootElRef = ref<HTMLElement | null>(null);
      const popupElRef = ref<HTMLElement | null>(null);
      let prefixHostEl: HTMLSpanElement | null = null;
      let popupObserver: MutationObserver | null = null;

      const syncPrefixNode = (rootEl: HTMLElement | null, rawPrefix: any) => {
        if (!rootEl) return;
        const hasPrefix = rawPrefix !== undefined && rawPrefix !== null;
        if (!hasPrefix) {
          if (prefixHostEl) {
            render(null, prefixHostEl);
            prefixHostEl.remove();
            prefixHostEl = null;
          }
          return;
        }
        if (!prefixHostEl) {
          prefixHostEl = document.createElement('span');
          rootEl.insertBefore(prefixHostEl, rootEl.firstChild);
        } else if (prefixHostEl.parentElement !== rootEl) {
          rootEl.insertBefore(prefixHostEl, rootEl.firstChild);
        }
        prefixHostEl.className = `${prefixCls.value}-prefix`;
        render(h(Fragment, null, Array.isArray(rawPrefix) ? rawPrefix : [rawPrefix]), prefixHostEl);
      };

      const syncRootDom = (el?: HTMLElement | null) => {
        const target = el ?? rootElRef.value;
        if (!target) return;
        const rawPrefix = props.prefix !== undefined ? props.prefix : slots.prefix?.();
        syncPrefixNode(target, rawPrefix);
        applyPickerRootSemantics(
          target,
          prefixCls.value,
          mergedClassNames.value,
          mergedStyles.value,
        );
      };

      const cleanupPopupObserver = () => {
        if (popupObserver) {
          popupObserver.disconnect();
          popupObserver = null;
        }
      };

      const syncPopupDom = (el?: HTMLElement | null) => {
        const target = el ?? popupElRef.value;
        if (!target) return;
        const cn = mergedClassNames.value;
        const st = mergedStyles.value;
        if (hasPopupSubSemantics(cn, st)) {
          applyPickerPopupSemantics(target, prefixCls.value, cn, st);
          cleanupPopupObserver();
          const containerEl =
            (target.closest?.(`.${prefixCls.value}-panel-container`) as HTMLElement | null) ||
            target;
          if (typeof MutationObserver !== 'undefined') {
            popupObserver = new MutationObserver(() => {
              applyPickerPopupSemantics(
                containerEl,
                prefixCls.value,
                mergedClassNames.value,
                mergedStyles.value,
              );
            });
            popupObserver.observe(containerEl, { childList: true, subtree: true });
          }
        }
      };

      watch(
        [mergedClassNames, mergedStyles, () => props.prefix],
        () => {
          syncRootDom();
          syncPopupDom();
        },
        { flush: 'post', deep: true },
      );

      onBeforeUnmount(() => {
        cleanupPopupObserver();
        if (prefixHostEl) {
          render(null, prefixHostEl);
          prefixHostEl.remove();
          prefixHostEl = null;
        }
      });

      const pickerRef = ref();
      expose({
        focus: () => {
          pickerRef.value?.focus();
        },
        blur: () => {
          pickerRef.value?.blur();
        },
      });
      const maybeToStrings = (dates: DateType[]) => {
        return props.valueFormat ? generateConfig.toString(dates, props.valueFormat) : dates;
      };
      const onChange = (dates: RangeValue<DateType>, dateStrings: [string, string]) => {
        const values = maybeToStrings(dates);
        emit('update:value', values);
        emit('change', values, dateStrings);
        formItemContext.onFieldChange();
      };
      const onClear = () => {
        emit('clear');
        props.onClear?.();
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
      const onPanelChange = (dates: RangeValue<DateType>, modes: [PanelMode, PanelMode]) => {
        const values = maybeToStrings(dates);
        emit('panelChange', values, modes);
      };
      const onOk = (dates: DateType[]) => {
        const value = maybeToStrings(dates);
        emit('ok', value);
      };
      const onCalendarChange: RangePickerSharedProps<DateType>['onCalendarChange'] = (
        dates: [DateType, DateType],
        dateStrings: [string, string],
        info,
      ) => {
        const values = maybeToStrings(dates);
        emit('calendarChange', values, dateStrings, info);
      };
      const [contextLocale] = useLocaleReceiver('DatePicker', enUS);

      const parseSingleDate = (val: any): DateType | undefined => {
        if (!val) return undefined;
        return (
          props.valueFormat
            ? generateConfig.toDate(val as string | DateType, props.valueFormat)
            : val
        ) as DateType;
      };

      const value = computed(() => {
        if (props.value) {
          return props.valueFormat
            ? generateConfig.toDate(props.value, props.valueFormat)
            : props.value;
        }
        return props.value;
      });
      const defaultValue = computed(() => {
        if (props.defaultValue) {
          return props.valueFormat
            ? generateConfig.toDate(props.defaultValue, props.valueFormat)
            : props.defaultValue;
        }
        return props.defaultValue;
      });
      const defaultPickerValue = computed(() => {
        if (props.defaultPickerValue) {
          return props.valueFormat
            ? generateConfig.toDate(props.defaultPickerValue, props.valueFormat)
            : props.defaultPickerValue;
        }
        return props.defaultPickerValue;
      });
      const minDate = computed(() => parseSingleDate(props.minDate));
      const maxDate = computed(() => parseSingleDate(props.maxDate));

      return () => {
        const locale = {
          ...contextLocale.value,
          ...props.locale,
          lang: {
            ...(contextLocale.value?.lang || {}),
            ...(props.locale?.lang || {}),
          },
        } as any;
        const p = { ...props, ...attrs };
        const isTimePicker = props.picker === 'time';
        const basePickerConfig = isTimePicker ? timePickerConfig.value : datePickerConfig.value;
        const basePickerClassName = isTimePicker
          ? timePickerClassName.value
          : datePickerClassName.value;
        const {
          prefixCls: _customizePrefixCls,
          bordered: _bordered,
          variant: _variant,
          classNames: _classNames,
          styles: _styles,
          minDate: _minDate,
          maxDate: _maxDate,
          cellRender: propCellRender,
          components: propComponents,
          prefix: _propPrefix,
          suffix: propSuffix,
          suffixIcon: propSuffixIcon,
          clearIcon: propClearIcon,
          allowClear: propAllowClear,
          previewValue: _previewValue,
          preserveInvalidOnBlur: _preserveInvalidOnBlur,
          onClear: _onClear,
          placeholder,
          picker = 'date',
          transitionName,
          dateRender = slots.dateRender,
          renderExtraFooter = slots.renderExtraFooter,
          separator = slots.separator?.() ?? rangePickerConfig.value.separator,
          id = formItemContext.id.value,
          rootClassName,
          popupClassName: _popupClassName,
          dropdownClassName: _dropdownClassName,
          popupStyle: _popupStyle,
          ...restProps
        } = p;
        delete restProps['onUpdate:value'];
        delete restProps['onUpdate:open'];
        delete restProps.format;
        delete restProps.disabledDate;
        delete restProps.panelRender;

        const { showTime } = p as any;
        const normalizedFmt = normalizeFormat<DateType>(p.format);
        const localeDefaultFormat =
          normalizedFmt.format === undefined
            ? getLocaleDefaultFormat(locale, picker, showTime)
            : undefined;
        const resolvedFormat = normalizedFmt.format ?? localeDefaultFormat;

        let additionalOverrideProps: any = {};
        additionalOverrideProps = {
          ...additionalOverrideProps,
          ...(showTime
            ? getTimeProps({
                format: resolvedFormat as any,
                picker,
                ...(typeof showTime === 'object' ? showTime : {}),
              })
            : {}),
          ...(picker === 'time'
            ? getTimeProps({
                format: resolvedFormat as any,
                ...omit(restProps, ['disabledTime']),
                picker,
              })
            : {}),
        };
        const pre = prefixCls.value;
        const sc = mergedClassNames.value;
        const ss = mergedStyles.value;

        const rawSuffix =
          propSuffix !== undefined
            ? propSuffix
            : slots.suffix
            ? slots.suffix()
            : propSuffixIcon !== undefined
            ? propSuffixIcon
            : slots.suffixIcon
            ? slots.suffixIcon()
            : basePickerConfig.suffix !== undefined
            ? basePickerConfig.suffix
            : basePickerConfig.suffixIcon;

        const suffixNode = resolveSuffixNode({
          picker,
          hasFeedback: formItemInputContext.hasFeedback,
          feedbackIcon: formItemInputContext.feedbackIcon,
          suffix: rawSuffix,
        });

        const { allowClear: mergedAllowClear, clearIcon: resolvedClearIcon } =
          resolveAllowClearConfig(
            propAllowClear,
            propClearIcon ?? slots.clearIcon?.(),
            basePickerConfig.allowClear,
            basePickerConfig.clearIcon,
          );

        const mergedCellRender =
          propCellRender ||
          (slots.cellRender
            ? (current: any, info: any) => slots.cellRender?.({ current, info })
            : undefined);

        const effectiveDateRender =
          dateRender ||
          (mergedCellRender
            ? ({ current, today, info }: { current: DateType; today: DateType; info: any }) =>
                mergedCellRender(current, {
                  originNode: (
                    <div class={`${pre}-cell-inner`}>{generateConfig.getDate(current)}</div>
                  ),
                  today,
                  range: info?.range,
                  type: 'date',
                  locale: locale.lang,
                })
            : undefined);

        const effectiveDisabledDate = composeMinMaxDisabledDate(
          generateConfig,
          props.disabledDate,
          minDate.value,
          maxDate.value,
          picker,
        );

        const mergedComponents = propComponents
          ? {
              ...Components,
              ...propComponents,
              button: propComponents.okButton || propComponents.button || Components.button,
            }
          : Components;

        const userPanelRender = p.panelRender;
        const wrappedPanelRender = hasPopupSubSemantics(sc, ss)
          ? (originPanel: any) => {
              const rendered = userPanelRender ? userPanelRender(originPanel) : originPanel;
              if (isVNode(rendered)) {
                return cloneVNode(rendered as VNode, {
                  onVnodeMounted: vnode => {
                    popupElRef.value = vnode.el as HTMLElement | null;
                    syncPopupDom(popupElRef.value);
                  },
                  onVnodeUpdated: vnode => {
                    popupElRef.value = vnode.el as HTMLElement | null;
                    syncPopupDom(popupElRef.value);
                  },
                });
              }
              return rendered;
            }
          : userPanelRender;

        const mergedOnMouseup = (e: MouseEvent) => {
          restProps.onMouseup?.(e);
          const target = e.target as HTMLElement | null;
          if (target?.closest?.(`.${pre}-clear`)) {
            onClear();
          }
        };

        return wrapSSR(
          <VCRangePicker
            dateRender={effectiveDateRender}
            renderExtraFooter={renderExtraFooter}
            separator={
              separator || (
                <span aria-label="to" class={`${pre}-separator`}>
                  <SwapRightOutlined />
                </span>
              )
            }
            ref={pickerRef}
            dropdownAlign={transPlacement2DropdownAlign(direction.value, props.placement)}
            placeholder={getRangePlaceholder(locale, picker, placeholder as [string, string])}
            suffixIcon={suffixNode}
            clearIcon={resolvedClearIcon || <CloseCircleFilled />}
            allowClear={mergedAllowClear}
            transitionName={transitionName || `${rootPrefixCls.value}-slide-up`}
            {...restProps}
            {...additionalOverrideProps}
            {...(resolvedFormat !== undefined ? { format: resolvedFormat } : {})}
            {...(effectiveDisabledDate ? { disabledDate: effectiveDisabledDate } : {})}
            {...(wrappedPanelRender ? { panelRender: wrappedPanelRender } : {})}
            disabled={disabled.value}
            id={typeof id === 'object' ? id?.start : id}
            value={value.value}
            defaultValue={defaultValue.value}
            defaultPickerValue={defaultPickerValue.value}
            picker={picker}
            class={classNames(
              rootClassName,
              basePickerClassName,
              rangePickerClassName.value,
              sc.root,
              {
                [`${pre}-${mergedSize.value}`]: mergedSize.value,
                [`${pre}-borderless`]: mergedVariant.value === 'borderless',
                [`${pre}-${mergedVariant.value}`]: enableVariantCls.value,
              },
              getStatusClassNames(pre, mergedStatus.value, formItemInputContext.hasFeedback),
              attrs.class,
              hashId.value,
              compactItemClassnames.value,
            )}
            style={[ss.root, attrs.style as CSSProperties]}
            locale={locale!.lang}
            prefixCls={pre}
            getPopupContainer={attrs.getCalendarContainer || getPopupContainer.value}
            generateConfig={generateConfig}
            prevIcon={slots.prevIcon?.() || <span class={`${pre}-prev-icon`} />}
            nextIcon={slots.nextIcon?.() || <span class={`${pre}-next-icon`} />}
            superPrevIcon={slots.superPrevIcon?.() || <span class={`${pre}-super-prev-icon`} />}
            superNextIcon={slots.superNextIcon?.() || <span class={`${pre}-super-next-icon`} />}
            components={mergedComponents}
            direction={direction.value}
            dropdownClassName={classNames(hashId.value, sc.popup?.root)}
            popupStyle={ss.popup?.root}
            onChange={onChange}
            onOpenChange={onOpenChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onPanelChange={onPanelChange}
            onOk={onOk}
            onCalendarChange={onCalendarChange}
            onMouseup={mergedOnMouseup}
            onVnodeMounted={(vnode: VNode) => {
              rootElRef.value = vnode.el as HTMLElement | null;
              syncRootDom(rootElRef.value);
            }}
            onVnodeUpdated={(vnode: VNode) => {
              rootElRef.value = vnode.el as HTMLElement | null;
              syncRootDom(rootElRef.value);
            }}
          />,
        );
      };
    },
  });

  return RangePicker;
}
