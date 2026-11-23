/* eslint-disable no-redeclare */

import { genCalc, token2CSSVar, useCSSVarRegister, useStyleRegister } from '../../_util/cssinjs';
import type { AbstractCalculator } from '../../_util/cssinjs';
import type { CSSInterpolation } from '../../_util/cssinjs';
import { genCommonStyle, genLinkStyle } from '../../style';
import type { UseComponentStyleResult } from '../internal';
import { mergeToken, statisticToken, useDesignTokenInject, useToken } from '../internal';
import {
  ignore as CSS_VAR_IGNORE,
  preserve as CSS_VAR_PRESERVE,
  unitless as CSS_VAR_UNITLESS,
} from './unitless';
import type { ComponentTokenMap, GlobalToken } from '../interface';
import type { Ref } from 'vue';
import { computed } from 'vue';
import { useConfigContextInject } from '../../config-provider/context';

export type OverrideTokenWithoutDerivative = ComponentTokenMap;
export type OverrideComponent = keyof OverrideTokenWithoutDerivative;
export type GlobalTokenWithComponent<ComponentName extends OverrideComponent> = GlobalToken &
  ComponentTokenMap[ComponentName];

export interface StyleInfo<ComponentName extends OverrideComponent> {
  hashId: string;
  prefixCls: string;
  rootPrefixCls: string;
  iconPrefixCls: string;
  overrideComponentToken: ComponentTokenMap[ComponentName];
}

export type TokenWithCommonCls<T> = T & {
  /** Wrap component class with `.` prefix */
  componentCls: string;
  /** Origin prefix which do not have `.` prefix */
  prefixCls: string;
  /** Wrap icon class with `.` prefix */
  iconCls: string;
  /** Wrap ant prefixCls class with `.` prefix */
  antCls: string;
} & {
  /** CSS 表达式计算器：cssVar 模式下输出 calc()，hash 模式下为纯数值运算 */
  calc: (num: number | string) => AbstractCalculator;
};
export type FullToken<ComponentName extends OverrideComponent> = TokenWithCommonCls<
  GlobalTokenWithComponent<ComponentName>
>;

export interface GenComponentStyleHookOptions {
  unitless?: Record<string, boolean>;
}

