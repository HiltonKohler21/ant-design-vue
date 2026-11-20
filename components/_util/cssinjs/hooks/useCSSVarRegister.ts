import hash from '@emotion/hash';
import type { ComputedRef } from 'vue';
import { computed } from 'vue';
import { removeCSS, updateCSS } from '../../../vc-util/Dom/dynamicCSS';
import { ATTR_MARK, useStyleInject } from '../StyleContext';
import { token2CSSVar } from '../util/css-variables';
import useGlobalCache from './useGlobalCache';

export const CSS_VAR_PREFIX = 'cssVar';

const uniqueHash = (path: (string | number)[], styleStr: string) =>
  hash(`${path.join('%')}${styleStr}`);

export interface CSSVarRegisterConfig {
  /** 缓存路径，通常为 [组件名] */
  path: string[];
  /** CSS 变量前缀，默认 ant */
  prefix?: string;
  /** 变量声明的选择器（一般用组件根类名，如 `.ant-btn`） */
  scope?: string;
  unitless?: Record<string, boolean>;
  ignore?: Record<string, boolean>;
  preserve?: Record<string, boolean>;
  /** token 的稳定标识（用于 cache 命中） */
  tokenKey?: string;
  /** 关闭运行时注入（zeroRuntime 模式） */
  zeroRuntime?: boolean;
}

/**
 * 注册 CSS 变量声明。
 *
 * 与 antd v6 的差异：v6 通过 `hashId` + `cssVarCls` 双重 class 隔离以实现嵌套主题；
 * 这里简化为直接用组件类名作 scope（组件 DOM 无需额外 class），
 * 代价是「嵌套 ConfigProvider 局部主题」场景下变量声明会相互覆盖（已在迁移文档中标注为已知限制）。
 */
export default function useCSSVarRegister(
  config: ComputedRef<CSSVarRegisterConfig>,
  fn: () => Record<string, any>,
): ComputedRef<Record<string, any>> {
  const styleContext = useStyleInject();

  const keyPath = computed(() => {
    const c = config.value;
    return [c.path.join('-'), c.prefix || 'ant', c.scope || '', c.tokenKey || ''];
  });

  const cacheRef = useGlobalCache<[Record<string, any>, string, string]>(
    CSS_VAR_PREFIX,
    keyPath,
    () => {
      const c = config.value;
      const originToken = fn();

      const cssVars: Record<string, string> = {};
      const mergedToken: Record<string, any> = {};
      Object.entries(originToken).forEach(([key, value]) => {
        if (c.preserve?.[key]) {
          mergedToken[key] = value;
        } else if ((typeof value === 'string' || typeof value === 'number') && !c.ignore?.[key]) {
          const cssVar = token2CSSVar(key, c.prefix || 'ant');
          cssVars[cssVar] =
            typeof value === 'number' && !c.unitless?.[key] ? `${value}px` : String(value);
          mergedToken[key] = `var(${cssVar})`;
        }
      });

      const cssVarsStr = Object.keys(cssVars).length
        ? `${c.scope}{${Object.entries(cssVars)
            .map(([k, v]) => `${k}:${v};`)
            .join('')}}`
        : '';
      const styleId = uniqueHash(keyPath.value, cssVarsStr);

      if (cssVarsStr && !c.zeroRuntime && typeof document !== 'undefined') {
        const style = updateCSS(cssVarsStr, styleId, {
          mark: ATTR_MARK,
          prepend: 'queue',
          attachTo: styleContext.value.container,
          priority: -999,
        });
        (style as any)[CSS_VAR_PREFIX] = true;
      }

      return [mergedToken, cssVarsStr, styleId];
    },
    ([, , styleId]) => {
      if (typeof document !== 'undefined') {
        removeCSS(styleId, { mark: ATTR_MARK, attachTo: styleContext.value.container });
      }
    },
  );

  return computed(() => cacheRef.value?.[0] ?? {});
}
