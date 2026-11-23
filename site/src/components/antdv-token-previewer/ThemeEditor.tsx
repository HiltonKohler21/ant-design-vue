import type { PropType, Ref } from 'vue';
import { defineComponent, inject, toRefs, ref, computed } from 'vue';
import { ConfigProvider, theme as antdTheme } from 'ant-design-vue';
import type { DerivativeFunc } from 'ant-design-vue/es/_util/cssinjs';
import classNames from 'ant-design-vue/es/_util/classNames';
import type { SelectedToken, Theme } from './interface';
import type { Locale } from './locale';
import { useProvideLocaleContext, zhCN } from './locale';
import { mapRelatedAlias, seedRelatedAlias, seedRelatedMap } from './meta/TokenRelation';
import { getRelatedComponents } from './utils/statistic';
import makeStyle from './utils/makeStyle';
import useControlledTheme from './hooks/useControlledTheme';

import type { TokenPanelProProps } from './token-panel-pro';
import TokenPanelPro from './token-panel-pro';
import ComponentDemoPro from './token-panel-pro/ComponentDemoPro';
import { antdComponents } from './component-panel';

const { defaultAlgorithm, darkAlgorithm: antdDarkAlgorithm } = antdTheme;

const useStyle = makeStyle('ThemeEditor', token => ({
  '.antd-theme-editor': {
    backgroundColor: token.colorBgLayout,
    color: token.colorText,
    display: 'flex',
    width: '100%',
    minWidth: 0,

    '.antd-theme-editor-panel': {
      flex: '0 0 min(540px, 100%)',
      maxWidth: '100%',
      minWidth: 0,
      height: '100%',
      backgroundColor: token.colorBgContainer,
      display: 'flex',
      transition: 'all 0.3s',

      '&.antd-theme-editor-panel-alias-open': {
        flex: '0 0 min(860px, 100%)',
      },
    },

    '.antd-theme-editor-preview': {
      flex: 1,
      minWidth: 0,
      overflow: 'auto',
    },

    '@media (max-width: 991px)': {
      flexDirection: 'column',
      height: 'auto !important',
      minHeight: 'calc(100vh - 120px)',

      '.antd-theme-editor-panel, .antd-theme-editor-panel.antd-theme-editor-panel-alias-open': {
        flex: 'none',
        width: '100%',
        maxWidth: '100%',
        height: 'auto',
        maxHeight: '65vh',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      },

      '.antd-theme-editor-preview': {
        flex: 'none',
        width: '100%',
        overflow: 'visible',
      },
    },
  },
}));

const defaultTheme: Theme = {
  name: '默认主题',
  key: 'default',
  config: {},
};

export type ThemeEditorProps = {
  /**
   * @deprecated
   * @default true
   */
  simple?: boolean;
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;
  darkAlgorithm?: DerivativeFunc<any, any>;
  locale?: Locale;
};

