import type { ComputedRef, CSSProperties } from 'vue';
import { computed } from 'vue';
import classNames from '../../_util/classNames';
import { mergeClassNames, mergeStyles, resolveSemantic } from '../../_util/hooks/useMergeSemantic';
import { useComponentConfig } from '../../config-provider/hooks/useConfigInject';

export interface DatePickerPopupSemanticClassNames {
  root?: string;
  container?: string;
  header?: string;
  body?: string;
  content?: string;
  item?: string;
  footer?: string;
}

export interface DatePickerPopupSemanticStyles {
  root?: CSSProperties;
  container?: CSSProperties;
  header?: CSSProperties;
  body?: CSSProperties;
  content?: CSSProperties;
  item?: CSSProperties;
  footer?: CSSProperties;
}

export interface DatePickerSemanticClassNames {
  root?: string;
  prefix?: string;
  input?: string;
  suffix?: string;
  popup?: string | DatePickerPopupSemanticClassNames;
}

export interface DatePickerSemanticStyles {
  root?: CSSProperties;
  prefix?: CSSProperties;
  input?: CSSProperties;
  suffix?: CSSProperties;
  popup?: CSSProperties | DatePickerPopupSemanticStyles;
}

export interface ResolvedDatePickerSemanticClassNames {
  root?: string;
  prefix?: string;
  input?: string;
  suffix?: string;
  popup: DatePickerPopupSemanticClassNames;
}

export interface ResolvedDatePickerSemanticStyles {
  root?: CSSProperties;
  prefix?: CSSProperties;
  input?: CSSProperties;
  suffix?: CSSProperties;
  popup: DatePickerPopupSemanticStyles;
}

export type DatePickerClassNamesType<P = any> =
  | DatePickerSemanticClassNames
  | ((info: { props: P }) => DatePickerSemanticClassNames);

export type DatePickerStylesType<P = any> =
  | DatePickerSemanticStyles
  | ((info: { props: P }) => DatePickerSemanticStyles);

export type DatePickerSemanticType = {
  classNames?: DatePickerSemanticClassNames;
  styles?: DatePickerSemanticStyles;
};

export interface TimePickerPopupSemanticClassNames {
  root?: string;
  container?: string;
  content?: string;
  item?: string;
  footer?: string;
}

export interface TimePickerPopupSemanticStyles {
  root?: CSSProperties;
  container?: CSSProperties;
  content?: CSSProperties;
  item?: CSSProperties;
  footer?: CSSProperties;
}

export interface TimePickerSemanticClassNames {
  root?: string;
  prefix?: string;
  input?: string;
  suffix?: string;
  popup?: string | TimePickerPopupSemanticClassNames;
}

export interface TimePickerSemanticStyles {
  root?: CSSProperties;
  prefix?: CSSProperties;
  input?: CSSProperties;
  suffix?: CSSProperties;
  popup?: CSSProperties | TimePickerPopupSemanticStyles;
}

export type TimePickerClassNamesType<P = any> =
  | TimePickerSemanticClassNames
  | ((info: { props: P }) => TimePickerSemanticClassNames);

export type TimePickerStylesType<P = any> =
  | TimePickerSemanticStyles
  | ((info: { props: P }) => TimePickerSemanticStyles);

const POPUP_SUB_KEYS = new Set([
  'root',
  'container',
  'header',
  'body',
  'content',
  'item',
  'footer',
]);

function isPlainObject(val: unknown): val is Record<string, any> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function normalizePopupClassNames(
  input: DatePickerSemanticClassNames | undefined,
): Record<string, any> | undefined {
  if (!input || typeof input !== 'object') return undefined;
  if (typeof input.popup === 'string') {
    return {
      ...input,
      popup: { root: input.popup },
    };
  }
  return input;
}

function normalizePopupStyles(
  input: DatePickerSemanticStyles | undefined,
): Record<string, any> | undefined {
  if (!input || typeof input !== 'object') return undefined;
  const { popup } = input;
  if (isPlainObject(popup)) {
    const keys = Object.keys(popup);
    const isNested =
      keys.length > 0 &&
      keys.every(k => POPUP_SUB_KEYS.has(k) && (popup[k] === undefined || isPlainObject(popup[k])));
    if (!isNested && keys.length > 0) {
      return {
        ...input,
        popup: { root: popup as CSSProperties },
      };
    }
  }
  return input;
}

