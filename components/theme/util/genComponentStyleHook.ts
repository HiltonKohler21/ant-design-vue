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

export default function genComponentStyleHook<ComponentName extends OverrideComponent>(
  component: ComponentName,
  styleFn: (token: FullToken<ComponentName>, info: StyleInfo<ComponentName>) => CSSInterpolation,
  getDefaultToken?:
    | OverrideTokenWithoutDerivative[ComponentName]
    | ((token: GlobalToken) => OverrideTokenWithoutDerivative[ComponentName]),
) {
  return (_prefixCls?: Ref<string>): UseComponentStyleResult => {
    const prefixCls = computed(() => _prefixCls?.value);
    const [theme, token, hashId, realToken, cssVarConfig] = useToken();
    const designTokenContext = useDesignTokenInject();
    const { getPrefixCls, iconPrefixCls } = useConfigContextInject();
    const rootPrefixCls = computed(() => getPrefixCls());

    // ==================== Component Token（用原始 token 做数值计算）====================
    const getComponentToken = () => {
      const { token: proxyToken } = statisticToken(realToken.value);
      const defaultComponentToken =
        typeof getDefaultToken === 'function'
          ? (getDefaultToken as any)(proxyToken)
          : getDefaultToken;
      return { ...defaultComponentToken, ...realToken.value[component] };
    };

    // ==================== CSS 变量注册（antd v6 纯变量模式）====================
    const unitlessCssVar = new Set(
      Object.keys(CSS_VAR_UNITLESS).map(key => token2CSSVar(key, cssVarConfig.value?.prefix)),
    );
    const cssVarToken = useCSSVarRegister(
      computed(() => ({
        path: [component],
        prefix: cssVarConfig.value?.prefix || 'ant',
        scope: cssVarConfig.value ? `.${prefixCls.value}` : '',
        unitless: CSS_VAR_UNITLESS,
        ignore: CSS_VAR_IGNORE,
        preserve: CSS_VAR_PRESERVE,
        tokenKey: (realToken.value as any)?._tokenKey,
        zeroRuntime: (designTokenContext.value as any)?.zeroRuntime,
      })),
      getComponentToken,
    );
    // cssVar 模式输出 calc()，hash 模式保持纯数值运算
    const calc = computed(() => genCalc(cssVarConfig.value ? 'css' : 'number', unitlessCssVar));

    const sharedInfo = computed(() => {
      return {
        theme: theme.value,
        token: token.value,
        hashId: hashId.value,
        path: ['Shared', rootPrefixCls.value],
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
      };
    });
    return [
      useStyleRegister(componentInfo, () => {
        const { token: proxyToken, flush } = statisticToken(token.value);

        const mergedComponentToken = cssVarConfig.value ? cssVarToken.value : getComponentToken();

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
        const styleInterpolation = styleFn(mergedToken as unknown as FullToken<ComponentName>, {
          hashId: hashId.value,
          prefixCls: prefixCls.value,
          rootPrefixCls: rootPrefixCls.value,
          iconPrefixCls: iconPrefixCls.value,
          overrideComponentToken: realToken.value[component],
        });
        flush(component, mergedComponentToken);
        return [genCommonStyle(token.value, prefixCls.value), styleInterpolation];
      }),
      hashId,
    ];
  };
}
