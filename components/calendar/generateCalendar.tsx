import useMergedState from '../_util/hooks/useMergedState';
import { PickerPanel } from '../vc-picker';
import type { Locale } from '../vc-picker/interface';
import type { GenerateConfig } from '../vc-picker/generate';
import type {
  PickerPanelBaseProps as RCPickerPanelBaseProps,
  PickerPanelDateProps as RCPickerPanelDateProps,
  PickerPanelTimeProps as RCPickerPanelTimeProps,
} from '../vc-picker/PickerPanel';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import enUS from './locale/en_US';
import CalendarHeader from './Header';
import type { CustomSlotsType, VueNode } from '../_util/type';
import type { App, CSSProperties, PropType } from 'vue';
import { computed, defineComponent, onMounted, onUpdated, ref, toRef, watch } from 'vue';
import useConfigInject, { useComponentConfig } from '../config-provider/hooks/useConfigInject';
import useMergeSemantic, {
  type SemanticClassNames,
  type SemanticClassNamesType,
  type SemanticStyles,
  type SemanticStylesType,
} from '../_util/hooks/useMergeSemantic';
import classNames from '../_util/classNames';

// CSSINJS
import useStyle from './style';

type InjectDefaultProps<Props> = Omit<
  Props,
  'locale' | 'generateConfig' | 'prevIcon' | 'nextIcon' | 'superPrevIcon' | 'superNextIcon'
> & {
  locale?: typeof enUS;
  size?: 'large' | 'default' | 'small';
};

export interface SelectInfo {
  source: 'year' | 'month' | 'date' | 'customize';
}

// Picker Props
export type PickerPanelBaseProps<DateType> = InjectDefaultProps<RCPickerPanelBaseProps<DateType>>;
export type PickerPanelDateProps<DateType> = InjectDefaultProps<RCPickerPanelDateProps<DateType>>;
export type PickerPanelTimeProps<DateType> = InjectDefaultProps<RCPickerPanelTimeProps<DateType>>;

export type PickerProps<DateType> =
  | PickerPanelBaseProps<DateType>
  | PickerPanelDateProps<DateType>
  | PickerPanelTimeProps<DateType>;

export type CalendarMode = 'year' | 'month';
export type HeaderRender<DateType> = (config: {
  value: DateType;
  type: CalendarMode;
  onChange: (date: DateType) => void;
  onTypeChange: (type: CalendarMode) => void;
}) => VueNode;

type CustomRenderType<DateType> = (config: { current: DateType }) => VueNode;

export type CalendarSemanticName = 'root' | 'header' | 'body' | 'content' | 'item' | 'itemContent';
export type CalendarSemanticClassNames = SemanticClassNames<CalendarSemanticName>;
export type CalendarSemanticStyles = SemanticStyles<CalendarSemanticName>;
export type CalendarClassNamesType<DateType = any> = SemanticClassNamesType<
  CalendarProps<DateType>,
  CalendarSemanticName
>;
export type CalendarStylesType<DateType = any> = SemanticStylesType<
  CalendarProps<DateType>,
  CalendarSemanticName
>;

const UNITLESS_CSS_PROPS = new Set([
  'animationIterationCount',
  'aspectRatio',
  'borderImageOutset',
  'borderImageSlice',
  'borderImageWidth',
  'boxFlex',
  'boxFlexGroup',
  'boxOrdinalGroup',
  'columnCount',
  'columns',
  'flex',
  'flexGrow',
  'flexPositive',
  'flexShrink',
  'flexNegative',
  'flexOrder',
  'gridArea',
  'gridRow',
  'gridRowEnd',
  'gridRowSpan',
  'gridRowStart',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnSpan',
  'gridColumnStart',
  'fontWeight',
  'lineClamp',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'scale',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
  'fillOpacity',
  'floodOpacity',
  'stopOpacity',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
]);

