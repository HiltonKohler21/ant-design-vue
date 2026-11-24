import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import RCPicker from '../../vc-picker';
import EnhancedPicker from './EnhancedPicker';
import type { PanelMode, PickerMode } from '../../vc-picker/interface';
import type { GenerateConfig } from '../../vc-picker/generate/index';
import enUS from '../locale/en_US';
import {
  composeMinMaxDisabledDate,
  getLocaleDefaultFormat,
  getMaskSegments,
  getPlaceholder,
  normalizeFormat,
  resolveAllowClearConfig,
  resolveSuffixNode,
  transPlacement2DropdownAlign,
} from '../util';
import { useLocaleReceiver } from '../../locale-provider/LocaleReceiver';
import { getTimeProps, Components } from '.';
import type { CSSProperties, VNode } from 'vue';
import { cloneVNode, computed, defineComponent, isVNode, onBeforeUnmount, ref, watch } from 'vue';
import useConfigInject, { useComponentConfig } from '../../config-provider/hooks/useConfigInject';
import useVariant from '../../form/hooks/useVariant';
import classNames from '../../_util/classNames';
import omit from '../../_util/omit';
import type { CommonProps, DatePickerProps } from './props';
import { commonProps, datePickerProps } from './props';
import useMergedPickerSemantic, {
  applyPickerPopupSemantics,
  applyPickerRootSemantics,
  hasPopupSubSemantics,
} from '../hooks/useMergedPickerSemantic';
import devWarning from '../../vc-util/devWarning';
import { FormItemInputContext, useInjectFormItemContext } from '../../form/FormItemContext';
import { getMergedStatus, getStatusClassNames } from '../../_util/statusUtils';
import { useCompactItemContext } from '../../space/Compact';
import type { CustomSlotsType } from '../../_util/type';
//CSSINJS
import useStyle from '../style';

