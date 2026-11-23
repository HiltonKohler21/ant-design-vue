import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import type { CSSProperties, PropType } from 'vue';
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue';
import PickerPanel from '../../vc-picker/PickerPanel';
import PickerTrigger from '../../vc-picker/PickerTrigger';
import PresetPanel from '../../vc-picker/PresetPanel';
import usePresets from '../../vc-picker/hooks/usePresets';
import { useProvidePanel } from '../../vc-picker/PanelContext';
import type { ContextOperationRefProps } from '../../vc-picker/PanelContext';
import type {
  Components,
  CustomFormat,
  Locale,
  PanelMode,
  PickerMode,
  PresetDate,
} from '../../vc-picker/interface';
import type { GenerateConfig } from '../../vc-picker/generate';
import {
  formatValue,
  isEqual,
  isSameDate,
  isSameMonth,
  isSameQuarter,
  isSameTime,
  isSameWeek,
  isSameYear,
} from '../../vc-picker/utils/dateUtil';
import { getDefaultFormat, getInputSize } from '../../vc-picker/utils/uiUtil';
import { getLowerBoundTime, setTime } from '../../vc-picker/utils/timeUtil';
import { toArray } from '../../vc-picker/utils/miscUtil';
import getExtraFooter from '../../vc-picker/utils/getExtraFooter';
import Overflow from '../../vc-overflow';
import useMergedState from '../../_util/hooks/useMergedState';
import classNames from '../../_util/classNames';
import KeyCode from '../../_util/KeyCode';
import type { VueNode } from '../../_util/type';
import type { AlignType } from '../../vc-align/interface';

