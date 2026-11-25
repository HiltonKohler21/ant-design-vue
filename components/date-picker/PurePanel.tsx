import type { CSSProperties, DefineComponent } from 'vue';
import { computed, defineComponent, onBeforeUnmount, ref, watch } from 'vue';
import PickerPanel from '../vc-picker/PickerPanel';
import PresetPanel from '../vc-picker/PresetPanel';
import usePresets from '../vc-picker/hooks/usePresets';
import { useProvidePanel } from '../vc-picker/PanelContext';
import { RangeContextProvider } from '../vc-picker/RangeContext';
import type { GenerateConfig } from '../vc-picker/generate';
import type { PanelMode, PickerMode } from '../vc-picker/interface';
import { getClosingViewDate, formatValue } from '../vc-picker/utils/dateUtil';
import { getDefaultFormat } from '../vc-picker/utils/uiUtil';
import { toArray } from '../vc-picker/utils/miscUtil';
import useMergedState from '../_util/hooks/useMergedState';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import enUS from './locale/en_US';
import useStyle from './style';
import { Components, getTimeProps } from './generatePicker';
import { commonProps, datePickerProps, rangePickerProps } from './generatePicker/props';
import { composeMinMaxDisabledDate, getLocaleDefaultFormat, normalizeFormat } from './util';
import useMergedPickerSemantic, {
  applyPickerPopupSemantics,
  hasPopupSubSemantics,
} from './hooks/useMergedPickerSemantic';

