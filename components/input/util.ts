import type { CSSProperties } from 'vue';
import { filterEmpty } from '../_util/props-util';

const isValid = (value: any) => {
  return (
    value !== undefined &&
    value !== null &&
    (Array.isArray(value) ? filterEmpty(value).length : true)
  );
};

export function hasPrefixSuffix(propsAndSlots: any) {
  return (
    isValid(propsAndSlots.prefix) ||
    isValid(propsAndSlots.suffix) ||
    isValid(propsAndSlots.allowClear)
  );
}

export function hasAddon(propsAndSlots: any) {
  return isValid(propsAndSlots.addonBefore) || isValid(propsAndSlots.addonAfter);
}

export type SemanticValue<T, P = Record<string, any>> = T | ((info: { props: P }) => T);

export const resolveSemanticValue = <T, P = Record<string, any>>(
  val: SemanticValue<T, P> | undefined,
  info: { props: P },
): T | undefined => (typeof val === 'function' ? (val as (info: { props: P }) => T)(info) : val);

const isPlainObject = (val: unknown): val is Record<string, any> =>
  !!val && typeof val === 'object' && !Array.isArray(val);

export function mergeSemanticClassNames<T extends Record<string, any>>(
  ...list: (T | undefined)[]
): T {
  const merged: Record<string, any> = {};
  for (const item of list) {
    if (!isPlainObject(item)) continue;
    Object.keys(item).forEach(key => {
      const prev = merged[key];
      const next = item[key];
      if (next === undefined || next === null) return;
      if (isPlainObject(next)) {
        merged[key] = mergeSemanticClassNames(isPlainObject(prev) ? prev : undefined, next);
      } else if (typeof next === 'string' && next) {
        merged[key] = prev && typeof prev === 'string' ? `${prev} ${next}` : next;
      }
    });
  }
  return merged as T;
}

export function mergeSemanticStyles<T extends Record<string, any>>(...list: (T | undefined)[]): T {
  const merged: Record<string, any> = {};
  for (const item of list) {
    if (!isPlainObject(item)) continue;
    Object.keys(item).forEach(key => {
      const prev = merged[key];
      const next = item[key];
      if (next === undefined || next === null) return;
      if (isPlainObject(next)) {
        merged[key] = mergeSemanticStyles(isPlainObject(prev) ? prev : undefined, next);
      } else {
        merged[key] = next;
      }
    });
  }
  return merged as T;
}

export function applyDomStyle(
  el: HTMLElement | null | undefined,
  style: CSSProperties | undefined,
  prevKeys: string[],
): string[] {
  if (!el) return prevKeys;
  const nextKeys: string[] = [];
  if (style) {
    Object.keys(style).forEach(key => {
      const val = (style as Record<string, any>)[key];
      if (val !== undefined && val !== null) {
        nextKeys.push(key);
        if (key.startsWith('--')) {
          el.style.setProperty(key, String(val));
        } else {
          (el.style as any)[key] = typeof val === 'number' ? String(val) : val;
        }
      }
    });
  }
  prevKeys.forEach(key => {
    if (!nextKeys.includes(key)) {
      if (key.startsWith('--')) {
        el.style.removeProperty(key);
      } else {
        (el.style as any)[key] = '';
      }
    }
  });
  return nextKeys;
}