function isSamePickerUnit<DateType>(
  picker: PickerMode,
  generateConfig: GenerateConfig<DateType>,
  localeStr: string,
  a: DateType | null | undefined,
  b: DateType | null | undefined,
): boolean {
  if (!a || !b) return false;
  switch (picker) {
    case 'year':
      return isSameYear(generateConfig, a, b);
    case 'quarter':
      return isSameQuarter(generateConfig, a, b);
    case 'month':
      return isSameMonth(generateConfig, a, b);
    case 'week':
      return isSameWeek(generateConfig, localeStr, a, b);
    case 'time':
      return isSameTime(generateConfig, a, b);
    default:
      return isSameDate(generateConfig, a, b);
  }
}

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'EnhancedPicker',
  inheritAttrs: false,
  props: {
    prefixCls: { type: String, default: 'ant-picker' },
    id: String,
    tabindex: Number,
    dropdownClassName: String,
    dropdownAlign: Object as PropType<AlignType>,
    popupStyle: Object as PropType<CSSProperties>,
    transitionName: String,
    generateConfig: { type: Object as PropType<GenerateConfig<any>>, required: true },
    locale: { type: Object as PropType<Locale>, required: true },
    inputReadOnly: { type: Boolean, default: undefined },
    allowClear: { type: Boolean, default: true },
    autofocus: { type: Boolean, default: undefined },
    showTime: [Boolean, Object] as PropType<boolean | Record<string, any>>,
    showNow: { type: Boolean, default: undefined },
    showToday: { type: Boolean, default: true },
    showHour: { type: Boolean, default: undefined },
    showMinute: { type: Boolean, default: undefined },
    showSecond: { type: Boolean, default: undefined },
    use12Hours: { type: Boolean, default: undefined },
    hourStep: Number,
    minuteStep: Number,
    secondStep: Number,
    hideDisabledOptions: { type: Boolean, default: undefined },
    picker: { type: String as PropType<PickerMode>, default: 'date' },
    mode: String as PropType<PanelMode>,
    format: [String, Function, Array] as PropType<
      string | CustomFormat<any> | (string | CustomFormat<any>)[]
    >,
    value: { type: [Object, Array] as PropType<any>, default: undefined },
    defaultValue: { type: [Object, Array] as PropType<any>, default: undefined },
    defaultPickerValue: { type: Object as PropType<any>, default: undefined },
    defaultOpenValue: { type: Object as PropType<any>, default: undefined },
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: undefined },
    disabledDate: Function as PropType<(date: any) => boolean>,
    disabledTime: Function as PropType<any>,
    placeholder: String,
    getPopupContainer: Function as PropType<(node: HTMLElement) => HTMLElement>,
    panelRender: Function as PropType<(originPanel: VueNode) => VueNode>,
    renderExtraFooter: Function as PropType<(mode: PanelMode) => VueNode>,
    dateRender: Function as PropType<any>,
    monthCellRender: Function as PropType<any>,
    presets: Array as PropType<PresetDate<any>[]>,
    suffixIcon: null as unknown as PropType<VueNode>,
    clearIcon: null as unknown as PropType<VueNode>,
    removeIcon: null as unknown as PropType<VueNode>,
    prevIcon: null as unknown as PropType<VueNode>,
    nextIcon: null as unknown as PropType<VueNode>,
    superPrevIcon: null as unknown as PropType<VueNode>,
    superNextIcon: null as unknown as PropType<VueNode>,
    components: Object as PropType<Components>,
    direction: String as PropType<'ltr' | 'rtl'>,
    autocomplete: { type: String, default: 'off' },
    multiple: { type: Boolean, default: false },
    maxTagCount: [Number, String] as PropType<number | 'responsive'>,
    maxTagPlaceholder: [Function, String, Object] as PropType<
      VueNode | ((omittedValues: any[]) => VueNode)
    >,
    needConfirm: { type: Boolean, default: undefined },
    onChange: Function as PropType<(value: any, dateString: any) => void>,
    onOpenChange: Function as PropType<(open: boolean) => void>,
    onPanelChange: Function as PropType<(date: any, mode: PanelMode) => void>,
    onFocus: Function as PropType<(e: FocusEvent) => void>,
    onBlur: Function as PropType<(e: FocusEvent) => void>,
    onOk: Function as PropType<(value: any) => void>,
    onKeydown: Function as PropType<(e: KeyboardEvent, preventDefault: () => void) => void>,
    onMousedown: Function as PropType<(e: MouseEvent) => void>,
    onMouseup: Function as PropType<(e: MouseEvent) => void>,
    onMouseenter: Function as PropType<(e: MouseEvent) => void>,
    onMouseleave: Function as PropType<(e: MouseEvent) => void>,
    onClick: Function as PropType<(e: MouseEvent) => void>,
    onContextmenu: Function as PropType<(e: MouseEvent) => void>,
  },
  setup(props, { attrs, expose }) {
    const containerRef = ref<HTMLDivElement | null>(null);
    const panelDivRef = ref<HTMLDivElement | null>(null);
    const inputRef = ref<HTMLInputElement | null>(null);
    const focused = ref(false);
    const operationRef = ref<ContextOperationRefProps | null>(null);

    const picker = computed<PickerMode>(() => props.picker ?? 'date');
    const isMultiple = computed(() => !!props.multiple);

    const effectiveNeedConfirm = computed(() => {
      if (props.needConfirm !== undefined) {
        return props.needConfirm;
      }
      if (isMultiple.value) {
        return false;
      }
      return (picker.value === 'date' && !!props.showTime) || picker.value === 'time';
    });

    const formatList = computed(() =>
      toArray(
        getDefaultFormat(
          props.format,
          picker.value,
          props.showTime as boolean | object | undefined,
          props.use12Hours,
        ),
      ),
    );

    const formatDate = (date: any): string => {
      if (!date) return '';
      return formatValue(date, {
        generateConfig: props.generateConfig,
        locale: props.locale,
        format: formatList.value[0],
      });
    };

    // ========================== Value State ==========================
    const normalizeMultiple = (val: any): any[] => {
      if (!val) return [];
      return Array.isArray(val) ? val.filter(Boolean) : [val];
    };

    const [mergedSingleValue, setInnerSingleValue] = useMergedState<any>(null, {
      value: computed(() => (isMultiple.value ? undefined : props.value)),
      defaultValue: isMultiple.value ? null : props.defaultValue ?? null,
    });

    const [mergedMultipleValues, setInnerMultipleValues] = useMergedState<any[]>([], {
      value: computed(() =>
        isMultiple.value && props.value !== undefined ? normalizeMultiple(props.value) : undefined,
      ),
      defaultValue: isMultiple.value ? normalizeMultiple(props.defaultValue) : [],
    });

    // Draft / pending values while popup is open in needConfirm mode
    const draftSingleValue = ref<any>(mergedSingleValue.value);
    const draftMultipleValues = ref<any[]>([...mergedMultipleValues.value]);

    watch(mergedSingleValue, val => {
      draftSingleValue.value = val;
    });
    watch(mergedMultipleValues, vals => {
      draftMultipleValues.value = [...vals];
    });

    const activeSingleValue = computed(() =>
      effectiveNeedConfirm.value ? draftSingleValue.value : mergedSingleValue.value,
    );
    const activeMultipleValues = computed(() =>
      effectiveNeedConfirm.value ? draftMultipleValues.value : mergedMultipleValues.value,
    );

    // ========================== Open State ===========================
    const [mergedOpen, triggerInnerOpen] = useMergedState(false, {
      value: toRef(props, 'open'),
      defaultValue: props.defaultOpen,
      postState: postOpen => (props.disabled ? false : postOpen),
      onChange: newOpen => {
        props.onOpenChange?.(newOpen);
        if (!newOpen) {
          operationRef.value?.onClose?.();
        }
      },
    });

    const triggerOpen = (nextOpen: boolean) => {
      if (props.disabled && nextOpen) return;
      triggerInnerOpen(nextOpen);
    };

    // Reset uncommitted draft when popup closes
    watch(mergedOpen, isOpen => {
      if (!isOpen) {
        draftSingleValue.value = mergedSingleValue.value;
        draftMultipleValues.value = [...mergedMultipleValues.value];
      }
    });

    // =========================== Panel Mode ==========================
    const panelMode = ref<PanelMode>(props.mode || picker.value);
    watch(
      () => props.mode,
      val => {
        if (val) panelMode.value = val;
      },
    );
    watch(picker, val => {
      if (!props.mode) panelMode.value = val;
    });

    // ========================== Trigger Change =======================
    const commitSingle = (nextDate: any | null) => {
      const prev = mergedSingleValue.value;
      draftSingleValue.value = nextDate;
      setInnerSingleValue(nextDate);
      if (props.onChange && !isEqual(props.generateConfig, prev, nextDate)) {
        props.onChange(nextDate, nextDate ? formatDate(nextDate) : '');
      }
    };

    const commitMultiple = (nextDates: any[]) => {
      draftMultipleValues.value = nextDates;
      setInnerMultipleValues(nextDates);
      props.onChange?.(
        nextDates,
        nextDates.map(d => formatDate(d)),
      );
    };

    const toggleDateInList = (list: any[], date: any): any[] => {
      const idx = list.findIndex(item =>
        isSamePickerUnit(picker.value, props.generateConfig, props.locale.locale, item, date),
      );
      if (idx >= 0) {
        return [...list.slice(0, idx), ...list.slice(idx + 1)];
      }
      return [...list, date];
    };

    const removeMultipleAt = (index: number) => {
      const base = mergedMultipleValues.value;
      const next = [...base.slice(0, index), ...base.slice(index + 1)];
      commitMultiple(next);
    };

    const handleOk = () => {
      if (isMultiple.value) {
        const next = [...draftMultipleValues.value];
        commitMultiple(next);
        props.onOk?.(next);
        triggerOpen(false);
        return;
      }
      const next = draftSingleValue.value;
      if (next && !props.disabledDate?.(next)) {
        commitSingle(next);
        props.onOk?.(next);
        triggerOpen(false);
      }
    };

    const handleCancel = () => {
      draftSingleValue.value = mergedSingleValue.value;
      draftMultipleValues.value = [...mergedMultipleValues.value];
      triggerOpen(false);
    };

    const onContextSelect = (date: any, type: 'key' | 'mouse' | 'submit') => {
      if (isMultiple.value) {
        if (type === 'key') {
          return;
        }
        if (effectiveNeedConfirm.value) {
          draftMultipleValues.value = toggleDateInList(draftMultipleValues.value, date);
        } else {
          const next = toggleDateInList(mergedMultipleValues.value, date);
          commitMultiple(next);
        }
        return;
      }

      // Single mode
      draftSingleValue.value = date;
      if (type === 'submit') {
        commitSingle(date);
        triggerOpen(false);
      } else if (type !== 'key' && !effectiveNeedConfirm.value) {
        commitSingle(date);
        // For time picker / showTime with needConfirm=false, keep panel open so user can adjust columns;
        // for regular date/month/year pickers, close immediately.
        if (picker.value !== 'time' && !props.showTime) {
          triggerOpen(false);
        }
      }
    };

    useProvidePanel({
      operationRef,
      hideHeader: computed(() => picker.value === 'time'),
      hideRanges: computed(() => true),
      onSelect: onContextSelect,
      open: mergedOpen,
      defaultOpenValue: toRef(props, 'defaultOpenValue'),
    });

    // ========================== Now / Today ==========================
    const handleNow = () => {
      const { generateConfig, hourStep = 1, minuteStep = 1, secondStep = 1 } = props;
      const now = generateConfig.getNow();
      const lowerBound = getLowerBoundTime(
        generateConfig.getHour(now),
        generateConfig.getMinute(now),
        generateConfig.getSecond(now),
        24 % hourStep === 0 ? hourStep : 1,
        60 % minuteStep === 0 ? minuteStep : 1,
        60 % secondStep === 0 ? secondStep : 1,
      );
      const adjustedNow = setTime(generateConfig, now, lowerBound[0], lowerBound[1], lowerBound[2]);
      if (effectiveNeedConfirm.value) {
        draftSingleValue.value = adjustedNow;
      } else {
        commitSingle(adjustedNow);
        triggerOpen(false);
      }
    };

    // ========================= Click Outside =========================
    const onGlobalMouseDown = (e: MouseEvent) => {
      if (!mergedOpen.value) return;
      const target = e.target as Node | null;
      if (target && (containerRef.value?.contains(target) || panelDivRef.value?.contains(target))) {
        return;
      }
      handleCancel();
    };

    onMounted(() => {
      if (typeof document !== 'undefined') {
        document.addEventListener('mousedown', onGlobalMouseDown);
      }
    });

    onBeforeUnmount(() => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('mousedown', onGlobalMouseDown);
      }
    });

    // =========================== Keyboard ============================
    const onInputKeydown = (e: KeyboardEvent) => {
      let prevented = false;
      props.onKeydown?.(e, () => {
        prevented = true;
      });
      if (prevented) return;

      if (e.which === KeyCode.ESC || e.key === 'Escape') {
        if (mergedOpen.value) {
          e.preventDefault();
          handleCancel();
        }
        return;
      }

      if (e.which === KeyCode.ENTER || e.key === 'Enter') {
        if (!mergedOpen.value) {
          triggerOpen(true);
        } else if (effectiveNeedConfirm.value) {
          e.preventDefault();
          handleOk();
        }
      }
    };

    // ============================ Presets ============================
    const presetList = usePresets(computed(() => props.presets));

    expose({
      focus: () => {
        inputRef.value?.focus();
      },
      blur: () => {
        inputRef.value?.blur();
      },
    });

    return () => {
      const {
        prefixCls,
        id,
        tabindex,
        dropdownClassName,
        dropdownAlign,
        popupStyle,
        transitionName,
        generateConfig,
        locale,
        inputReadOnly,
        allowClear,
        autofocus,
        disabled,
        disabledDate,
        placeholder,
        getPopupContainer,
        panelRender,
        renderExtraFooter,
        dateRender,
        monthCellRender,
        suffixIcon,
        clearIcon,
        removeIcon,
        prevIcon,
        nextIcon,
        superPrevIcon,
        superNextIcon,
        components,
        direction,
        autocomplete,
        showTime,
        showNow,
        showToday,
        maxTagCount,
        maxTagPlaceholder,
        onMousedown,
        onMouseup,
        onMouseenter,
        onMouseleave,
        onClick,
        onContextmenu,
      } = props;

      const pre = prefixCls;

      // ================== Multiple cell highlight ==================
      const wrappedDateRender = isMultiple.value
        ? ({ current, today }: { current: any; today: any }) => {
            if (dateRender) {
              return dateRender({ current, today });
            }
            const isSelected = activeMultipleValues.value.some(d =>
              isSameDate(generateConfig, d, current),
            );
            return (
              <div
                class={classNames(`${pre}-cell-inner`, {
                  [`${pre}-cell-inner-multiple-selected`]: isSelected,
                })}
              >
                {generateConfig.getDate(current)}
              </div>
            );
          }
        : dateRender;

      const wrappedMonthCellRender = isMultiple.value
        ? ({ current, locale: cellLocale }: { current: any; locale: Locale }) => {
            if (monthCellRender) {
              return monthCellRender({ current, locale: cellLocale });
            }
            const isSelected = activeMultipleValues.value.some(d =>
              isSameMonth(generateConfig, d, current),
            );
            const monthsLocale: string[] =
              cellLocale.shortMonths ||
              (generateConfig.locale.getShortMonths
                ? generateConfig.locale.getShortMonths(cellLocale.locale)
                : []);
            const label = cellLocale.monthFormat
              ? formatValue(current, {
                  locale: cellLocale,
                  format: cellLocale.monthFormat,
                  generateConfig,
                })
              : monthsLocale[generateConfig.getMonth(current)];
            return (
              <div
                class={classNames(`${pre}-cell-inner`, {
                  [`${pre}-cell-inner-multiple-selected`]: isSelected,
                })}
              >
                {label}
              </div>
            );
          }
        : monthCellRender;

      // ======================= Footer ==============================
      const extraFooter = getExtraFooter(pre, panelMode.value, renderExtraFooter);
      const ButtonComp = ((components as Components | undefined)?.button || 'button') as any;

      const showNowBtn =
        !isMultiple.value && (picker.value === 'time' || !!showTime) && showNow !== false;

      const okDisabled = isMultiple.value
        ? false
        : !draftSingleValue.value || !!disabledDate?.(draftSingleValue.value);

      let rangesNode: VueNode = null;
      if (effectiveNeedConfirm.value || showNowBtn) {
        rangesNode = (
          <ul class={`${pre}-ranges`}>
            {showNowBtn && (
              <li class={`${pre}-now`}>
                <a class={`${pre}-now-btn`} onClick={handleNow}>
                  {locale.now}
                </a>
              </li>
            )}
            {effectiveNeedConfirm.value && (
              <li class={`${pre}-ok`}>
                <ButtonComp
                  disabled={okDisabled}
                  onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    handleOk();
                  }}
                >
                  {locale.ok}
                </ButtonComp>
              </li>
            )}
          </ul>
        );
      }

      let todayNode: VueNode = null;
      if (
        !isMultiple.value &&
        !effectiveNeedConfirm.value &&
        showToday !== false &&
        panelMode.value === 'date' &&
        picker.value === 'date' &&
        !showTime
      ) {
        const now = generateConfig.getNow();
        const todayCls = `${pre}-today-btn`;
        const todayDisabled = !!disabledDate?.(now);
        todayNode = (
          <a
            class={classNames(todayCls, todayDisabled && `${todayCls}-disabled`)}
            aria-disabled={todayDisabled}
            onClick={() => {
              if (!todayDisabled) {
                commitSingle(now);
                triggerOpen(false);
              }
            }}
          >
            {locale.today}
          </a>
        );
      }

      const panelValue = isMultiple.value
        ? activeMultipleValues.value[activeMultipleValues.value.length - 1] ?? null
        : activeSingleValue.value;

      const panelProps: Record<string, any> = {
        prefixCls: pre,
        generateConfig,
        locale,
        picker: picker.value,
        mode: props.mode,
        value: panelValue,
        defaultPickerValue: props.defaultPickerValue,
        disabledDate,
        disabledTime: props.disabledTime,
        showTime,
        showNow: false,
        showToday: false,
        showHour: props.showHour,
        showMinute: props.showMinute,
        showSecond: props.showSecond,
        use12Hours: props.use12Hours,
        hourStep: props.hourStep,
        minuteStep: props.minuteStep,
        secondStep: props.secondStep,
        hideDisabledOptions: props.hideDisabledOptions,
        dateRender: wrappedDateRender,
        monthCellRender: wrappedMonthCellRender,
        prevIcon,
        nextIcon,
        superPrevIcon,
        superNextIcon,
        components,
        direction,
        tabindex: -1,
        onPanelChange: (viewDate: any, nextMode: PanelMode) => {
          panelMode.value = nextMode;
          props.onPanelChange?.(viewDate, nextMode);
        },
      };

      const footerNode =
        extraFooter || rangesNode || todayNode ? (
          <div class={`${pre}-footer`}>
            {extraFooter}
            {rangesNode}
            {todayNode}
          </div>
        ) : null;

      let panelNode: VueNode = (
        <div class={`${pre}-panel-layout`}>
          <PresetPanel
            prefixCls={pre}
            presets={presetList.value}
            onClick={nextValue => {
              if (isMultiple.value) {
                const next = Array.isArray(nextValue) ? nextValue : [nextValue];
                commitMultiple(next);
              } else {
                commitSingle(nextValue);
              }
              triggerOpen(false);
            }}
          />
          <div class={`${pre}-panel-wrapper`}>
            <PickerPanel {...(panelProps as any)} />
            {footerNode}
          </div>
        </div>
      );

      if (panelRender) {
        panelNode = panelRender(panelNode);
      }

      const panel = (
        <div
          class={`${pre}-panel-container`}
          ref={panelDivRef}
          onMousedown={e => {
            e.preventDefault();
          }}
        >
          {panelNode}
        </div>
      );

      // ======================= Selector / Input ====================
      const suffixNode = suffixIcon ? <span class={`${pre}-suffix`}>{suffixIcon}</span> : null;

      const hasValue = isMultiple.value
        ? mergedMultipleValues.value.length > 0
        : !!mergedSingleValue.value;

      const clearNode =
        allowClear && hasValue && !disabled ? (
          <span
            onMousedown={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseup={e => {
              e.preventDefault();
              e.stopPropagation();
              if (isMultiple.value) {
                commitMultiple([]);
              } else {
                commitSingle(null);
              }
              triggerOpen(false);
            }}
            onClick={e => {
              e.stopPropagation();
            }}
            class={`${pre}-clear`}
            role="button"
          >
            {clearIcon || <span class={`${pre}-clear-btn`} />}
          </span>
        ) : null;

      const displayItems = isMultiple.value
        ? mergedMultipleValues.value.map((date, idx) => ({
            key: `${formatDate(date)}-${idx}`,
            label: formatDate(date),
            value: date,
            index: idx,
          }))
        : [];

      const renderMultipleTag = (item: { key: string; label: string; index: number }) => (
        <span class={`${pre}-selection-item`} title={item.label}>
          <span class={`${pre}-selection-item-content`}>{item.label}</span>
          {!disabled && (
            <span
              class={`${pre}-selection-item-remove`}
              aria-label="close"
              onMousedown={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={e => {
                e.stopPropagation();
                removeMultipleAt(item.index);
              }}
            >
              {removeIcon || <CloseOutlined />}
            </span>
          )}
        </span>
      );

      const renderMultipleRest = (omittedItems: any[]) => {
        const content =
          typeof maxTagPlaceholder === 'function'
            ? maxTagPlaceholder(omittedItems.map(i => i.value))
            : maxTagPlaceholder ?? `+ ${omittedItems.length} ...`;
        return (
          <span class={`${pre}-selection-item`}>
            <span class={`${pre}-selection-item-content`}>{content}</span>
          </span>
        );
      };

      const singleDisplayText = activeSingleValue.value ? formatDate(activeSingleValue.value) : '';

      const selectorContent = isMultiple.value ? (
        <div class={`${pre}-selector`}>
          <Overflow
            prefixCls={`${pre}-selection-overflow`}
            data={displayItems}
            itemKey="key"
            maxCount={maxTagCount}
            ssr="full"
            renderItem={renderMultipleTag}
            renderRest={renderMultipleRest}
          />
          {!displayItems.length && (
            <span class={`${pre}-selection-placeholder`}>{placeholder}</span>
          )}
          <input
            id={id}
            ref={inputRef}
            class={`${pre}-multiple-input`}
            readonly
            disabled={disabled}
            autofocus={autofocus}
            tabindex={tabindex}
            aria-label={placeholder}
            onFocus={e => {
              focused.value = true;
              props.onFocus?.(e);
            }}
            onBlur={e => {
              focused.value = false;
              props.onBlur?.(e);
            }}
            onKeydown={onInputKeydown}
          />
        </div>
      ) : (
        <div class={`${pre}-input`}>
          <input
            id={id}
            ref={inputRef}
            tabindex={tabindex}
            disabled={disabled}
            readonly={inputReadOnly || true}
            value={singleDisplayText}
            title={singleDisplayText}
            autofocus={autofocus}
            placeholder={placeholder}
            autocomplete={autocomplete}
            size={getInputSize(picker.value, formatList.value[0], generateConfig)}
            onFocus={e => {
              focused.value = true;
              props.onFocus?.(e);
            }}
            onBlur={e => {
              focused.value = false;
              props.onBlur?.(e);
            }}
            onKeydown={onInputKeydown}
          />
        </div>
      );

      const popupPlacement = direction === 'rtl' ? 'bottomRight' : 'bottomLeft';

      return (
        <div
          ref={containerRef}
          class={classNames(pre, attrs.class, {
            [`${pre}-multiple`]: isMultiple.value,
            [`${pre}-disabled`]: disabled,
            [`${pre}-focused`]: focused.value || mergedOpen.value,
            [`${pre}-rtl`]: direction === 'rtl',
          })}
          style={attrs.style as CSSProperties}
          onMousedown={onMousedown}
          onMouseup={e => {
            onMouseup?.(e);
            if (!disabled) {
              inputRef.value?.focus();
              triggerOpen(true);
            }
          }}
          onMouseenter={onMouseenter}
          onMouseleave={onMouseleave}
          onContextmenu={onContextmenu}
          onClick={e => {
            onClick?.(e);
            if (!disabled && !mergedOpen.value) {
              inputRef.value?.focus();
              triggerOpen(true);
            }
          }}
        >
          {selectorContent}
          {suffixNode}
          {clearNode}
          <PickerTrigger
            visible={mergedOpen.value}
            popupStyle={popupStyle}
            prefixCls={pre}
            dropdownClassName={dropdownClassName}
            dropdownAlign={dropdownAlign}
            getPopupContainer={getPopupContainer}
            transitionName={transitionName}
            popupPlacement={popupPlacement}
            direction={direction}
            v-slots={{
              popupElement: () => panel,
            }}
          >
            <div
              style={{
                pointerEvents: 'none',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }}
            />
          </PickerTrigger>
        </div>
      );
    };
  },
});
