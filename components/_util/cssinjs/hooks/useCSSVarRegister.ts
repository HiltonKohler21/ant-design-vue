import hash from '@emotion/hash';
import type { ComputedRef } from 'vue';
import { computed, watchEffect } from 'vue';
import { token2CSSVar } from '../util/css-variables';

export const CSS_VAR_PREFIX = 'cssVar';

/**
 * 变量声明登记表（styleId → CSS 文本）。
 * 运行时正常模式下用于去重注入；zeroRuntime 模式下由 extractCSSVarStyle 汇总输出，
 * 供静态 CSS 提取脚本使用。
 */
const cssVarRegistry = new Map<string, string>();

/** 汇总所有已登记的变量声明 CSS（供静态提取使用） */
export function extractCSSVarStyle(): string {
  return Array.from(cssVarRegistry.values()).join('\n');
}

/** 清空登记表（测试/多次提取时使用） */
export function clearCSSVarRegistry(): void {
  cssVarRegistry.clear();
}

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
  /**
   * 插入优先级：low 表示「无上层 DesignToken Provider 的兜底块」，
   * 会插到 head 最前面；high（默认）表示「Provider 提供的主题块」，追加到末尾。
   * 这样默认主题永远无法覆盖 Provider 声明的主题。
   */
  priority?: 'low' | 'high';
  /** 主题代号：变化时重新定位该变量块（切主题生效顺序） */
  themeSeq?: number;
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
      } else if (c.preserve?.[key] || (typeof value === 'boolean' && !c.ignore?.[key])) {
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
      [c.path.join('-'), c.prefix || 'ant', c.scope || '', c.tokenKey || '', c.priority || 'high'],
      cssVarsStr,
    );

    return { mergedToken, cssVarsStr, styleId, zeroRuntime: c.zeroRuntime };
  });

  // 副作用：把变量声明注入 DOM
  watchEffect(() => {
    const { cssVarsStr, styleId, zeroRuntime } = built.value;
    if (!cssVarsStr) {
      return;
    }
    // 无论是否 zeroRuntime 都登记，保证静态提取能拿到变量声明
    cssVarRegistry.set(styleId, cssVarsStr);
    if (zeroRuntime || typeof document === 'undefined') {
      return;
    }
    const selector = `style[data-css-var-id="${styleId}"]`;
    let el = document.querySelector(selector) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement('style');
      el.setAttribute('data-css-var-id', styleId);
      // 便于排查「哪个组件注册了变量块」（仅属性，无副作用）
      el.setAttribute('data-css-var-path', config.value.path.join('|'));
      el.setAttribute('data-css-var-priority', config.value.priority || 'high');
    }
    if (el.innerHTML !== cssVarsStr) {
      el.innerHTML = cssVarsStr;
    }
    // 仅在「主题 token 变化」时重定位（做一次），避免每次渲染都搬动 DOM 造成样式重算风暴。
    // - high（Provider 主题块）追加到末尾 → 最近生效的主题胜出（支持来回切换）
    // - low（无 Provider 的兜底块）保持在最前面 → 不会盖住主题块
    const tokenKeyMark = `${config.value.tokenKey || ''}#${config.value.themeSeq ?? 0}`;
    if (el.getAttribute('data-css-var-token') !== tokenKeyMark) {
      el.setAttribute('data-css-var-token', tokenKeyMark);
      if ((config.value.priority || 'high') === 'low') {
        document.head.insertBefore(el, document.head.firstChild);
      } else {
        document.head.appendChild(el);
      }
    }
  });

  return computed(() => built.value.mergedToken);
}