export function generatePurePanel<DateType>(
  generateConfig: GenerateConfig<DateType>,
  options?: {
    defaultPicker?: PickerMode;
    isRange?: boolean;
    displayName?: string;
  },
): DefineComponent<any> {
  const isRange = !!options?.isRange;
  const defaultPicker = options?.defaultPicker;
  const displayName =
    options?.displayName ||
    (isRange
      ? 'ADateRangePickerPurePanel'
      : defaultPicker === 'time'
      ? 'ATimePickerPurePanel'
      : 'ADatePickerPurePanel');

  return defineComponent({
    compatConfig: { MODE: 3 },
    name: displayName,
    inheritAttrs: false,
    props: {
      ...commonProps<DateType>(),
      ...(isRange ? rangePickerProps<DateType>() : datePickerProps<DateType>()),
    },
    setup(_props, { attrs, emit, slots }) {
      const props = _props as any;
      const { prefixCls, direction } = useConfigInject('picker', props);
      const [wrapSSR, hashId] = useStyle(prefixCls);
      const [contextLocale] = useLocaleReceiver('DatePicker', enUS);

      const pickerType = (defaultPicker || props.picker) === 'time' ? 'timePicker' : 'datePicker';

      useProvidePanel({
        open: ref(true),
        hideHeader: computed(() => (defaultPicker || props.picker) === 'time'),
      });

      const { mergedClassNames, mergedStyles } = useMergedPickerSemantic(
        pickerType,
        () => props.classNames,
        () => props.styles,
        () => props.popupClassName || props.dropdownClassName,
        () => props.popupStyle,
        () => ({
          ...props,
          picker: defaultPicker || props.picker || 'date',
        }),
        { includeRangeConfig: isRange },
      );

      const containerElRef = ref<HTMLElement | null>(null);
      let panelObserver: MutationObserver | null = null;

      const cleanupObserver = () => {
        if (panelObserver) {
          panelObserver.disconnect();
          panelObserver = null;
        }
      };

      const syncPopupSemantics = () => {
        const el = containerElRef.value;
        const sc = mergedClassNames.value;
        const ss = mergedStyles.value;
        if (!el) return;
        if (hasPopupSubSemantics(sc, ss)) {
          applyPickerPopupSemantics(el, prefixCls.value, sc, ss);
          cleanupObserver();
          if (typeof MutationObserver !== 'undefined') {
            panelObserver = new MutationObserver(() => {
              applyPickerPopupSemantics(
                el,
                prefixCls.value,
                mergedClassNames.value,
                mergedStyles.value,
              );
            });
            panelObserver.observe(el, { childList: true, subtree: true });
          }
        }
      };

      watch([containerElRef, mergedClassNames, mergedStyles], syncPopupSemantics, {
        flush: 'post',
        deep: true,
      });

      onBeforeUnmount(cleanupObserver);

      const parseSingle = (v: any): DateType | null => {
        if (!v) return null;
        return props.valueFormat ? generateConfig.toDate(v, props.valueFormat) : v;
      };

      const parseRange = (v: any): [DateType | null, DateType | null] | null => {
        if (!Array.isArray(v)) return null;
        return [parseSingle(v[0]), parseSingle(v[1])];
      };

      const [mergedSingleValue, setInnerSingleValue] = useMergedState<DateType | null>(null, {
        value: computed(() =>
          !isRange && props.value !== undefined ? parseSingle(props.value) : undefined,
        ),
        defaultValue: !isRange ? parseSingle(props.defaultValue) : null,
      });

      const [mergedRangeValue, setInnerRangeValue] = useMergedState<
        [DateType | null, DateType | null] | null
      >(null, {
        value: computed(() =>
          isRange && props.value !== undefined ? parseRange(props.value) : undefined,
        ),
        defaultValue: isRange ? parseRange(props.defaultValue) : null,
      });

      const rangeViewDate = ref<any>(
        (isRange && (parseRange(props.defaultPickerValue)?.[0] || mergedRangeValue.value?.[0])) ||
          generateConfig.getNow(),
      );

      const presetList = usePresets(computed(() => props.presets));

      return () => {
        const locale = {
          ...contextLocale.value,
          ...props.locale,
          lang: {
            ...(contextLocale.value?.lang || {}),
            ...(props.locale?.lang || {}),
          },
        } as any;

        const pre = prefixCls.value;
        const sc = mergedClassNames.value;
        const ss = mergedStyles.value;
        const mergedPicker: PickerMode = defaultPicker || props.picker || 'date';
        const showTime = (props.showTime as string) === '' ? true : props.showTime;

        const normalizedFmt = normalizeFormat<DateType>(props.format);
        const localeDefaultFormat =
          normalizedFmt.format === undefined
            ? getLocaleDefaultFormat(locale, mergedPicker, showTime)
            : undefined;
        const resolvedFormat = normalizedFmt.format ?? localeDefaultFormat;
        const formatList = toArray(
          getDefaultFormat(resolvedFormat as any, mergedPicker, showTime, props.use12Hours),
        );

        const formatDate = (date: DateType | null): string => {
          if (!date) return '';
          return formatValue(date, {
            generateConfig,
            locale: locale.lang,
            format: formatList[0],
          });
        };

        const maybeToString = (date: DateType | null) =>
          date && props.valueFormat ? generateConfig.toString(date, props.valueFormat) : date;

        const timeOverrideProps = showTime
          ? getTimeProps({
              format: resolvedFormat as any,
              picker: mergedPicker,
              ...(typeof showTime === 'object' ? showTime : {}),
            })
          : mergedPicker === 'time'
          ? getTimeProps({
              format: resolvedFormat as any,
              picker: mergedPicker,
              showHour: props.showHour,
              showMinute: props.showMinute,
              showSecond: props.showSecond,
              use12Hours: props.use12Hours,
              hourStep: props.hourStep,
              minuteStep: props.minuteStep,
              secondStep: props.secondStep,
              hideDisabledOptions: props.hideDisabledOptions,
              disabledTime: props.disabledTime,
            })
          : {};

        const minDate = parseSingle(props.minDate) || undefined;
        const maxDate = parseSingle(props.maxDate) || undefined;
        const effectiveDisabledDate = composeMinMaxDisabledDate(
          generateConfig,
          props.disabledDate,
          minDate,
          maxDate,
          mergedPicker,
        );

        const mergedComponents = props.components
          ? {
              ...Components,
              ...props.components,
              button: props.components.okButton || props.components.button || Components.button,
            }
          : Components;

        const mergedCellRender =
          props.cellRender ||
          (slots.cellRender
            ? (current: any, info: any) => slots.cellRender?.({ current, info })
            : undefined);

        const effectiveDateRender =
          props.dateRender ||
          slots.dateRender ||
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

        const handleSingleChange = (nextDate: DateType) => {
          setInnerSingleValue(nextDate);
          const outVal = maybeToString(nextDate);
          emit('update:value', outVal);
          emit('change', outVal, formatDate(nextDate));
          props.onChange?.(outVal, formatDate(nextDate));
        };

        const handleRangeSelect = (nextDate: DateType) => {
          const cur = mergedRangeValue.value;
          let nextRange: [DateType | null, DateType | null];
          if (!cur || (cur[0] && cur[1])) {
            nextRange = [nextDate, null];
          } else {
            nextRange =
              cur[0] && generateConfig.isAfter(cur[0], nextDate)
                ? [nextDate, cur[0]]
                : [cur[0], nextDate];
          }
          setInnerRangeValue(nextRange);
          if (nextRange[0] && nextRange[1]) {
            const outVals = [maybeToString(nextRange[0]), maybeToString(nextRange[1])];
            const outStrs: [string, string] = [formatDate(nextRange[0]), formatDate(nextRange[1])];
            emit('update:value', outVals);
            emit('change', outVals, outStrs);
            props.onChange?.(outVals, outStrs);
          }
        };

        const sharedPanelProps: Record<string, any> = {
          ...timeOverrideProps,
          prefixCls: pre,
          generateConfig,
          locale: locale.lang,
          picker: mergedPicker,
          mode: props.mode as PanelMode | undefined,
          disabledDate: effectiveDisabledDate,
          disabledTime: props.disabledTime ?? (timeOverrideProps as any).disabledTime,
          showToday: props.showToday ?? true,
          showNow: props.showNow,
          showWeek: props.showWeek,
          renderExtraFooter: props.renderExtraFooter || slots.renderExtraFooter,
          dateRender: effectiveDateRender,
          monthCellRender: props.monthCellRender || slots.monthCellRender,
          prevIcon: slots.prevIcon?.() || <span class={`${pre}-prev-icon`} />,
          nextIcon: slots.nextIcon?.() || <span class={`${pre}-next-icon`} />,
          superPrevIcon: slots.superPrevIcon?.() || <span class={`${pre}-super-prev-icon`} />,
          superNextIcon: slots.superNextIcon?.() || <span class={`${pre}-super-next-icon`} />,
          components: mergedComponents,
          direction: direction.value,
          hideHeader: mergedPicker === 'time',
        };

        let innerContent: any;
        if (isRange && mergedPicker !== 'time' && !showTime) {
          const leftDate = rangeViewDate.value;
          const rightDate = getClosingViewDate(leftDate, mergedPicker, generateConfig, 1);
          const leftPanel = (
            <RangeContextProvider
              value={{
                inRange: true,
                panelPosition: 'left',
                rangedValue: mergedRangeValue.value,
                hoverRangedValue: null,
              }}
            >
              <PickerPanel
                {...(sharedPanelProps as any)}
                showToday={false}
                pickerValue={leftDate}
                value={mergedRangeValue.value?.[0] ?? null}
                onPickerValueChange={(d: DateType) => {
                  rangeViewDate.value = d;
                }}
                onSelect={handleRangeSelect}
              />
            </RangeContextProvider>
          );
          const rightPanel = (
            <RangeContextProvider
              value={{
                inRange: true,
                panelPosition: 'right',
                rangedValue: mergedRangeValue.value,
                hoverRangedValue: null,
              }}
            >
              <PickerPanel
                {...(sharedPanelProps as any)}
                showToday={false}
                pickerValue={rightDate}
                value={mergedRangeValue.value?.[1] ?? null}
                onPickerValueChange={(d: DateType) => {
                  rangeViewDate.value = getClosingViewDate(d, mergedPicker, generateConfig, -1);
                }}
                onSelect={handleRangeSelect}
              />
            </RangeContextProvider>
          );
          innerContent = (
            <div class={`${pre}-panels`}>
              {direction.value === 'rtl' ? (
                <>
                  {rightPanel}
                  {leftPanel}
                </>
              ) : (
                <>
                  {leftPanel}
                  {rightPanel}
                </>
              )}
            </div>
          );
        } else {
          innerContent = (
            <PickerPanel
              {...(sharedPanelProps as any)}
              value={isRange ? mergedRangeValue.value?.[0] ?? null : mergedSingleValue.value}
              defaultPickerValue={parseSingle(props.defaultPickerValue) || undefined}
              onChange={isRange ? handleRangeSelect : handleSingleChange}
              onPanelChange={(d: DateType, m: PanelMode) => {
                props.onPanelChange?.(maybeToString(d), m);
                emit('panelChange', maybeToString(d), m);
              }}
              onOk={(d: DateType) => {
                props.onOk?.(maybeToString(d));
                emit('ok', maybeToString(d));
              }}
            />
          );
        }

        let panelLayout: any = (
          <div class={`${pre}-panel-layout`}>
            <PresetPanel
              prefixCls={pre}
              presets={presetList.value}
              onClick={nextValue => {
                if (isRange && Array.isArray(nextValue)) {
                  setInnerRangeValue(nextValue as any);
                  const outVals = [maybeToString(nextValue[0]), maybeToString(nextValue[1])];
                  const outStrs: [string, string] = [
                    formatDate(nextValue[0]),
                    formatDate(nextValue[1]),
                  ];
                  emit('update:value', outVals);
                  emit('change', outVals, outStrs);
                  props.onChange?.(outVals, outStrs);
                } else {
                  handleSingleChange(nextValue as DateType);
                }
              }}
            />
            {innerContent}
          </div>
        );

        if (props.panelRender) {
          panelLayout = props.panelRender(panelLayout);
        }

        return wrapSSR(
          <div
            {...attrs}
            class={classNames(
              `${pre}-dropdown`,
              `${pre}-dropdown-pure`,
              {
                [`${pre}-dropdown-range`]: isRange,
                [`${pre}-dropdown-rtl`]: direction.value === 'rtl',
              },
              props.rootClassName,
              sc.root,
              sc.popup?.root,
              hashId.value,
              attrs.class,
            )}
            style={[
              {
                position: 'static',
                top: 'auto',
                left: 'auto',
                display: 'inline-block',
                maxWidth: '100%',
                ...(isRange ? { overflowX: 'auto' } : {}),
              },
              ss.root,
              ss.popup?.root,
              attrs.style as CSSProperties,
            ]}
          >
            <div
              ref={containerElRef}
              class={classNames(`${pre}-panel-container`, sc.popup?.container)}
              style={ss.popup?.container}
            >
              {panelLayout}
            </div>
          </div>,
        );
      };
    },
  });
}

export default generatePurePanel;
