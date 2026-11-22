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

/** 主题代号：token 每次重算（切主题/改 token）自增，用于让变量声明块重新排序 */
let themeSeq = 0;
export const getThemeSeq = () => themeSeq;

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

/** 读取父级 DesignToken 上下文；无上层 Provider 时返回 null（用于区分「顶层 / 嵌套」） */
export const useDesignTokenOptionalInject = () => inject(DesignTokenContextKey, null);

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

export function useToken(options?: {
  /**
   * 外部显式指定的 zeroRuntime。
   * ConfigProvider 自身的 useToken 发生在 DesignTokenContext provide 之前，
   * 此时读不到 theme.zeroRuntime，需要由调用方显式传入。
   */
  zeroRuntime?: Ref<boolean>;
}): [
  ComputedRef<Theme<SeedToken, MapToken>>,
  ComputedRef<GlobalToken>,
  ComputedRef<string>,
  /** 原始 token（未变量化，用于 JS 数值运算与变量声明） */
  ComputedRef<GlobalToken>,
  /** CSS 变量配置；null 表示处于 hash 模式 */
  ComputedRef<CssVarResolvedConfig | null>,
] {
  // 是否处在上层 DesignToken Provider 之内（决定变量块的插入优先级）：
  // ConfigProvider 自身的 useToken（provide 之前）拿不到 Provider，属兜底块。
  const parentDesignTokenContext = inject<ComputedRef<DesignTokenContext> | null>(
    DesignTokenContextKey,
    null,
  );

  const designTokenContext = inject<ComputedRef<DesignTokenContext>>(
    DesignTokenContextKey,
    computed(() => globalDesignTokenApi.value || defaultConfig),
  );

  // salt 需要区分 hash / cssVar 模式，否则两种模式的样式缓存会互相命中
  const salt = computed(() => {
    const cssVar = designTokenContext.value.cssVar;
    // cssVar 默认开启（对齐 antd v6）：只有显式传 false 才回到 hash 模式
    const cssVarEnabled = cssVar !== false;
    const cssVarMark = cssVarEnabled
      ? `-cssvar-${typeof cssVar === 'object' && cssVar && cssVar.key ? cssVar.key : 'default'}`
      : '';
    return `${version}-${designTokenContext.value.hashed || ''}${cssVarMark}`;
  });

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

  // token 重算即视为主题变化（用于变量块排序，避免每次渲染都搬 DOM）
  const themeSeqRef = computed(() => {
    // 依赖 cacheToken，值变化时序号 +1
    // eslint-disable-next-line no-unused-expressions
    cacheToken.value;
    themeSeq += 1;
    return themeSeq;
  });

  const realToken = computed(() => cacheToken.value[0]);
  const cssVarConfig = computed<CssVarResolvedConfig | null>(() => {
    const cssVar = designTokenContext.value.cssVar;
    // 默认开启（对齐 antd v6）；显式 false 时回退到 hash 模式
    if (cssVar === false) {
      return null;
    }
    const cfg = typeof cssVar === 'object' && cssVar ? cssVar : {};
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
    // 关键：cssVar 模式下 token 值（var 引用）与主题无关，样式只需生成一份。
    // useStyleRegister 用 _tokenKey 作为样式缓存前缀，若保留「随主题变化」的 _tokenKey，
    // 每个主题都会重新生成一整份样式（缓存永不命中）。
    // 因此这里改为与主题无关的常量（对齐 antd cssinjs@2 的 hashId = hash(salt_prefix)）。
    (transformed as any)._tokenKey = `css-var-${cssVarConfig.value.key}`;
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
      zeroRuntime: options?.zeroRuntime?.value ?? (designTokenContext.value as any)?.zeroRuntime,
      priority: parentDesignTokenContext ? 'high' : 'low',
      themeSeq: themeSeqRef.value,
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
