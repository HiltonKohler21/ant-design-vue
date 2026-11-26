import {
  Button,
  ConfigProvider,
  message,
  Segmented,
  Space,
  theme as antdTheme,
} from '@hiltonkohler21/ant-design-vue';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons-vue';
import type { ThemeConfig } from '@hiltonkohler21/ant-design-vue/es/config-provider/context';
import type { MutableTheme } from '../interface';
import type { PropType, CSSProperties } from 'vue';
import { defineComponent, onBeforeUnmount, toRefs, ref, computed } from 'vue';
import ComponentDemoGroup from '../component-panel/ComponentDemoGroup';
import { useInjectLocaleContext } from '../locale';
import { Error, Primary, Success, Warning } from '../overviews';

function formatVueThemeConfigSnippet(config: ThemeConfig = {}): string {
  const algorithms: string[] = [];
  const rawAlgo = config.algorithm;
  const algoList = Array.isArray(rawAlgo) ? rawAlgo : rawAlgo ? [rawAlgo] : [];
  algoList.forEach(fn => {
    if (fn === antdTheme.darkAlgorithm) algorithms.push('theme.darkAlgorithm');
    else if (fn === antdTheme.compactAlgorithm) algorithms.push('theme.compactAlgorithm');
    else if (fn === antdTheme.defaultAlgorithm) algorithms.push('theme.defaultAlgorithm');
  });

  const serializable: Record<string, any> = {};
  if (config.token && Object.keys(config.token).length > 0) {
    serializable.token = config.token;
  }
  if (config.components && Object.keys(config.components).length > 0) {
    serializable.components = config.components;
  }
  if (config.hashed !== undefined) {
    serializable.hashed = config.hashed;
  }
  if (config.cssVar !== undefined) {
    serializable.cssVar = config.cssVar;
  }

  const scriptClose = '</' + 'script>';

  if (algorithms.length === 0) {
    const jsonStr = JSON.stringify(serializable, null, 2);
    return `<template>\n  <a-config-provider :theme="themeConfig">\n    <App />\n  </a-config-provider>\n</template>\n\n<script setup lang="ts">\nconst themeConfig = ${jsonStr};\n${scriptClose}`;
  }

  const algoExpr = algorithms.length === 1 ? algorithms[0] : `[${algorithms.join(', ')}]`;
  const entries: string[] = [`  algorithm: ${algoExpr},`];
  Object.entries(serializable).forEach(([k, v]) => {
    const formatted = JSON.stringify(v, null, 2).replace(/\n/g, '\n  ');
    entries.push(`  ${k}: ${formatted},`);
  });

  return `<template>\n  <a-config-provider :theme="themeConfig">\n    <App />\n  </a-config-provider>\n</template>\n\n<script setup lang="ts">\nimport { theme } from '@hiltonkohler21/ant-design-vue';\n\nconst themeConfig = {\n${entries.join(
    '\n',
  )}\n};\n${scriptClose}`;
}