export interface CalendarProps<DateType> {
  prefixCls?: string;
  rootClassName?: string;
  classNames?: CalendarClassNamesType<DateType>;
  styles?: CalendarStylesType<DateType>;
  locale?: typeof enUS;
  validRange?: [DateType, DateType];
  disabledDate?: (date: DateType) => boolean;
  dateFullCellRender?: CustomRenderType<DateType>;
  dateCellRender?: CustomRenderType<DateType>;
  monthFullCellRender?: CustomRenderType<DateType>;
  monthCellRender?: CustomRenderType<DateType>;
  cellRender?: (date: DateType, info: any) => any;
  fullCellRender?: (date: DateType, info: any) => any;
  showWeek?: boolean;
  headerRender?: HeaderRender<DateType>;
  value?: DateType | string;
  defaultValue?: DateType | string;
  mode?: CalendarMode;
  fullscreen?: boolean;
  onChange?: (date: DateType | string) => void;
  'onUpdate:value'?: (date: DateType | string) => void;
  onPanelChange?: (date: DateType | string, mode: CalendarMode) => void;
  onSelect?: (date: DateType, selectInfo: SelectInfo) => void;
  valueFormat?: string;
}

function generateCalendar<
  DateType,
  Props extends CalendarProps<DateType> = CalendarProps<DateType>,
