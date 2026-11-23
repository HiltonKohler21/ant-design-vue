import type { ComputedRef, CSSProperties, Ref } from 'vue';
import { computed, unref } from 'vue';
import classNames from '../classNames';

export type SemanticClassNames<Name extends string = string> = Partial<Record<Name, string>>;
export type SemanticStyles<Name extends string = string> = Partial<Record<Name, CSSProperties>>;

export type MaybeSemanticFn<T, Props = any> = T | ((info: { props: Props }) => T) | undefined;

export type SemanticClassNamesType<
  Props = any,
  Name extends string = string,
  Extra extends Record<string, any> = Record<string, never>,
> =
  | (SemanticClassNames<Name> & Partial<Extra>)
  | ((info: { props: Props }) => SemanticClassNames<Name> & Partial<Extra>);

export type SemanticStylesType<
  Props = any,
  Name extends string = string,
  Extra extends Record<string, any> = Record<string, never>,
> =
  | (SemanticStyles<Name> & Partial<Extra>)
  | ((info: { props: Props }) => SemanticStyles<Name> & Partial<Extra>);

export type MaybeRefOrGetter<T> = T | Ref<T> | ComputedRef<T> | (() => T);

function isPlainObject(val: unknown): val is Record<string, any> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function unwrapValue<T>(source: MaybeRefOrGetter<T>): T {
  return typeof source === 'function' ? (source as () => T)() : unref(source);
}

/**
 * Resolve a static semantic object OR a functional semantic callback `(info: { props }) => ...`.
 */
export function resolveSemantic<T = any, Props = any>(
  value: MaybeSemanticFn<T, Props>,
  info: { props: Props },
): T | undefined {
  if (typeof value === 'function') {
    return (value as (info: { props: Props }) => T)(info);
  }
  return value;
}

export const resolveStyleOrClass = resolveSemantic;

/**
 * Deeply merge semantic classNames objects (supports both flat keys and nested objects like `popup: { root }`).
 */
export function mergeClassNames<T extends Record<string, any> = Record<string, any>>(
  ...list: (Partial<T> | undefined)[]
): T {
  const result: Record<string, any> = {};
  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    for (const key of Object.keys(item)) {
      const curVal = item[key];
      if (curVal === undefined || curVal === null || curVal === '') continue;
      const accVal = result[key];
      if (isPlainObject(curVal)) {
        result[key] = mergeClassNames(isPlainObject(accVal) ? accVal : undefined, curVal);
      } else {
        const merged = classNames(typeof accVal === 'string' ? accVal : undefined, curVal);
        if (merged) {
          result[key] = merged;
        }
      }
    }
  }
  return result as T;
}

function mergeStyleObjects(
  acc: Record<string, any>,
  cur: Record<string, any>,
): Record<string, any> {
  const merged: Record<string, any> = { ...acc };
  for (const key of Object.keys(cur)) {
    const curVal = cur[key];
    if (curVal === undefined) continue;
    const accVal = merged[key];
    if (isPlainObject(accVal) && isPlainObject(curVal)) {
      merged[key] = mergeStyleObjects(accVal, curVal);
    } else if (isPlainObject(curVal)) {
      merged[key] = mergeStyleObjects({}, curVal);
    } else {
      merged[key] = curVal;
    }
  }
  return merged;
}

/**
 * Deeply merge semantic styles objects (supports both flat CSSProperties and nested objects like `popup: { root: CSSProperties }`).
 */
export function mergeStyles<T extends Record<string, any> = Record<string, any>>(
  ...list: (Partial<T> | undefined)[]
): T {
  let result: Record<string, any> = {};
  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    result = mergeStyleObjects(result, item);
  }
  return result as T;
}

/**
 * Non-reactive helper to resolve and merge classNames & styles from multiple sources
 * (e.g., ConfigProvider context + component props). Safe to call inside render functions.
 */
export function mergeSemantic<
  ClassNamesType extends Record<string, any> = Record<string, any>,
  StylesType extends Record<string, any> = Record<string, any>,
  Props = any,
>(
  classNamesList: (MaybeSemanticFn<ClassNamesType, Props> | undefined)[],
  stylesList: (MaybeSemanticFn<StylesType, Props> | undefined)[],
  info: { props: Props },
): [ClassNamesType, StylesType] {
  const resolvedClassNames = classNamesList.map(item => resolveSemantic(item, info));
  const resolvedStyles = stylesList.map(item => resolveSemantic(item, info));
  return [
    mergeClassNames<ClassNamesType>(...resolvedClassNames),
    mergeStyles<StylesType>(...resolvedStyles),
  ];
}

/**
 * Reactive Vue composable to resolve & merge static or functional `(info: { props }) => ...`
 * semantic `classNames` and `styles` from multiple sources (context + component props).
 */
export function useMergeSemantic<
  ClassNamesType extends Record<string, any> = Record<string, any>,
  StylesType extends Record<string, any> = Record<string, any>,
  Props = any,
>(
  classNamesList: MaybeRefOrGetter<
    (MaybeSemanticFn<ClassNamesType, Props> | Ref<MaybeSemanticFn<ClassNamesType, Props>>)[]
  >,
  stylesList: MaybeRefOrGetter<
    (MaybeSemanticFn<StylesType, Props> | Ref<MaybeSemanticFn<StylesType, Props>>)[]
  >,
  info: MaybeRefOrGetter<{ props: Props }>,
): [ComputedRef<ClassNamesType>, ComputedRef<StylesType>] {
  const mergedClassNames = computed<ClassNamesType>(() => {
    const resolvedInfo = unwrapValue(info);
    const list = unwrapValue(classNamesList);
    const resolved = list.map(item => resolveSemantic(unref(item), resolvedInfo));
    return mergeClassNames<ClassNamesType>(...resolved);
  });

  const mergedStyles = computed<StylesType>(() => {
    const resolvedInfo = unwrapValue(info);
    const list = unwrapValue(stylesList);
    const resolved = list.map(item => resolveSemantic(unref(item), resolvedInfo));
    return mergeStyles<StylesType>(...resolved);
  });

  return [mergedClassNames, mergedStyles];
}

export default useMergeSemantic;