const ThemeEditorInner = defineComponent({
  name: 'ThemeEditorInner',
  inheritAttrs: false,
  props: {
    simple: { type: Boolean },
    theme: { type: Object as PropType<Theme> },
    onThemeChange: { type: Function as PropType<(theme: Theme) => void> },
    darkAlgorithm: { type: Function as PropType<DerivativeFunc<any, any>> },
    locale: { type: Object as PropType<Locale>, default: zhCN },
  },
  setup(props, { attrs, expose }) {
    const { theme: customTheme, darkAlgorithm, locale } = toRefs(props);

    const [wrapSSR, hashId] = useStyle();

    const selectedTokens = ref<SelectedToken>({
      seed: ['colorPrimary'],
    });

    const aliasOpen = ref<boolean>(false);

    const { theme, infoFollowPrimary, onInfoFollowPrimaryChange, updateRef } = useControlledTheme({
      theme: customTheme,
      defaultTheme,
      onChange: props.onThemeChange,
      darkAlgorithm,
    });

    const handleTokenSelect: TokenPanelProProps['onTokenSelect'] = (token, type) => {
      const tokens = typeof token === 'string' ? (token ? [token] : []) : token;
      if (type === 'seed') {
        return {
          seed: tokens,
        };
      }

      let newSelectedTokens = { ...selectedTokens.value };
      tokens.forEach(newToken => {
        newSelectedTokens = {
          ...selectedTokens.value,
          [type]: selectedTokens.value[type]?.includes(newToken)
            ? selectedTokens.value[type]?.filter(t => t !== newToken)
            : [...(selectedTokens.value[type] ?? []), newToken],
        };
      });
      if (type === 'map') {
        delete newSelectedTokens.alias;
      }
      selectedTokens.value = newSelectedTokens;
    };

    const computedSelectedTokens = computed(() => {
      if (
        selectedTokens.value.seed?.length &&
        !selectedTokens.value.map?.length &&
        !selectedTokens.value.alias?.length
      ) {
        return [
          ...selectedTokens.value.seed,
          ...((seedRelatedMap as any)[selectedTokens.value.seed[0]] ?? []),
          ...((seedRelatedAlias as any)[selectedTokens.value.seed[0]] ?? []),
        ];
      }
      if (selectedTokens.value.map?.length && !selectedTokens.value.alias?.length) {
        return [
          ...selectedTokens.value.map,
          ...selectedTokens.value.map.reduce((result, item) => {
            return result.concat((mapRelatedAlias as any)[item]);
          }, []),
        ];
      }
      if (selectedTokens.value.alias?.length) {
        return [...selectedTokens.value.alias];
      }
      return [];
    });

    const relatedComponents = computed(() => {
      return computedSelectedTokens.value ? getRelatedComponents(computedSelectedTokens.value) : [];
    });

    expose({
      updateRef,
    });

    useProvideLocaleContext(locale);

    return () => {
      return wrapSSR(
        <div {...attrs} class={classNames(hashId.value, 'antd-theme-editor', attrs.class)}>
          <div
            class={classNames('antd-theme-editor-panel', {
              'antd-theme-editor-panel-alias-open': aliasOpen.value,
            })}
          >
            <TokenPanelPro
              aliasOpen={aliasOpen.value}
              onAliasOpenChange={open => (aliasOpen.value = open)}
              theme={theme.value}
              style={{ flex: 1, minWidth: 0 }}
              selectedTokens={selectedTokens.value}
              onTokenSelect={handleTokenSelect}
              infoFollowPrimary={infoFollowPrimary.value}
              onInfoFollowPrimaryChange={onInfoFollowPrimaryChange}
            />
          </div>
          <ComponentDemoPro
            theme={theme.value}
            components={antdComponents}
            activeComponents={relatedComponents.value}
            selectedTokens={computedSelectedTokens.value}
            class="antd-theme-editor-preview"
            componentDrawer
          />
        </div>,
      );
    };
  },
});

const ThemeEditor = defineComponent({
  name: 'ThemeEditor',
  inheritAttrs: false,
  props: {
    simple: { type: Boolean },
    theme: { type: Object as PropType<Theme> },
    onThemeChange: { type: Function as PropType<(theme: Theme) => void> },
    darkAlgorithm: { type: Function as PropType<DerivativeFunc<any, any>> },
    locale: { type: Object as PropType<Locale>, default: zhCN },
  },
  setup(props, { attrs, expose }) {
    const innerRef = ref<{ updateRef?: () => void } | null>(null);
    const siteThemeMode = inject<{ theme?: Ref<string> } | null>('themeMode', null);

    const shellTheme = computed(() => {
      if (!siteThemeMode) {
        return null;
      }
      return {
        inherit: false,
        cssVar: false,
        algorithm: siteThemeMode.theme?.value === 'dark' ? antdDarkAlgorithm : defaultAlgorithm,
      };
    });

    expose({
      updateRef: () => innerRef.value?.updateRef?.(),
    });

    return () => {
      const inner = <ThemeEditorInner ref={innerRef} {...props} {...attrs} />;
      if (shellTheme.value) {
        return <ConfigProvider theme={shellTheme.value}>{inner}</ConfigProvider>;
      }
      return inner;
    };
  },
});

export default ThemeEditor;