export function resolvePickerSemantic<P = any>(
  classNamesList: (DatePickerClassNamesType<P> | undefined)[],
  stylesList: (DatePickerStylesType<P> | undefined)[],
  info: { props: P },
  popupClassName?: string,
  popupStyle?: CSSProperties,
): [ResolvedDatePickerSemanticClassNames, ResolvedDatePickerSemanticStyles] {
  const resolvedCN = classNamesList.map(item =>
    normalizePopupClassNames(resolveSemantic(item as any, info)),
  );
  const resolvedST = stylesList.map(item =>
    normalizePopupStyles(resolveSemantic(item as any, info)),
  );

  const mergedCN = mergeClassNames<Record<string, any>>(...resolvedCN);
  const mergedST = mergeStyles<Record<string, any>>(...resolvedST);

  const popupRootCls = classNames(mergedCN.popup?.root, popupClassName);
  const filledClassNames: ResolvedDatePickerSemanticClassNames = {
    ...mergedCN,
    popup: {
      ...(mergedCN.popup || {}),
      ...(popupRootCls ? { root: popupRootCls } : {}),
    },
  };

  const hasPopupRootStyle = !!(mergedST.popup?.root || popupStyle);
  const filledStyles: ResolvedDatePickerSemanticStyles = {
    ...mergedST,
    popup: {
      ...(mergedST.popup || {}),
      ...(hasPopupRootStyle
        ? {
            root: {
              ...(mergedST.popup?.root || {}),
              ...(popupStyle || {}),
            },
          }
        : {}),
    },
  };

  return [filledClassNames, filledStyles];
}

export function useMergedPickerSemantic<P = any>(
  pickerType: 'timePicker' | 'datePicker',
  getClassNames: () => DatePickerClassNamesType<P> | undefined,
  getStyles: () => DatePickerStylesType<P> | undefined,
  getPopupClassName: () => string | undefined,
  getPopupStyle: () => CSSProperties | undefined,
  getMergedProps: () => P,
  options?: {
    includeRangeConfig?: boolean;
  },
): {
  mergedClassNames: ComputedRef<ResolvedDatePickerSemanticClassNames>;
  mergedStyles: ComputedRef<ResolvedDatePickerSemanticStyles>;
} {
  const baseConfig = useComponentConfig(pickerType);
  const rangeConfig = options?.includeRangeConfig ? useComponentConfig('rangePicker') : null;

  const merged = computed(() => {
    const info = { props: getMergedProps() };
    const cnList: (DatePickerClassNamesType<P> | undefined)[] = [
      baseConfig.classNames.value as any,
    ];
    const stList: (DatePickerStylesType<P> | undefined)[] = [
      baseConfig.styles.value as any,
      baseConfig.style.value ? ({ root: baseConfig.style.value } as any) : undefined,
    ];
    if (rangeConfig) {
      cnList.push(rangeConfig.classNames.value as any);
      stList.push(
        rangeConfig.styles.value as any,
        rangeConfig.style.value ? ({ root: rangeConfig.style.value } as any) : undefined,
      );
    }
    cnList.push(getClassNames());
    stList.push(getStyles());

    return resolvePickerSemantic<P>(cnList, stList, info, getPopupClassName(), getPopupStyle());
  });

  return {
    mergedClassNames: computed(() => merged.value[0]),
    mergedStyles: computed(() => merged.value[1]),
  };
}

// ============================ DOM Semantic Sync ============================

interface AppliedSemanticState {
  classes: string[];
  styleKeys: string[];
}

const appliedStateMap = new WeakMap<HTMLElement, AppliedSemanticState>();

const UNITLESS_STYLE_PROPS = new Set([
  'opacity',
  'zIndex',
  'fontWeight',
  'lineHeight',
  'flex',
  'flexGrow',
  'flexShrink',
  'order',
  'zoom',
  'scale',
  'columnCount',
  'fillOpacity',
  'strokeOpacity',
  'tabSize',
  'orphans',
  'widows',
]);

function formatStyleValue(key: string, val: any): string {
  if (typeof val === 'number' && val !== 0 && !UNITLESS_STYLE_PROPS.has(key)) {
    return `${val}px`;
  }
  return String(val);
}

