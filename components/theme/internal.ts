import type { CSSInterpolation, Theme } from '../_util/cssinjs';
import { createTheme, transformToken, useCacheToken, useStyleRegister } from '../_util/cssinjs';
import useCSSVarRegister from '../_util/cssinjs/hooks/useCSSVarRegister';
import {
  ignore as CSS_VAR_IGNORE,
  preserve as CSS_VAR_PRESERVE,
  unitless as CSS_VAR_UNITLESS,
} from './util/unitless';

import version from '../version';
import type {
  AliasToken,
  GlobalToken,
  MapToken,
  OverrideToken,
  PresetColorType,
  PresetColorKey,
  SeedToken,
} from './interface';
import { PresetColors } from './interface';
import defaultDerivative from './themes/default';
import defaultSeedToken from './themes/seed';
import formatToken from './util/alias';
import type { FullToken } from './util/genComponentStyleHook';
import genComponentStyleHook from './util/genComponentStyleHook';
import statisticToken, { merge as mergeToken, statistic } from './util/statistic';
import type { VueNode } from '../_util/type';
import { objectType } from '../_util/type';
import type { ComputedRef, InjectionKey, Ref } from 'vue';
import {
  triggerRef,
  unref,
  defineComponent,
  provide,
  computed,
  inject,
  watch,
  shallowRef,
} from 'vue';

const defaultTheme = createTheme(defaultDerivative);

export {
  // colors
  PresetColors,
  // Statistic
  statistic,
  statisticToken,
  mergeToken,
  // hooks
  useStyleRegister,
  genComponentStyleHook,
};
export type {
  SeedToken,
  AliasToken,
  PresetColorType,
  PresetColorKey,
  // FIXME: Remove this type
  AliasToken as DerivativeToken,
  FullToken,
};

// ================================ Context =================================
// To ensure snapshot stable. We disable hashed in test env.
export const defaultConfig = {
  token: defaultSeedToken,
  hashed: true,
};

export interface CssVarConfig {
  prefix?: string;
  key?: string;
}

export interface DesignTokenContext {
  token: Partial<AliasToken>;
  theme?: Theme<SeedToken, MapToken>;
  components?: OverrideToken;
  hashed?: string | boolean;
  /** 开启纯 CSS 变量模式（antd v6 行为）：样式只生成一次，主题切换只改变量值 */
  cssVar?: boolean | CssVarConfig;
  /** 关闭运行时样式生成，需配合静态 CSS 提取 */
  zeroRuntime?: boolean;
}
//defaultConfig
const DesignTokenContextKey: InjectionKey<ComputedRef<DesignTokenContext>> =
  Symbol('DesignTokenContext');

export const globalDesignTokenApi = shallowRef<DesignTokenContext>();

export const useDesignTokenProvider = (value: ComputedRef<DesignTokenContext>) => {
  provide(DesignTokenContextKey, value);
  watch(
    value,
    () => {
      globalDesignTokenApi.value = unref(value);
      triggerRef(globalDesignTokenApi);
    },
    { immediate: true, deep: true },
  );
};

export const useDesignTokenInject = () => {
  return inject(
    DesignTokenContextKey,
    computed(() => globalDesignTokenApi.value || defaultConfig),
  );
};
export const DesignTokenProvider = defineComponent({
  props: {
    value: objectType<DesignTokenContext>(),
  },
  setup(props, { slots }) {
    useDesignTokenProvider(computed(() => props.value));
    return () => {
      return slots.default?.();
    };
  },
});
// ================================== Hook ==================================
export interface CssVarResolvedConfig {
  prefix: string;
  key: string;
}

export function useToken(): [
  ComputedRef<Theme<SeedToken, MapToken>>,
  ComputedRef<GlobalToken>,
  ComputedRef<string>,
  /** 原始 token（未变量化，用于 JS 数值运算与变量声明） */
  ComputedRef<GlobalToken>,
  /** CSS 变量配置；null 表示处于 hash 模式 */
  ComputedRef<CssVarResolvedConfig | null>,
] {
  const designTokenContext = inject<ComputedRef<DesignTokenContext>>(
    DesignTokenContextKey,
    computed(() => globalDesignTokenApi.value || defaultConfig),
  );

  const salt = computed(() => `${version}-${designTokenContext.value.hashed || ''}`);

  const mergedTheme = computed(() => designTokenContext.value.theme || defaultTheme);

  const cacheToken = useCacheToken<GlobalToken, SeedToken>(
    mergedTheme,
    computed(() => [defaultSeedToken, designTokenContext.value.token]),
    computed(() => ({
      salt: salt.value,
      override: {
        override: designTokenContext.value.token,
        ...designTokenContext.value.components,
      },
      formatToken,
    })),
  );

  const realToken = computed(() => cacheToken.value[0]);
  const cssVarConfig = computed<CssVarResolvedConfig | null>(() => {
    const cssVar = designTokenContext.value.cssVar;
    if (!cssVar) {
      return null;
    }
    const cfg = typeof cssVar === 'object' ? cssVar : {};
    return {
      prefix: cfg.prefix || 'ant',
      key: cfg.key || `css-var-${salt.value}`,
    };
  });
  // cssVar 模式下把 token 值替换成 var(--ant-xxx)，样式因此只生成一次
  const token = computed(() => {
    if (!cssVarConfig.value) {
      return realToken.value;
    }
    const [transformed] = transformToken(realToken.value as any, cssVarConfig.value.key, {
      prefix: cssVarConfig.value.prefix,
      unitless: CSS_VAR_UNITLESS,
      ignore: CSS_VAR_IGNORE,
      preserve: CSS_VAR_PRESERVE,
    });
    return transformed as unknown as GlobalToken;
  });

  // cssVar 模式下注册全局 token 变量（挂到 :root，所有组件可读）
  useCSSVarRegister(
    computed(() => ({
      path: ['global-token'],
      prefix: cssVarConfig.value?.prefix || 'ant',
      scope: cssVarConfig.value ? ':root' : '',
      unitless: CSS_VAR_UNITLESS,
      ignore: CSS_VAR_IGNORE,
      preserve: CSS_VAR_PRESERVE,
      tokenKey: (realToken.value as any)?._tokenKey,
      zeroRuntime: (designTokenContext.value as any)?.zeroRuntime,
    })),
    () => realToken.value,
  );

  return [
    mergedTheme,
    token,
    computed(() => (designTokenContext.value.hashed ? cacheToken.value[1] : '')),
    realToken,
    cssVarConfig,
  ];
}

export type UseComponentStyleResult = [(node: VueNode) => VueNode, Ref<string>];

export type GenerateStyle<
  ComponentToken extends object = AliasToken,
  ReturnType = CSSInterpolation,
> = (token: ComponentToken) => ReturnType;