const PANEL_COMPONENT_KEYS = [
  'date',
  'time',
  'week',
  'month',
  'quarter',
  'year',
  'decade',
] as const;

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
        const { componentConfig: pickerConfig, className: contextClassName } =
          useComponentConfig(pickerConfigKey);
        const [mergedVariant, enableVariantCls] = useVariant(
          pickerConfigKey,
          computed(() => props.variant),
          computed(() => props.bordered),
        );
        const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction);
        const mergedSize = computed(() => compactSize.value || size.value);
        const mergedStatus = computed(() =>
          getMergedStatus(formItemInputContext.status, props.status),
        );
        // style
        const [wrapSSR, hashId] = useStyle(prefixCls);

        // ====================== Semantic ======================
        const { mergedClassNames, mergedStyles } = useMergedPickerSemantic(
          pickerConfigKey,
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
            picker: picker || props.picker || 'date',
          }),
        );

        const rootElRef = ref<HTMLElement | null>(null);
        const popupElRef = ref<HTMLElement | null>(null);
        let popupObserver: MutationObserver | null = null;

        const syncRootDom = (el?: HTMLElement | null) => {
          const target = el ?? rootElRef.value;
          if (!target) return;
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
          [mergedClassNames, mergedStyles],
          () => {
            syncRootDom();
            syncPopupDom();
          },
          { flush: 'post', deep: true },
        );

        onBeforeUnmount(() => {
          cleanupPopupObserver();
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
        const onPanelChange = (date: DateType, mode: PanelMode | null) => {
          const value = maybeToString(date);
          emit('panelChange', value, mode);
        };
        const onOk = (date: any) => {
          const value = maybeToString(date);
          emit('ok', value);
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
          const {
            bordered: _bordered,
            variant: _variant,
            classNames: _classNames,
            styles: _styles,
            multiple,
            maxTagCount,
            maxTagPlaceholder,
            tagRender,
            needConfirm,
            changeOnScroll,
            minDate: _minDate,
            maxDate: _maxDate,
            cellRender: propCellRender,
            components: propComponents,
            prefix: propPrefix,
            suffix: propSuffix,
            suffixIcon: propSuffixIcon,
            clearIcon: propClearIcon,
            allowClear: propAllowClear,
            previewValue: _previewValue,
            preserveInvalidOnBlur: _preserveInvalidOnBlur,
            onClear: _onClear,
            placeholder,
            showToday = true,
            transitionName,
            dateRender = slots.dateRender,
            renderExtraFooter = slots.renderExtraFooter,
            monthCellRender = slots.monthCellRender ||
              (props as any).monthCellContentRender ||
              slots.monthCellContentRender,
            id = formItemContext.id.value,
            rootClassName,
            popupClassName: _popupClassName,
            dropdownClassName: _dropdownClassName,
            popupStyle: _popupStyle,
            ...restProps
          } = p;

          const showTime = (p.showTime as string) === '' ? true : p.showTime;
          const mergedPicker = picker || p.picker || 'date';

          // Normalize format (supports mask object `{ format, type: 'mask' }` and locale `fieldDateFormat`)
          const normalizedFmt = normalizeFormat<DateType>(p.format);
          const localeDefaultFormat =
            normalizedFmt.format === undefined
              ? getLocaleDefaultFormat(locale, mergedPicker, showTime)
              : undefined;
          const resolvedFormat = normalizedFmt.format ?? localeDefaultFormat;

          let additionalOverrideProps: any = {};
          if (picker) {
            additionalOverrideProps.picker = picker;
          }

          additionalOverrideProps = {
            ...additionalOverrideProps,
            ...(showTime
              ? getTimeProps({
                  format: resolvedFormat as any,
                  picker: mergedPicker,
                  ...(typeof showTime === 'object' ? showTime : {}),
                })
              : {}),
            ...(mergedPicker === 'time'
              ? getTimeProps({ format: resolvedFormat as any, ...restProps, picker: mergedPicker })
              : {}),
          };

          const pre = prefixCls.value;
          const sc = mergedClassNames.value;
          const ss = mergedStyles.value;

          // Resolve prefix
          const rawPrefix = propPrefix !== undefined ? propPrefix : slots.prefix?.();
          const hasPrefix = rawPrefix !== undefined && rawPrefix !== null;

          // Resolve suffix (supports `suffix={false}` / `suffix={null}` / `suffix` / `suffixIcon`)
          const rawSuffix =
            propSuffix !== undefined
              ? propSuffix
              : slots.suffix
              ? slots.suffix()
              : propSuffixIcon !== undefined
              ? propSuffixIcon
              : slots.suffixIcon
              ? slots.suffixIcon()
              : pickerConfig.value.suffix !== undefined
              ? pickerConfig.value.suffix
              : pickerConfig.value.suffixIcon;

          const suffixNode = resolveSuffixNode({
            picker: mergedPicker,
            hasFeedback: formItemInputContext.hasFeedback,
            feedbackIcon: formItemInputContext.feedbackIcon,
            suffix: rawSuffix,
          });

          // Resolve allowClear & clearIcon
          const { allowClear: mergedAllowClear, clearIcon: resolvedClearIcon } =
            resolveAllowClearConfig(
              propAllowClear,
              propClearIcon ?? slots.clearIcon?.(),
              pickerConfig.value.allowClear,
              pickerConfig.value.clearIcon,
            );

          // Bridge `cellRender` to `dateRender` / `monthCellRender`
          const mergedCellRender =
            propCellRender ||
            (slots.cellRender
              ? (current: any, info: any) => slots.cellRender?.({ current, info })
              : undefined);

          const effectiveDateRender =
            dateRender ||
            (mergedCellRender
              ? ({ current, today }: { current: DateType; today: DateType }) =>
                  mergedCellRender(current, {
                    originNode: (
                      <div class={`${pre}-cell-inner`}>{generateConfig.getDate(current)}</div>
                    ),
                    today,
                    type: 'date',
                    locale: locale.lang,
                  })
              : undefined);

          const effectiveMonthCellRender =
            monthCellRender ||
            (mergedCellRender
              ? ({ current, locale: cellLocale }: { current: DateType; locale: any }) => {
                  const monthsLocale: string[] =
                    cellLocale.shortMonths ||
                    (generateConfig.locale.getShortMonths
                      ? generateConfig.locale.getShortMonths(cellLocale.locale)
                      : []);
                  const label = monthsLocale[generateConfig.getMonth(current)];
                  return mergedCellRender(current, {
                    originNode: <div class={`${pre}-cell-inner`}>{label}</div>,
                    today: generateConfig.getNow(),
                    type: 'month',
                    locale: cellLocale,
                  });
                }
              : undefined);

          // Compose minDate / maxDate with disabledDate
          const effectiveDisabledDate = composeMinMaxDisabledDate(
            generateConfig,
            props.disabledDate,
            minDate.value,
            maxDate.value,
            mergedPicker,
          );

          // Merge components
          const mergedComponents = propComponents
            ? {
                ...Components,
                ...propComponents,
                button: propComponents.okButton || propComponents.button || Components.button,
              }
            : Components;

          const hasCustomPanelComponent = !!(
            propComponents && PANEL_COMPONENT_KEYS.some(k => !!(propComponents as any)[k])
          );

          const defaultNeedsConfirm =
            (mergedPicker === 'date' && !!showTime) || mergedPicker === 'time';
          const useEnhanced =
            !!multiple ||
            !!changeOnScroll ||
            hasCustomPanelComponent ||
            (needConfirm !== undefined && needConfirm !== defaultNeedsConfirm);

          // Wrap panelRender to sync popup sub-slot semantics without adding extra DOM wrappers
          const userPanelRender = props.panelRender;
          const wrappedPanelRender =
            !useEnhanced && hasPopupSubSemantics(sc, ss)
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

          // Provide inputRender only when prefix / mask / input semantics are active
          const needCustomInputRender =
            !useEnhanced && (hasPrefix || normalizedFmt.isMask || !!sc.input || !!ss.input);

          const customInputRender = needCustomInputRender
            ? (inputProps: any) => {
                const origKeydown = inputProps.onKeydown;
                const maskKeydown =
                  normalizedFmt.isMask && normalizedFmt.maskPattern
                    ? (e: KeyboardEvent) => {
                        const el = e.target as HTMLInputElement;
                        if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && el && el.value) {
                          const segments = getMaskSegments(normalizedFmt.maskPattern!);
                          if (segments.length) {
                            const curStart = el.selectionStart ?? 0;
                            let idx = segments.findIndex(
                              s => curStart >= s.start && curStart <= s.end,
                            );
                            if (idx < 0) idx = 0;
                            const nextIdx =
                              e.key === 'ArrowRight'
                                ? Math.min(segments.length - 1, idx + 1)
                                : Math.max(0, idx - 1);
                            e.preventDefault();
                            el.setSelectionRange(segments[nextIdx].start, segments[nextIdx].end);
                            return;
                          }
                        }
                        origKeydown?.(e);
                      }
                    : origKeydown;

                const inputEl = (
                  <input
                    {...inputProps}
                    onKeydown={maskKeydown}
                    class={classNames(inputProps.class, sc.input)}
                    style={ss.input}
                  />
                );
                if (hasPrefix) {
                  return (
                    <>
                      <span class={classNames(`${pre}-prefix`, sc.prefix)} style={ss.prefix}>
                        {rawPrefix}
                      </span>
                      {inputEl}
                    </>
                  );
                }
                return inputEl;
              }
            : undefined;

          const cleanedRestProps = omit(restProps, [
            'onUpdate:value',
            'onUpdate:open',
            'format',
            'disabledDate',
            'panelRender',
          ]);

          const mergedOnMouseup = (e: MouseEvent) => {
            props.onMouseup?.(e);
            if (!useEnhanced) {
              const target = e.target as HTMLElement | null;
              if (target?.closest?.(`.${pre}-clear`)) {
                onClear();
              }
            }
          };

          const sharedPickerProps: Record<string, any> = {
            monthCellRender: effectiveMonthCellRender,
            dateRender: effectiveDateRender,
            renderExtraFooter,
            ref: pickerRef,
            placeholder: getPlaceholder(locale, mergedPicker, placeholder),
            suffixIcon: suffixNode,
            dropdownAlign: transPlacement2DropdownAlign(direction.value, props.placement),
            clearIcon: resolvedClearIcon || <CloseCircleFilled />,
            allowClear: mergedAllowClear,
            transitionName: transitionName || `${rootPrefixCls.value}-slide-up`,
            ...cleanedRestProps,
            ...additionalOverrideProps,
            ...(resolvedFormat !== undefined ? { format: resolvedFormat } : {}),
            ...(effectiveDisabledDate ? { disabledDate: effectiveDisabledDate } : {}),
            ...(wrappedPanelRender ? { panelRender: wrappedPanelRender } : {}),
            id: typeof id === 'object' ? id?.start : id,
            picker: mergedPicker,
            value: value.value,
            defaultValue: defaultValue.value,
            defaultPickerValue: defaultPickerValue.value,
            showToday,
            locale: locale!.lang,
            class: classNames(
              rootClassName,
              contextClassName.value,
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
            ),
            style: [ss.root, attrs.style as CSSProperties],
            disabled: disabled.value,
            prefixCls: pre,
            getPopupContainer: attrs.getCalendarContainer || getPopupContainer.value,
            generateConfig,
            prevIcon: slots.prevIcon?.() || <span class={`${pre}-prev-icon`} />,
            nextIcon: slots.nextIcon?.() || <span class={`${pre}-next-icon`} />,
            superPrevIcon: slots.superPrevIcon?.() || <span class={`${pre}-super-prev-icon`} />,
            superNextIcon: slots.superNextIcon?.() || <span class={`${pre}-super-next-icon`} />,
            components: mergedComponents,
            direction: direction.value,
            dropdownClassName: classNames(hashId.value, sc.popup?.root),
            popupStyle: ss.popup?.root,
            onChange,
            onOpenChange,
            onFocus,
            onBlur,
            onPanelChange,
            onOk,
            onMouseup: mergedOnMouseup,
          };

          if (useEnhanced) {
            return wrapSSR(
              <EnhancedPicker
                {...(sharedPickerProps as any)}
                prefix={hasPrefix ? rawPrefix : undefined}
                semanticClassNames={sc}
                semanticStyles={ss}
                multiple={!!multiple}
                maxTagCount={maxTagCount}
                maxTagPlaceholder={maxTagPlaceholder}
                tagRender={tagRender}
                needConfirm={needConfirm}
                changeOnScroll={changeOnScroll}
                onClear={onClear}
              />,
            );
          }

          return wrapSSR(
            <RCPicker
              {...(sharedPickerProps as any)}
              {...(customInputRender ? { inputRender: customInputRender } : {})}
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
