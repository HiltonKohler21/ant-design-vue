import { TinyColor } from '@ctrl/tinycolor';
import type { InjectionKey } from 'vue';
import { computed, inject, watch } from 'vue';
import { theme } from '../../../components';
import { useConfigContextInject } from '../../../components/config-provider/context';

const { useToken } = theme;
const SITE_TOKEN_STYLE_ID = 'antdv-site-token-style';

/**
 * Provided as `true` by the root `SiteToken.vue` so nested `useSiteToken()`
 * callers (e.g. inside `ComponentTokenTable`'s local `<ConfigProvider>`) do
 * not overwrite `:root` CSS variables, while standalone callers outside
 * `<SiteToken>` (such as unit tests) still sync `:root` by default.
 */
export const SITE_TOKEN_ROOT_MANAGED: InjectionKey<boolean> = Symbol('siteTokenRootManaged');

export interface UseSiteTokenOptions {
  /**
   * Explicitly enable or disable syncing `:root` CSS variables.
   * Defaults to `true` when no ancestor `<SiteToken>` manages `:root`,
   * and `false` when nested inside `<SiteToken>`.
   */
  syncRootStyle?: boolean;
}

const useSiteToken = (options?: UseSiteTokenOptions) => {
  const result = useToken();
  const { getPrefixCls, iconPrefixCls } = useConfigContextInject();
  const rootPrefixCls = computed(() => getPrefixCls());
  const isRootManaged = inject(SITE_TOKEN_ROOT_MANAGED, false);
  const shouldSyncRoot = options?.syncRootStyle ?? !isRootManaged;
  // cssVar 模式下 token 的值是 `var(--ant-*)` 字符串，直接参与 JS 运算会得到 NaN，
  // 拼 `${x}px` 会得到 `var(--x)px`，TinyColor 解析会得到黑色。
  // 站点自身的 CSS 变量都由 JS 拼装，因此统一使用 realToken（原始数值/色值）。
  const { token, realToken } = result;
  const raw = realToken ?? token;

  const mergedToken = computed(() => ({
    theme: result.theme.value,
    hashId: result.hashId.value,
    token: {
      ...raw.value,
      headerHeight: 64,
      menuItemBorder: 2,
      mobileMaxWidth: 767.99,
      siteMarkdownCodeBg: raw.value.colorFillTertiary,
      antCls: `.${rootPrefixCls.value}`,
      iconCls: `.${iconPrefixCls.value}`,
      /** 56 */
      marginFarXS: (raw.value.marginXXL / 6) * 7,
      /** 80 */
      marginFarSM: (raw.value.marginXXL / 3) * 5,
      /** 96 */
      marginFar: raw.value.marginXXL * 2,
      codeFamily: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
    },
  }));

  if (shouldSyncRoot) {
    watch(
      mergedToken,
      () => {
        if (typeof document === 'undefined') return;
        let styleDom = document.getElementById(SITE_TOKEN_STYLE_ID) as HTMLStyleElement | null;
        if (!styleDom) {
          styleDom = document.createElement('style');
          styleDom.id = SITE_TOKEN_STYLE_ID;
          document.body.appendChild(styleDom);
        }
        const tokenValue = mergedToken.value.token;
        const demoGridColor = raw.value.colorPrimary;
        const headerGlassBg = new TinyColor(tokenValue.colorBgContainer)
          .setAlpha(0.85)
          .toRgbString();
        styleDom.innerHTML = `
      :root {
        --header-height: ${tokenValue.headerHeight}px;
        --menu-item-border: ${tokenValue.menuItemBorder}px;

        --primary-color: ${tokenValue.colorPrimary};
        --primary-color-bg: ${tokenValue.colorPrimaryBg};
        --primary-color-border: ${tokenValue.colorPrimaryBorder};
        --component-background: ${tokenValue.colorBgContainer};
        --body-background: ${tokenValue.colorBgContainer};
        --site-header-bg: ${headerGlassBg};
        --site-footer-bg: ${tokenValue.colorBgLayout};
        --site-hover-bg: ${tokenValue.colorFillTertiary};
        --color-fill-alter: ${tokenValue.colorFillAlter};
        --color-fill-tertiary: ${tokenValue.colorFillTertiary};
        --color-bg-layout: ${tokenValue.colorBgLayout};
        --color-bg-elevated: ${tokenValue.colorBgElevated};
        --site-markdown-code-bg: ${tokenValue.siteMarkdownCodeBg};
        --site-text-color: ${tokenValue.colorText};
        --demo-grid-color: ${demoGridColor};
        --demo-grid-color-60: ${new TinyColor(demoGridColor).setAlpha(0.6).toHex8String()};
        --demo-grid-color-65: ${new TinyColor(demoGridColor).setAlpha(0.65).toHex8String()};
        --demo-grid-color-75: ${new TinyColor(demoGridColor).setAlpha(0.75).toHex8String()};
        --site-text-color-secondary: ${tokenValue.colorTextSecondary};
        --site-border-color-split: ${tokenValue.colorSplit};
        --border-radius-base: ${tokenValue.borderRadius}px;
        --font-size-base: ${tokenValue.fontSize}px;
        --font-size-max: ${Math.max(tokenValue.fontSize - 1, 12)}px;
        --font-family: ${tokenValue.fontFamily};
        --code-family: ${tokenValue.codeFamily};
        --margin-far-xs: ${tokenValue.marginFarXS}px;

        --border-color-base: ${tokenValue.colorBorder};
        --purple-1: ${tokenValue['purple-1']};
        --purple-2: ${tokenValue['purple-2']};
        --purple-3: ${tokenValue['purple-3']};
        --purple-5: ${tokenValue['purple-5']};
        --purple-6: ${tokenValue['purple-6']};
        --warning-color: ${tokenValue.colorWarning};
        --warning-color-bg: ${tokenValue.colorWarningBg};
        --text-color: ${tokenValue.colorText};
        --search-icon-color: ${tokenValue.colorTextPlaceholder};
        --ease-in-out-circ: ${tokenValue.motionEaseInOutCirc};
        --shadow-2: ${tokenValue.boxShadowSecondary};
        --link-color: ${tokenValue.colorLink};
        --error-color: ${tokenValue.colorError};
        --white: ${tokenValue.colorWhite};
        --green-6: ${tokenValue['green-6']};
        --gray-8: ${tokenValue.colorText};
        --magenta-6: ${tokenValue['magenta-6']};
        --magenta-7: ${tokenValue['magenta-7']};
        --line-height-base: ${tokenValue.lineHeight};
        --screen-md-min: ${tokenValue.screenMDMin}px;
        --screen-sm-min: ${tokenValue.screenSMMin}px;
        --screen-lg: ${tokenValue.screenLG}px;
        --mobile-max-width: ${tokenValue.mobileMaxWidth}px;
        --box-shadow-base: ${tokenValue.boxShadow};
        --animation-duration-base: ${tokenValue.motionDurationSlow};
        --ease-in-out: ${tokenValue.motionEaseInOut};
        --shadow-1-down: ${tokenValue.boxShadowCard};
        --box-shadow: ${tokenValue.boxShadow};
      }
    `;
        if (!document.body.contains(styleDom)) {
          document.body.appendChild(styleDom);
        }
      },
      { immediate: true },
    );
  }

  return mergedToken;
};

export default useSiteToken;
