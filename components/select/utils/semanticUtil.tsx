import type { CSSProperties } from 'vue';
import { cloneVNode } from 'vue';
import { filterEmpty, isValidElement } from '../../_util/props-util';

export interface SelectSemanticClassNames {
  root?: string;
  prefix?: string;
  suffix?: string;
  popup?: {
    root?: string;
  };
}

export interface SelectSemanticStyles {
  root?: CSSProperties;
  prefix?: CSSProperties;
  suffix?: CSSProperties;
  popup?: {
    root?: CSSProperties;
  };
}

export type SemanticValue<T, P = Record<string, any>> = T | ((info: { props: P }) => T);

export type SelectClassNamesType<P = Record<string, any>> = SemanticValue<
  SelectSemanticClassNames,
  P
>;

export type SelectStylesType<P = Record<string, any>> = SemanticValue<SelectSemanticStyles, P>;

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

export function normalizePrefixNode(node: any): any {
  if (Array.isArray(node)) {
    const validNodes = filterEmpty(node);
    if (validNodes.length === 0) return undefined;
    if (validNodes.length === 1) return validNodes[0];
    return <>{validNodes}</>;
  }
  return node;
}

export function applySemanticToNode(node: any, cls?: string, style?: CSSProperties): any {
  if (node === undefined || node === null || node === false) {
    return node;
  }
  const hasCls = !!cls;
  const hasStyle = !!style && Object.keys(style).length > 0;
  if (!hasCls && !hasStyle) {
    return node;
  }
  const extraProps: Record<string, any> = {};
  if (hasCls) extraProps.class = cls;
  if (hasStyle) extraProps.style = style;

  if (Array.isArray(node)) {
    const validNodes = filterEmpty(node);
    if (validNodes.length === 0) {
      return node;
    }
    if (validNodes.length === 1 && isValidElement(validNodes[0])) {
      return cloneVNode(validNodes[0], extraProps);
    }
    return (
      <span class={cls} style={style}>
        {validNodes}
      </span>
    );
  }
  if (isValidElement(node)) {
    return cloneVNode(node, extraProps);
  }
  return (
    <span class={cls} style={style}>
      {node}
    </span>
  );
}