export function applySemanticToElement(
  el: HTMLElement | null | undefined,
  cls: string | undefined,
  styleObj: CSSProperties | undefined,
) {
  if (!el || !el.classList || !el.style) return;
  const prev = appliedStateMap.get(el) || { classes: [], styleKeys: [] };
  const nextClasses = (cls || '').split(/\s+/).filter(Boolean);
  const nextStyleKeys = styleObj ? Object.keys(styleObj) : [];

  if (
    !prev.classes.length &&
    !prev.styleKeys.length &&
    !nextClasses.length &&
    !nextStyleKeys.length
  ) {
    return;
  }

  prev.classes.forEach(c => {
    if (!nextClasses.includes(c)) {
      el.classList.remove(c);
    }
  });
  nextClasses.forEach(c => {
    el.classList.add(c);
  });

  prev.styleKeys.forEach(key => {
    if (!nextStyleKeys.includes(key)) {
      if (key.startsWith('--')) {
        el.style.removeProperty(key);
      } else {
        (el.style as any)[key] = '';
      }
    }
  });

  if (styleObj) {
    nextStyleKeys.forEach(key => {
      const val = (styleObj as any)[key];
      if (val === undefined || val === null) {
        if (key.startsWith('--')) {
          el.style.removeProperty(key);
        } else {
          (el.style as any)[key] = '';
        }
      } else if (key.startsWith('--')) {
        el.style.setProperty(key, String(val));
      } else {
        (el.style as any)[key] = formatStyleValue(key, val);
      }
    });
  }

  appliedStateMap.set(el, { classes: nextClasses, styleKeys: nextStyleKeys });
}

function applySlot(
  rootEl: HTMLElement,
  selector: string,
  cls: string | undefined,
  styleObj: CSSProperties | undefined,
) {
  if (rootEl.matches?.(selector)) {
    applySemanticToElement(rootEl, cls, styleObj);
  }
  const nodes = rootEl.querySelectorAll<HTMLElement>(selector);
  nodes.forEach(node => {
    applySemanticToElement(node, cls, styleObj);
  });
}

export function hasPopupSubSemantics(
  cn: ResolvedDatePickerSemanticClassNames,
  st: ResolvedDatePickerSemanticStyles,
): boolean {
  const pc = cn.popup || {};
  const ps = st.popup || {};
  return !!(
    pc.container ||
    pc.header ||
    pc.body ||
    pc.content ||
    pc.item ||
    pc.footer ||
    ps.container ||
    ps.header ||
    ps.body ||
    ps.content ||
    ps.item ||
    ps.footer
  );
}

export function applyPickerRootSemantics(
  rootEl: HTMLElement | null | undefined,
  prefixCls: string,
  semanticClassNames: ResolvedDatePickerSemanticClassNames,
  semanticStyles: ResolvedDatePickerSemanticStyles,
) {
  if (!rootEl || typeof rootEl.querySelectorAll !== 'function') return;
  applySlot(rootEl, `.${prefixCls}-prefix`, semanticClassNames.prefix, semanticStyles.prefix);
  applySlot(rootEl, `.${prefixCls}-input > input`, semanticClassNames.input, semanticStyles.input);
  applySlot(rootEl, `.${prefixCls}-suffix`, semanticClassNames.suffix, semanticStyles.suffix);
}

export function applyPickerPopupSemantics(
  panelEl: HTMLElement | null | undefined,
  prefixCls: string,
  semanticClassNames: ResolvedDatePickerSemanticClassNames,
  semanticStyles: ResolvedDatePickerSemanticStyles,
) {
  if (!panelEl || typeof panelEl.querySelectorAll !== 'function') return;
  const containerEl =
    (panelEl.closest?.(`.${prefixCls}-panel-container`) as HTMLElement | null) || panelEl;
  const pc = semanticClassNames.popup || {};
  const ps = semanticStyles.popup || {};

  if (containerEl.matches?.(`.${prefixCls}-panel-container`)) {
    applySemanticToElement(containerEl, pc.container, ps.container);
  } else {
    applySlot(containerEl, `.${prefixCls}-panel-container`, pc.container, ps.container);
  }
  applySlot(containerEl, `.${prefixCls}-header`, pc.header, ps.header);
  applySlot(containerEl, `.${prefixCls}-body`, pc.body, ps.body);
  applySlot(containerEl, `.${prefixCls}-content`, pc.content, ps.content);
  applySlot(
    containerEl,
    `.${prefixCls}-cell-inner, .${prefixCls}-time-panel-cell-inner`,
    pc.item,
    ps.item,
  );
  applySlot(containerEl, `.${prefixCls}-footer`, pc.footer, ps.footer);
}

export default useMergedPickerSemantic;