export default function genComponentStyleHook<ComponentName extends OverrideComponent>(
  component: ComponentName,
  styleFn: (token: FullToken<ComponentName>, info: StyleInfo<ComponentName>) => CSSInterpolation,
  getDefaultToken?:
    | OverrideTokenWithoutDerivative[ComponentName]
    | ((token: GlobalToken) => OverrideTokenWithoutDerivative[ComponentName]),
  options?: GenComponentStyleHookOptions,
) {
  return (_prefixCls?: Ref<string>): UseComponentStyleResult => {
    const prefixCls = computed(() => _prefixCls?.value);
    const [theme, token, hashId, realToken, cssVarConfig, themeSeqRef] = useToken();
    const designTokenContext = useDesignTokenInject();
    const { getPrefixCls, iconPrefixCls } = useConfigContextInject();
    const rootPrefixCls = computed(() => getPrefixCls());

    // ==================== Component Token（用原始 token 做数值计算）====================
    /** 原始 component token（key 原名、值为字面量） */
    const getRawComponentToken = () => {
      const { token: proxyToken } = statisticToken(realToken.value);
      const defaultComponentToken =
        typeof getDefaultToken === 'function'
          ? (getDefaultToken as any)(proxyToken)
          : getDefaultToken;
      return { ...defaultComponentToken, ...realToken.value[component] };
    };

    /**
     * component token key → 带组件前缀（defaultBg → TagDefaultBg）。
     * 避免不同组件同名 token 的变量互相覆盖（对齐 antd v6 的 --ant-tag-default-bg 命名）。
     */
    const toCompTokenKey = (key: string) =>
      `${component}${key.charAt(0).toUpperCase()}${key.slice(1)}`;

    /** 声明侧：key 加组件前缀，由 useCSSVarRegister 生成 --ant-tag-default-bg */
    const getComponentToken = () => {
      const raw = getRawComponentToken();
      const prefixed: Record<string, any> = {};
      Object.keys(raw).forEach(key => {
        prefixed[toCompTokenKey(key)] = raw[key];
      });
      return prefixed;
    };

    /** 引用侧：key 保持原名，值替换为 var(--ant-tag-default-bg)，供 styleFn 使用 */
    const getStyleComponentToken = (raw = getRawComponentToken()) => {
      if (!cssVarConfig.value) {
        return raw;
      }
      const prefix = cssVarConfig.value.prefix || 'ant';
      const result: Record<string, any> = {};
      Object.keys(raw).forEach(key => {
        const value = raw[key];
        result[key] =
          typeof value === 'string' || typeof value === 'number'
            ? `var(${token2CSSVar(toCompTokenKey(key), prefix)})`
            : value;
      });
      return result;
    };

    // ==================== CSS 变量注册（antd v6 纯变量模式）====================
    // 组件级 token 在声明侧经 toCompTokenKey 加了组件前缀（如 zIndexPopup → DrawerZIndexPopup），
    // 因此 unitless / ignore / preserve 也必须同步映射到带前缀 key，否则会被误拼 px。
    const mapCompFlags = (flags: Record<string, boolean>) => {
      const mapped: Record<string, boolean> = { ...flags };
      Object.keys(flags).forEach(key => {
        if (flags[key]) {
          mapped[toCompTokenKey(key)] = true;
        }
      });
      return mapped;
    };
    const compUnitless = mapCompFlags({
      ...CSS_VAR_UNITLESS,
      ...options?.unitless,
    });
    const compIgnore = mapCompFlags(CSS_VAR_IGNORE);
    const compPreserve = mapCompFlags(CSS_VAR_PRESERVE);

    const unitlessCssVar = computed(() => {
      const prefix = cssVarConfig.value?.prefix || 'ant';
      return new Set(
        Object.keys(compUnitless)
          .filter(key => compUnitless[key])
          .map(key => token2CSSVar(key, prefix)),
      );
    });
    // 注册组件级 CSS 变量声明（--ant-<component>-<token>）
    // 挂在 :root 上以确保挂载到 body 的弹层（Select/DatePicker/Image Preview 等）也能继承组件变量
    useCSSVarRegister(
      computed(() => ({
        path: [component],
        prefix: cssVarConfig.value?.prefix || 'ant',
        scope: cssVarConfig.value ? ':root' : '',
        unitless: compUnitless,
        ignore: compIgnore,
        preserve: compPreserve,
        tokenKey: (realToken.value as any)?._tokenKey,
        zeroRuntime: (designTokenContext.value as any)?.zeroRuntime,
        themeSeq: themeSeqRef.value,
      })),
      getComponentToken,
    );
    // cssVar 模式输出 calc()，hash 模式保持纯数值运算
    const calc = computed(() =>
      genCalc(cssVarConfig.value ? 'css' : 'number', unitlessCssVar.value),
    );

    const sharedInfo = computed(() => {
      return {
        theme: theme.value,
        token: token.value,
        hashId: hashId.value,
        path: ['Shared', rootPrefixCls.value],
        zeroRuntime: (designTokenContext.value as any)?.zeroRuntime,
      };
    });
    // Generate style for all a tags in antd component.
    useStyleRegister(sharedInfo, () => [
      {
        // Link
        '&': genLinkStyle(token.value),
      },
    ]);
    const componentInfo = computed(() => {
      return {
        theme: theme.value,
        token: token.value,
        hashId: hashId.value,
        path: [component, prefixCls.value, iconPrefixCls.value],
        zeroRuntime: (designTokenContext.value as any)?.zeroRuntime,
      };
    });
    return [
      useStyleRegister(componentInfo, () => {
        const { token: proxyToken, flush } = statisticToken(token.value);

        const rawComponentToken = getRawComponentToken();
        const mergedComponentToken = cssVarConfig.value
          ? getStyleComponentToken(rawComponentToken)
          : rawComponentToken;

        const componentCls = `.${prefixCls.value}`;
        const mergedToken = mergeToken<
          TokenWithCommonCls<GlobalTokenWithComponent<OverrideComponent>>
        >(
          proxyToken,
          {
            componentCls,
            prefixCls: prefixCls.value,
            iconCls: `.${iconPrefixCls.value}`,
            antCls: `.${rootPrefixCls.value}`,
            calc: calc.value,
          },
          mergedComponentToken,
        );
        // 供「数值派生」场景（Math.round / 取整 / 比较）使用真实数值 token；
        // cssVar 模式下 token 值是 var() 字符串，无法参与 JS 数值运算。
        Object.defineProperty(mergedToken, '_realToken', {
          // 全局 token + 组件级 token 的「真实数值」（组件级 token 在 cssVar 模式下同样被 var 化）
          value: { ...realToken.value, ...rawComponentToken },
          enumerable: false,
          configurable: true,
        });
        const styleInterpolation = styleFn(mergedToken as unknown as FullToken<ComponentName>, {
          hashId: hashId.value,
          prefixCls: prefixCls.value,
          rootPrefixCls: rootPrefixCls.value,
          iconPrefixCls: iconPrefixCls.value,
          overrideComponentToken: realToken.value[component],
        });
        flush(component, rawComponentToken);
        return [genCommonStyle(token.value, prefixCls.value), styleInterpolation];
      }),
      hashId,
    ];
  };
}