async function copyText(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback below
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export type ComponentDemoProProps = {
  selectedTokens?: string[];
  theme: MutableTheme;
  components: Record<string, string[]>;
  activeComponents?: string[];
  componentDrawer?: boolean;
  showAll?: boolean;
};

const ComponentDemoPro = defineComponent({
  name: 'ComponentDemoPro',
  inheritAttrs: false,
  props: {
    selectedTokens: { type: Array as PropType<string[]> },
    theme: { type: Object as PropType<MutableTheme> },
    components: { type: Object as PropType<Record<string, string[]>> },
    activeComponents: { type: Array as PropType<string[]> },
    componentDrawer: { type: Boolean },
    showAll: { type: Boolean },
  },
  setup(props, { attrs }) {
    const { selectedTokens, theme, components, activeComponents, componentDrawer, showAll } =
      toRefs(props);

    const mode = ref<'overview' | 'component'>('overview');
    const copied = ref(false);
    let copyTimer: ReturnType<typeof setTimeout> | null = null;

    const { token } = antdTheme.useToken();

    const locale = useInjectLocaleContext();

    const handleCopyVueConfig = async () => {
      const snippet = formatVueThemeConfigSnippet(theme.value?.config);
      const ok = await copyText(snippet);
      if (ok) {
        copied.value = true;
        message.success(
          locale.value.copiedVueConfig ||
            (locale.value._lang === 'zh-CN' ? '已复制 Vue 主题配置' : 'Vue config copied'),
        );
        if (copyTimer) clearTimeout(copyTimer);
        copyTimer = setTimeout(() => {
          copied.value = false;
        }, 2000);
      }
    };

    onBeforeUnmount(() => {
      if (copyTimer) clearTimeout(copyTimer);
    });

    const overviewDemo = computed(() => {
      if (showAll.value) {
        return (
          <Space direction="vertical">
            <Primary />
            <Success />
            <Error />
            <Warning />
          </Space>
        );
      }
      if (selectedTokens.value?.includes('colorError')) {
        return <Error />;
      }
      if (selectedTokens.value?.includes('colorSuccess')) {
        return <Success />;
      }
      if (selectedTokens.value?.includes('colorWarning')) {
        return <Warning />;
      }
      return <Primary />;
    });

    return () => {
      const copyLabel =
        locale.value.copyVueConfig ||
        (locale.value._lang === 'zh-CN' ? '复制 Vue 配置' : 'Copy Vue Config');

      return (
        <div
          {...attrs}
          style={{
            ...(attrs.style as CSSProperties),
            background: token.value.colorBgLayout,
            paddingBottom: '24px',
          }}
        >
          <div style={{ margin: 'auto', maxWidth: '960px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '12px 12px 0',
              }}
            >
              <Segmented
                options={[
                  { value: 'overview', label: locale.value.demo.overview },
                  { value: 'component', label: locale.value.demo.components },
                ]}
                value={mode.value}
                onChange={val => (mode.value = val as any)}
              />
              <Button
                size="small"
                icon={copied.value ? <CheckOutlined /> : <CopyOutlined />}
                onClick={handleCopyVueConfig}
              >
                {copyLabel}
              </Button>
            </div>

            <ConfigProvider
              theme={{
                components: {
                  Select: {
                    zIndexPopup: 10,
                  },
                  DatePicker: {
                    zIndexPopup: 10,
                  },
                  Dropdown: {
                    zIndexPopup: 10,
                  },
                  Mentions: {
                    zIndexPopup: 10,
                  },
                  Tooltip: {
                    zIndexPopup: 10,
                  },
                  Popover: {
                    zIndexPopup: 10,
                  },
                  Popconfirm: {
                    zIndexPopup: 10,
                  },
                },
              }}
            >
              {mode.value === 'overview' ? (
                <div style={{ margin: '12px' }}>{overviewDemo.value}</div>
              ) : (
                <ComponentDemoGroup
                  selectedTokens={selectedTokens.value}
                  themes={[theme.value]}
                  components={components.value}
                  activeComponents={activeComponents.value}
                  componentDrawer={componentDrawer.value}
                  hideTokens
                />
              )}
            </ConfigProvider>
          </div>
        </div>
      );
    };
  },
});

export default defineComponent({
  name: 'ComponentDemoProProvider',
  inheritAttrs: false,
  props: {
    selectedTokens: { type: Array as PropType<string[]> },
    theme: { type: Object as PropType<MutableTheme> },
    components: { type: Object as PropType<Record<string, string[]>> },
    activeComponents: { type: Array as PropType<string[]> },
    componentDrawer: { type: Boolean },
    showAll: { type: Boolean },
  },
  setup(props, { attrs }) {
    return () => (
      <ConfigProvider theme={{ inherit: false, cssVar: false, ...props.theme.config }}>
        <ComponentDemoPro {...props} {...attrs} />
      </ConfigProvider>
    );
  },
});
