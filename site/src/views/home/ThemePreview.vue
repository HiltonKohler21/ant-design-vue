<template>
  <section class="home-section home-theme-section">
    <div class="home-container">
      <div class="home-section-header">
        <h2 class="home-section-title">
          {{ isZhCN ? '定制主题，随心所欲' : 'Flexible theme customization' }}
        </h2>
        <p class="home-section-subtitle">
          {{
            isZhCN
              ? 'Ant Design Vue 开放更多样式算法，内置 CSS Variables 零开销切换，让你更容易定制品牌主题'
              : 'Ant Design Vue opens more style algorithms with native CSS Variables, making brand theming effortless'
          }}
        </p>
      </div>

      <div class="home-theme-controls">
        <!-- Preset Themes -->
        <div class="home-theme-control-group">
          <span class="home-theme-control-label">
            {{ isZhCN ? '预设风格' : 'Presets' }}
          </span>
          <div class="home-theme-presets">
            <button
              v-for="preset in presets"
              :key="preset.key"
              type="button"
              class="home-theme-preset-btn"
              :class="{ active: activePreset === preset.key }"
              @click="selectPreset(preset)"
            >
              <span
                class="home-theme-preset-dot"
                :style="{
                  background: preset.previewBg,
                  borderColor: preset.colorPrimary,
                }"
              >
                <span
                  class="home-theme-preset-inner"
                  :style="{ background: preset.colorPrimary }"
                />
              </span>
              <span>{{ isZhCN ? preset.zh : preset.en }}</span>
            </button>
          </div>
        </div>

        <!-- Primary Colors + Radius + Editor Link -->
        <div class="home-theme-control-bar">
          <div class="home-theme-control-group">
            <span class="home-theme-control-label">
              {{ isZhCN ? '品牌主色' : 'Primary Color' }}
            </span>
            <div class="home-theme-swatches">
              <button
                v-for="swatch in colorSwatches"
                :key="swatch.color"
                type="button"
                class="home-theme-swatch"
                :class="{ active: primaryColor === swatch.color }"
                :style="{ backgroundColor: swatch.color }"
                :title="isZhCN ? swatch.zh : swatch.en"
                :aria-label="isZhCN ? swatch.zh : swatch.en"
                @click="primaryColor = swatch.color"
              >
                <CheckOutlined v-if="primaryColor === swatch.color" />
              </button>
            </div>
          </div>

          <div class="home-theme-control-group">
            <span class="home-theme-control-label">
              {{ isZhCN ? '圆角' : 'Radius' }}
            </span>
            <div class="home-theme-radius-group">
              <button
                v-for="opt in radiusOptions"
                :key="opt.value"
                type="button"
                class="home-theme-radius-btn"
                :class="{ active: borderRadius === opt.value }"
                @click="borderRadius = opt.value"
              >
                {{ isZhCN ? opt.zh : opt.en }}
              </button>
            </div>
          </div>

          <router-link
            :to="isZhCN ? '/theme-editor-cn' : '/theme-editor'"
            class="home-theme-editor-link"
          >
            <BgColorsOutlined />
            <span>{{ isZhCN ? '主题编辑器' : 'Theme Editor' }}</span>
            <ArrowRightOutlined />
          </router-link>
        </div>
      </div>

      <!-- Isolated Nested ConfigProvider Preview -->
      <div class="home-theme-stage-wrap">
        <a-config-provider :theme="previewTheme">
          <ThemePreviewStage :is-zh-c-n="isZhCN" :preset-label="activePresetLabel" />
        </a-config-provider>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { theme as antdTheme } from 'ant-design-vue';
import { ArrowRightOutlined, BgColorsOutlined, CheckOutlined } from '@ant-design/icons-vue';
import ThemePreviewStage from './ThemePreviewStage.vue';

const props = defineProps<{
  isZhCN: boolean;
}>();

interface ThemePreset {
  key: string;
  zh: string;
  en: string;
  colorPrimary: string;
  borderRadius: number;
  dark: boolean;
  compact: boolean;
  previewBg: string;
}

const presets: ThemePreset[] = [
  {
    key: 'default',
    zh: '默认主题',
    en: 'Default',
    colorPrimary: '#1677ff',
    borderRadius: 6,
    dark: false,
    compact: false,
    previewBg: '#f5f8ff',
  },
  {
    key: 'dark',
    zh: '暗黑模式',
    en: 'Dark',
    colorPrimary: '#1677ff',
    borderRadius: 6,
    dark: true,
    compact: false,
    previewBg: '#141414',
  },
  {
    key: 'compact',
    zh: '紧凑模式',
    en: 'Compact',
    colorPrimary: '#1677ff',
    borderRadius: 4,
    dark: false,
    compact: true,
    previewBg: '#eef4ff',
  },
  {
    key: 'geek',
    zh: '极客蓝绿',
    en: 'Geek',
    colorPrimary: '#13c2c2',
    borderRadius: 2,
    dark: true,
    compact: false,
    previewBg: '#0d1b24',
  },
  {
    key: 'cartoon',
    zh: '圆润卡通',
    en: 'Cartoon',
    colorPrimary: '#eb2f96',
    borderRadius: 14,
    dark: false,
    compact: false,
    previewBg: '#fff0f6',
  },
];

const colorSwatches = [
  { color: '#1677ff', zh: '拂晓蓝', en: 'Daybreak Blue' },
  { color: '#722ed1', zh: '酱紫', en: 'Golden Purple' },
  { color: '#00b96b', zh: '极光绿', en: 'Polar Green' },
  { color: '#fa8c16', zh: '日暮橙', en: 'Sunset Orange' },
  { color: '#eb2f96', zh: '法式洋红', en: 'Magenta' },
];

const radiusOptions = [
  { value: 2, zh: '硬朗 2px', en: 'Sharp 2px' },
  { value: 6, zh: '标准 6px', en: 'Default 6px' },
  { value: 14, zh: '圆润 14px', en: 'Round 14px' },
];

const activePreset = ref<string>('default');
const primaryColor = ref<string>('#1677ff');
const borderRadius = ref<number>(6);
const isDarkPreset = ref<boolean>(false);
const isCompactPreset = ref<boolean>(false);

const selectPreset = (preset: ThemePreset) => {
  activePreset.value = preset.key;
  primaryColor.value = preset.colorPrimary;
  borderRadius.value = preset.borderRadius;
  isDarkPreset.value = preset.dark;
  isCompactPreset.value = preset.compact;
};

const activePresetLabel = computed(() => {
  const found = presets.find(p => p.key === activePreset.value) || presets[0];
  return props.isZhCN ? found.zh : found.en;
});

const previewTheme = computed(() => {
  const algorithms = [isDarkPreset.value ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm];
  if (isCompactPreset.value) {
    algorithms.push(antdTheme.compactAlgorithm);
  }
  return {
    inherit: false,
    algorithm: algorithms,
    token: {
      colorPrimary: primaryColor.value,
      borderRadius: borderRadius.value,
    },
  };
});
</script>
