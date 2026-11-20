import hash from '@emotion/hash';
import type { ComputedRef } from 'vue';
import { computed, watchEffect } from 'vue';
import { token2CSSVar } from '../util/css-variables';

export const CSS_VAR_PREFIX = 'cssVar';

const uniqueHash = (path: (string | number)[], styleStr: string) =>
  hash(`${path.join('%')}${styleStr}`);

export interface CSSVarRegisterConfig {
  /** 缓存路径，通常为 [组件名] */
  path: string[];
  /** CSS 变量前缀，默认 ant */
  prefix?: string;
  /** 变量声明的选择器（一般用组件根类名，如 `.ant-btn`；全局用 `:root`） */
  scope?: string;
  unitless?: Record<string, boolean>;
  ignore?: Record<string, boolean>;
  preserve?: Record<string, boolean>;
  /** token 的稳定标识 */
  tokenKey?: string;
  /** 关闭运行时注入（zeroRuntime 模式） */
  zeroRuntime?: boolean;
}

/**
 * 注册 CSS 变量声明，并返回「值已替换为 var(--x)」的 token。
 *
 * 实现说明：不使用 `useGlobalCache`（其对 keyPath 变化的重算时机不稳定，
 * 首次求值时 cssVar 配置可能尚未就绪，导致拿到空字符串的旧缓存），
 * 改为 computed 计算 + watchEffect 直接注入 `<style>`，行为可预测。
 */
export default function useCSSVarRegister(
  config: ComputedRef<CSSVarRegisterConfig>,
  fn: () => Record<string, any>,
): ComputedRef<Record<string, any>> {
  const built = computed(() => {
    const c = config.value;
    const originToken = fn();

    const cssVars: Record<string, string> = {};
    const mergedToken: Record<string, any> = {};

    Object.entries(originToken).forEach(([key, value]) => {
      // 内部字段（_tokenKey / _hashId 等）不参与变量化，其值可能是 JSON 片段会产生非法 CSS
      if (key.startsWith('_')) {
        mergedToken[key] = value;
      } else if (c.preserve?.[key]) {
        mergedToken[key] = value;
      } else if ((typeof value === 'string' || typeof value === 'number') && !c.ignore?.[key]) {
        const cssVar = token2CSSVar(key, c.prefix || 'ant');
        cssVars[cssVar] =
          typeof value === 'number' && !c.unitless?.[key] ? `${value}px` : String(value);
        mergedToken[key] = `var(${cssVar})`;
      }
    });

    // scope 为空时不能生成无选择器的裸声明块（非法 CSS）
    const cssVarsStr =
      Object.keys(cssVars).length && c.scope
        ? `${c.scope}{${Object.entries(cssVars)
            .map(([k, v]) => `${k}:${v};`)
            .join('')}}`
        : '';

    const styleId = uniqueHash(
      [c.path.join('-'), c.prefix || 'ant', c.scope || '', c.tokenKey || ''],
      cssVarsStr,
    );

    return { mergedToken, cssVarsStr, styleId, zeroRuntime: c.zeroRuntime };
  });

  // 副作用：把变量声明注入 DOM
  watchEffect(() => {
    const { cssVarsStr, styleId, zeroRuntime } = built.value;
    if (!cssVarsStr || zeroRuntime || typeof document === 'undefined') {
      return;
    }
    const selector = `style[data-css-var-id="${styleId}"]`;
    let el = document.querySelector(selector) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement('style');
      el.setAttribute('data-css-var-id', styleId);
      document.head.insertBefore(el, document.head.firstChild);
    }
    if (el.innerHTML !== cssVarsStr) {
      el.innerHTML = cssVarsStr;
    }
  });

  return computed(() => built.value.mergedToken);
}
