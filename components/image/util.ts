import { isVNode } from 'vue';
import classNames from '../_util/classNames';

export const isPlainObj = (val: unknown): val is Record<string, any> =>
  typeof val === 'object' && val !== null && !Array.isArray(val);

export const resolveSemantic = <T, P>(
  semantic: T | ((info: { props: P }) => T) | undefined,
  props: P,
): T | undefined => {
  if (typeof semantic === 'function') {
    return (semantic as (info: { props: P }) => T)({ props });
  }
  return semantic;
};

export const normalizePreviewMask = (
  propMask: any,
  ctxMask: any,
  previewPrefixCls: string,
): {
  maskEnabled: boolean;
  maskClosable: boolean;
  maskClassName: string;
  legacyCover?: any;
} => {
  let legacyCover: any;
  let normalizedProp = propMask;
  if (isVNode(propMask) || typeof propMask === 'string') {
    legacyCover = propMask;
    normalizedProp = undefined;
  }

  const propObj = isPlainObj(normalizedProp) ? normalizedProp : undefined;
  const ctxObj = isPlainObj(ctxMask) ? ctxMask : undefined;

  let maskEnabled = true;
  if (typeof normalizedProp === 'boolean') {
    maskEnabled = normalizedProp;
  } else if (propObj && typeof propObj.enabled === 'boolean') {
    maskEnabled = propObj.enabled;
  } else if (typeof ctxMask === 'boolean') {
    maskEnabled = ctxMask;
  } else if (ctxObj && typeof ctxObj.enabled === 'boolean') {
    maskEnabled = ctxObj.enabled;
  }

  let maskBlur = false;
  if (propObj && typeof propObj.blur === 'boolean') {
    maskBlur = propObj.blur;
  } else if (ctxObj && typeof ctxObj.blur === 'boolean') {
    maskBlur = ctxObj.blur;
  }

  let maskClosable = true;
  if (propObj && typeof propObj.closable === 'boolean') {
    maskClosable = propObj.closable;
  } else if (ctxObj && typeof ctxObj.closable === 'boolean') {
    maskClosable = ctxObj.closable;
  }

  const maskClassName = classNames({
    [`${previewPrefixCls}-mask-blur`]: maskBlur,
    [`${previewPrefixCls}-mask-hidden`]: !maskEnabled,
  });

  return { maskEnabled, maskClosable, maskClassName, legacyCover };
};