>(generateConfig: GenerateConfig<DateType>) {
  function isSameYear(date1: DateType, date2: DateType) {
    return date1 && date2 && generateConfig.getYear(date1) === generateConfig.getYear(date2);
  }

  function isSameMonth(date1: DateType, date2: DateType) {
    return (
      isSameYear(date1, date2) && generateConfig.getMonth(date1) === generateConfig.getMonth(date2)
    );
  }

  function isSameDate(date1: DateType, date2: DateType) {
    return (
      isSameMonth(date1, date2) && generateConfig.getDate(date1) === generateConfig.getDate(date2)
    );
  }

  const Calendar = defineComponent<Props>({
    name: 'ACalendar',
    inheritAttrs: false,
    props: {
      prefixCls: String,
      rootClassName: String,
      classNames: {
        type: [Object, Function] as PropType<Props['classNames']>,
        default: undefined,
      },
      styles: {
        type: [Object, Function] as PropType<Props['styles']>,
        default: undefined,
      },
      locale: { type: Object as PropType<Props['locale']>, default: undefined as Props['locale'] },
      validRange: { type: Array as PropType<DateType[]>, default: undefined },
      disabledDate: { type: Function as PropType<Props['disabledDate']>, default: undefined },
      dateFullCellRender: {
        type: Function as PropType<Props['dateFullCellRender']>,
        default: undefined,
      },
      dateCellRender: { type: Function as PropType<Props['dateCellRender']>, default: undefined },
      monthFullCellRender: {
        type: Function as PropType<Props['monthFullCellRender']>,
        default: undefined,
      },
      monthCellRender: { type: Function as PropType<Props['monthCellRender']>, default: undefined },
      /** 5.4+ 替代 dateCellRender/monthCellRender */
      cellRender: { type: Function, default: undefined },
      /** 5.4+ 替代 dateFullCellRender/monthFullCellRender */
      fullCellRender: { type: Function, default: undefined },
      showWeek: { type: Boolean, default: undefined },
      headerRender: { type: Function as PropType<Props['headerRender']>, default: undefined },
      value: {
        type: [Object, String] as PropType<Props['value']>,
        default: undefined as Props['value'],
      },
      defaultValue: {
        type: [Object, String] as PropType<Props['defaultValue']>,
        default: undefined as Props['defaultValue'],
      },
      mode: { type: String as PropType<Props['mode']>, default: undefined },
      fullscreen: { type: Boolean as PropType<Props['fullscreen']>, default: undefined },
      onChange: { type: Function as PropType<Props['onChange']>, default: undefined },
      'onUpdate:value': { type: Function as PropType<Props['onUpdate:value']>, default: undefined },
      onPanelChange: { type: Function as PropType<Props['onPanelChange']>, default: undefined },
      onSelect: { type: Function as PropType<Props['onSelect']>, default: undefined },
      valueFormat: { type: String, default: undefined },
    } as any,
    slots: Object as CustomSlotsType<{
      dateFullCellRender?: { current: DateType };
      dateCellRender?: { current: DateType };
      monthFullCellRender?: { current: DateType };
      monthCellRender?: { current: DateType };
      cellRender?: { current: DateType; info: any };
      fullCellRender?: { current: DateType; info: any };
      headerRender?: {
        value: DateType;
        type: CalendarMode;
        onChange: (date: DateType) => void;
        onTypeChange: (type: CalendarMode) => void;
      };
      default: any;
    }>,
    setup(p, { emit, slots, attrs }) {
      const props = p as unknown as Props;
      const { prefixCls, direction } = useConfigInject('picker', props);
      const {
        className: contextClassName,
        style: contextStyle,
        classNames: contextClassNames,
        styles: contextStyles,
      } = useComponentConfig('calendar');

      // style
      const [wrapSSR, hashId] = useStyle(prefixCls);

      const calendarPrefixCls = computed(() => `${prefixCls.value}-calendar`);
      const maybeToString = (date: DateType) => {
        return props.valueFormat ? generateConfig.toString(date, props.valueFormat) : date;
      };
      const value = computed(() => {
        if (props.value) {
          return props.valueFormat
            ? (generateConfig.toDate(props.value, props.valueFormat) as DateType)
            : (props.value as DateType);
        }
        return (props.value === '' ? undefined : props.value) as DateType;
      });
      const defaultValue = computed(() => {
        if (props.defaultValue) {
          return props.valueFormat
            ? (generateConfig.toDate(props.defaultValue, props.valueFormat) as DateType)
            : (props.defaultValue as DateType);
        }
        return (props.defaultValue === '' ? undefined : props.defaultValue) as DateType;
      });

      // Value
      const [mergedValue, setMergedValue] = useMergedState(
        () => value.value || generateConfig.getNow(),
        {
          defaultValue: defaultValue.value,
          value,
        },
      );

      // Mode
      const [mergedMode, setMergedMode] = useMergedState('month', {
        value: toRef(props, 'mode'),
      });

      const panelMode = computed(() => (mergedMode.value === 'year' ? 'month' : 'date'));

      const mergedDisabledDate = computed(() => {
        return (date: DateType) => {
          const notInRange = props.validRange
            ? (generateConfig.isAfter(props.validRange[0], date) &&
                !isSameDate(date, props.validRange[0])) ||
              (generateConfig.isAfter(date, props.validRange[1]) &&
                !isSameDate(date, props.validRange[1]))
            : false;
          return notInRange || !!props.disabledDate?.(date);
        };
      });

      // ====================== Events ======================
      const triggerPanelChange = (date: DateType, newMode: CalendarMode) => {
        emit('panelChange', maybeToString(date), newMode);
      };

      const triggerChange = (date: DateType) => {
        setMergedValue(date);

        if (!isSameDate(date, mergedValue.value)) {
          // Trigger when month panel switch month
          if (
            (panelMode.value === 'date' && !isSameMonth(date, mergedValue.value)) ||
            (panelMode.value === 'month' && !isSameYear(date, mergedValue.value))
          ) {
            triggerPanelChange(date, mergedMode.value);
          }
          const val = maybeToString(date);
          emit('update:value', val);
          emit('change', val);
        }
      };

      const triggerModeChange = (newMode: CalendarMode) => {
        setMergedMode(newMode);
        triggerPanelChange(mergedValue.value, newMode);
      };

      const onInternalSelect = (date: DateType, source: SelectInfo['source']) => {
        triggerChange(date);
        emit('select', maybeToString(date), { source });
      };
      // ====================== Locale ======================
      const defaultLocale = computed(() => {
        const { locale } = props;
        const result = {
          ...enUS,
          ...locale,
        };
        result.lang = {
          ...result.lang,
          ...(locale || {}).lang,
        };
        return result;
      });

      const [mergedLocale] = useLocaleReceiver('Calendar', defaultLocale) as [typeof defaultLocale];

      // =========== Merged Props for Semantic ===========
      const mergedProps = computed<CalendarProps<DateType>>(() => ({
        ...props,
        mode: mergedMode.value,
        fullscreen: props.fullscreen ?? true,
        showWeek: props.showWeek,
      }));

      const [mergedClassNames, mergedStyles] = useMergeSemantic<
        CalendarSemanticClassNames,
        CalendarSemanticStyles,
        CalendarProps<DateType>
      >(
        () => [contextClassNames.value as CalendarClassNamesType<DateType>, props.classNames],
        () => [
          contextStyles.value as CalendarStylesType<DateType>,
          contextStyle.value ? { root: contextStyle.value } : undefined,
          props.styles,
          attrs.style ? { root: attrs.style as CSSProperties } : undefined,
        ],
        () => ({ props: mergedProps.value }),
      );

      // Sync panel semantic slots (body / content / item) onto PickerPanel DOM nodes
      const rootRef = ref<HTMLDivElement | null>(null);
      const appliedState = new WeakMap<HTMLElement, { classes: string[]; styleKeys: string[] }>();
      const touchedElements = new Set<HTMLElement>();

      const clearSemanticFromEl = (el: HTMLElement) => {
        const prev = appliedState.get(el);
        if (!prev) return;
        for (const cls of prev.classes) {
          el.classList.remove(cls);
        }
        for (const key of prev.styleKeys) {
          if (key.startsWith('--')) {
            el.style.removeProperty(key);
          } else {
            (el.style as any)[key] = '';
          }
        }
        appliedState.delete(el);
      };

      const applySemanticToEl = (el: HTMLElement, cls?: string, styleObj?: CSSProperties) => {
        clearSemanticFromEl(el);
        const nextClasses: string[] = [];
        if (cls) {
          for (const token of cls.split(/\s+/)) {
            if (token && !el.classList.contains(token)) {
              el.classList.add(token);
              nextClasses.push(token);
            }
          }
        }
        const nextStyleKeys: string[] = [];
        if (styleObj && typeof styleObj === 'object') {
          for (const [key, val] of Object.entries(styleObj)) {
            if (val === undefined || val === null) continue;
            if (key.startsWith('--')) {
              el.style.setProperty(key, String(val));
            } else {
              (el.style as any)[key] =
                typeof val === 'number' && !UNITLESS_CSS_PROPS.has(key) ? `${val}px` : String(val);
            }
            nextStyleKeys.push(key);
          }
        }
        if (nextClasses.length || nextStyleKeys.length) {
          appliedState.set(el, { classes: nextClasses, styleKeys: nextStyleKeys });
          touchedElements.add(el);
        }
      };

      const syncPanelSemantics = () => {
        const rootEl = rootRef.value;
        const nextTouched = new Set<HTMLElement>();
        if (rootEl) {
          const slotsToSync: Array<[string, string | undefined, CSSProperties | undefined]> = [
            [`.${prefixCls.value}-body`, mergedClassNames.value.body, mergedStyles.value.body],
            [
              `.${prefixCls.value}-content`,
              mergedClassNames.value.content,
              mergedStyles.value.content,
            ],
            [`.${prefixCls.value}-cell`, mergedClassNames.value.item, mergedStyles.value.item],
          ];
          for (const [selector, cls, st] of slotsToSync) {
            if (!cls && !st) continue;
            const nodes = rootEl.querySelectorAll<HTMLElement>(selector);
            nodes.forEach(node => {
              applySemanticToEl(node, cls, st);
              nextTouched.add(node);
            });
          }
        }
        touchedElements.forEach(el => {
          if (!nextTouched.has(el)) {
            clearSemanticFromEl(el);
            touchedElements.delete(el);
          }
        });
      };

      onMounted(syncPanelSemantics);
      onUpdated(syncPanelSemantics);
      watch(
        [mergedClassNames, mergedStyles, mergedMode, mergedValue, prefixCls],
        syncPanelSemantics,
        { flush: 'post' },
      );

      return () => {
        const today = generateConfig.getNow();
        const {
          dateFullCellRender = slots?.dateFullCellRender,
          dateCellRender = slots?.dateCellRender,
          monthFullCellRender = slots?.monthFullCellRender,
          monthCellRender = slots?.monthCellRender,
          showWeek,
          headerRender = slots?.headerRender,
          fullscreen = true,
          validRange,
        } = props;
        const { class: attrClass, style: _attrStyle, ...restAttrs } = attrs;
        const mergedItemContentClassName = mergedClassNames.value.itemContent;
        const mergedItemContentStyle = mergedStyles.value.itemContent;
        // ====================== Render ======================
        const dateRender = ({ current: date }) => {
          const originNode = (
            <div class={`${prefixCls.value}-cell-inner`}>
              {String(generateConfig.getDate(date)).padStart(2, '0')}
            </div>
          );
          const info = {
            prefixCls: prefixCls.value,
            originNode,
            today,
            range: undefined as 'start' | 'end' | undefined,
            type: 'date' as const,
          };
          if (props.fullCellRender) {
            return props.fullCellRender(date, info);
          }
          if (slots?.fullCellRender) {
            return slots.fullCellRender({ current: date, info });
          }
          if (dateFullCellRender) {
            return dateFullCellRender({ current: date });
          }
          return (
            <div
              class={classNames(
                `${prefixCls.value}-cell-inner`,
                `${calendarPrefixCls.value}-date`,
                {
                  [`${calendarPrefixCls.value}-date-today`]: isSameDate(today, date),
                },
              )}
            >
              <div class={`${calendarPrefixCls.value}-date-value`}>
                {String(generateConfig.getDate(date)).padStart(2, '0')}
              </div>
              <div
                class={classNames(
                  `${calendarPrefixCls.value}-date-content`,
                  mergedItemContentClassName,
                )}
                style={mergedItemContentStyle}
              >
                {props.cellRender
                  ? props.cellRender(date, info)
                  : slots?.cellRender
                  ? slots.cellRender({ current: date, info })
                  : dateCellRender && dateCellRender({ current: date })}
              </div>
            </div>
          );
        };

        const monthRender = ({ current: date }, locale: Locale) => {
          const months = locale.shortMonths || generateConfig.locale.getShortMonths!(locale.locale);
          const originNode = (
            <div class={`${prefixCls.value}-cell-inner`}>
              {months[generateConfig.getMonth(date)]}
            </div>
          );
          const info = {
            prefixCls: prefixCls.value,
            originNode,
            today,
            range: undefined as 'start' | 'end' | undefined,
            type: 'month' as const,
            locale,
          };
          if (props.fullCellRender) {
            return props.fullCellRender(date, info);
          }
          if (slots?.fullCellRender) {
            return slots.fullCellRender({ current: date, info });
          }
          if (monthFullCellRender) {
            return monthFullCellRender({ current: date });
          }

          return (
            <div
              class={classNames(
                `${prefixCls.value}-cell-inner`,
                `${calendarPrefixCls.value}-date`,
                {
                  [`${calendarPrefixCls.value}-date-today`]: isSameMonth(today, date),
                },
              )}
            >
              <div class={`${calendarPrefixCls.value}-date-value`}>
                {months[generateConfig.getMonth(date)]}
              </div>
              <div
                class={classNames(
                  `${calendarPrefixCls.value}-date-content`,
                  mergedItemContentClassName,
                )}
                style={mergedItemContentStyle}
              >
                {props.cellRender
                  ? props.cellRender(date, info)
                  : slots?.cellRender
                  ? slots.cellRender({ current: date, info })
                  : monthCellRender && monthCellRender({ current: date })}
              </div>
            </div>
          );
        };
        return wrapSSR(
          <div
            {...restAttrs}
            ref={rootRef}
            class={classNames(
              calendarPrefixCls.value,
              (props as any).rootClassName,
              contextClassName.value,
              mergedClassNames.value.root,
              {
                [`${calendarPrefixCls.value}-full`]: fullscreen,
                [`${calendarPrefixCls.value}-mini`]: !fullscreen,
                [`${calendarPrefixCls.value}-rtl`]: direction.value === 'rtl',
              },
              attrClass,
              hashId.value,
            )}
            style={mergedStyles.value.root}
          >
            {headerRender ? (
              headerRender({
                value: mergedValue.value,
                type: mergedMode.value,
                onChange: nextDate => {
                  onInternalSelect(nextDate, 'customize');
                },
                onTypeChange: triggerModeChange,
              })
            ) : (
              <CalendarHeader
                className={mergedClassNames.value.header}
                style={mergedStyles.value.header}
                prefixCls={calendarPrefixCls.value}
                value={mergedValue.value}
                generateConfig={generateConfig}
                mode={mergedMode.value}
                fullscreen={fullscreen}
                locale={mergedLocale.value.lang}
                validRange={validRange}
                onChange={onInternalSelect}
                onModeChange={triggerModeChange}
              />
            )}
            <PickerPanel
              value={mergedValue.value}
              prefixCls={prefixCls.value}
              locale={mergedLocale.value.lang}
              generateConfig={generateConfig}
              dateRender={dateRender}
              monthCellRender={obj => monthRender(obj, mergedLocale.value.lang)}
              onSelect={nextDate => {
                onInternalSelect(nextDate, panelMode.value);
              }}
              mode={panelMode.value}
              picker={panelMode.value}
              disabledDate={mergedDisabledDate.value}
              showWeek={showWeek}
              hideHeader
            />
          </div>,
        );
      };
    },
  });

  Calendar.install = function (app: App) {
    app.component(Calendar.name, Calendar);
    return app;
  };

  return Calendar;
}

export default generateCalendar;
