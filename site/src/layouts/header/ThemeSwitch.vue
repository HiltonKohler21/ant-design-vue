<template>
  <a-dropdown
    v-model:open="open"
    placement="bottomRight"
    trigger="click"
    :overlay-style="{ zIndex: 1050 }"
  >
    <a-tooltip :title="isZhCN ? '主题设置' : 'Theme Settings'" placement="bottom">
      <a-button
        type="text"
        class="header-button header-icon-btn theme-switch-btn"
        :class="{ active: open }"
        :aria-label="isZhCN ? '主题设置' : 'Theme Settings'"
      >
        <ThemeIcon style="font-size: 16px" />
      </a-button>
    </a-tooltip>
    <template #overlay>
      <div class="theme-switch-dropdown">
        <div class="theme-menu-item" @click="handleSelectTheme('system')">
          <span class="theme-menu-icon">
            <SyncOutlined />
          </span>
          <span class="theme-menu-title">{{ isZhCN ? '跟随系统' : 'Follow System' }}</span>
          <span v-if="currentSetting === 'system'" class="theme-dot" />
        </div>
        <div class="theme-menu-item" @click="handleSelectTheme('light')">
          <span class="theme-menu-icon">
            <Light style="font-size: 14px" />
          </span>
          <span class="theme-menu-title">{{ isZhCN ? '浅色主题' : 'Light Theme' }}</span>
          <span v-if="currentSetting === 'light'" class="theme-dot" />
        </div>
        <div class="theme-menu-item" @click="handleSelectTheme('dark')">
          <span class="theme-menu-icon">
            <Dark style="font-size: 14px" />
          </span>
          <span class="theme-menu-title">{{ isZhCN ? '暗黑主题' : 'Dark Theme' }}</span>
          <span v-if="currentSetting === 'dark'" class="theme-dot" />
        </div>

        <div class="theme-menu-divider" />

        <div class="theme-menu-item" @click="handleToggleCompact">
          <span class="theme-menu-icon">
            <Compact style="font-size: 14px" />
          </span>
          <span class="theme-menu-title">{{ isZhCN ? '紧凑主题' : 'Compact Theme' }}</span>
          <span v-if="isCompact" class="theme-dot" />
        </div>

        <div class="theme-menu-item" @click="handleToggleHappyWork">
          <span class="theme-menu-icon">
            <SmileOutlined />
          </span>
          <span class="theme-menu-title">{{ isZhCN ? '快乐工作特效' : 'Happy Work Effect' }}</span>
          <span v-if="isHappyWork" class="theme-dot" />
        </div>

        <div class="theme-menu-divider" />

        <div class="theme-color-section">
          <div class="theme-color-label">
            <span>{{ isZhCN ? '主题色' : 'Primary Color' }}</span>
            <button
              v-if="activeColor && activeColor !== '#1677ff'"
              type="button"
              class="theme-color-reset"
              @click.stop="handleSelectColor('')"
            >
              {{ isZhCN ? '重置' : 'Reset' }}
            </button>
          </div>
          <div class="theme-color-swatches">
            <a-tooltip
              v-for="preset in colorPresets"
              :key="preset.color"
              :title="isZhCN ? preset.zh : preset.en"
            >
              <button
                type="button"
                class="theme-color-swatch"
                :class="{ selected: isColorSelected(preset.color) }"
                :style="{ backgroundColor: preset.color }"
                :aria-label="isZhCN ? preset.zh : preset.en"
                @click.stop="handleSelectColor(preset.color === '#1677ff' ? '' : preset.color)"
              >
                <CheckOutlined v-if="isColorSelected(preset.color)" class="swatch-check" />
              </button>
            </a-tooltip>
          </div>
        </div>

        <div class="theme-menu-divider" />

        <div class="theme-menu-item" @click="handleOpenThemeEditor">
          <span class="theme-menu-icon">
            <ThemeEditorIcon style="font-size: 14px" />
          </span>
          <span class="theme-menu-title">{{ isZhCN ? '主题编辑器' : 'Theme Editor' }}</span>
          <RightOutlined class="theme-menu-link-icon" />
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { CheckOutlined, RightOutlined, SmileOutlined, SyncOutlined } from '@ant-design/icons-vue';
import ThemeIcon from '../icons/ThemeIcon.vue';
import Light from '../icons/Light';
import Dark from '../icons/Dark';
import Compact from '../icons/Compact';
import ThemeEditorIcon from '../icons/ThemeEditorIcon';
import { GLOBAL_CONFIG } from '../../SymbolKey';
import type { GlobalConfig } from '../../type';

const COLOR_PRESETS = [
  { color: '#1677ff', zh: '拂晓蓝（默认）', en: 'Daybreak Blue (Default)' },
  { color: '#722ed1', zh: '酱紫', en: 'Golden Purple' },
  { color: '#13c2c2', zh: '明青', en: 'Cyan' },
  { color: '#00b96b', zh: '极光绿', en: 'Emerald Green' },
  { color: '#eb2f96', zh: '法式洋红', en: 'Magenta' },
  { color: '#f5222d', zh: '薄暮红', en: 'Dust Red' },
  { color: '#fa8c16', zh: '日暮橙', en: 'Sunset Orange' },
];

export default defineComponent({
  name: 'ThemeSwitch',
  components: {
    ThemeIcon,
    Light,
    Dark,
    Compact,
    ThemeEditorIcon,
    SyncOutlined,
    SmileOutlined,
    CheckOutlined,
    RightOutlined,
  },
  setup() {
    const router = useRouter();
    const open = ref(false);
    const globalConfig = inject<GlobalConfig>(GLOBAL_CONFIG);
    const isZhCN = computed(() => globalConfig?.isZhCN?.value ?? true);
    const themeMode = inject<any>('themeMode', {});

    const currentSetting = computed(() => {
      return themeMode?.themeSetting?.value || themeMode?.theme?.value || 'light';
    });

    const isCompact = computed(() => {
      return themeMode?.compactTheme?.value === 'compact';
    });

    const isHappyWork = computed(() => {
      return !!themeMode?.happyWork?.value;
    });

    const activeColor = computed(() => {
      return themeMode?.primaryColor?.value || '';
    });

    const isColorSelected = (hex: string) => {
      if (!activeColor.value) {
        return hex === '#1677ff';
      }
      return activeColor.value.toLowerCase() === hex.toLowerCase();
    };

    const handleSelectTheme = (mode: string) => {
      themeMode?.changeTheme?.(mode);
      open.value = false;
    };

    const handleToggleCompact = () => {
      const next = isCompact.value ? '' : 'compact';
      themeMode?.changeCompactTheme?.(next);
      open.value = false;
    };

    const handleToggleHappyWork = () => {
      themeMode?.toggleHappyWork?.();
      open.value = false;
    };

    const handleSelectColor = (color: string) => {
      themeMode?.changePrimaryColor?.(color);
    };

    const handleOpenThemeEditor = () => {
      open.value = false;
      router.push(isZhCN.value ? '/theme-editor-cn' : '/theme-editor');
    };

    return {
      open,
      isZhCN,
      currentSetting,
      isCompact,
      isHappyWork,
      activeColor,
      colorPresets: COLOR_PRESETS,
      isColorSelected,
      handleSelectTheme,
      handleToggleCompact,
      handleToggleHappyWork,
      handleSelectColor,
      handleOpenThemeEditor,
    };
  },
});
</script>

<style lang="less" scoped>
.theme-switch-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 6px;
  color: var(--site-text-color);

  &.active {
    color: var(--primary-color);
    background-color: var(--site-hover-bg, rgba(0, 0, 0, 0.04));
  }
}

.theme-switch-dropdown {
  min-width: 212px;
  padding: 6px;
  border-radius: 10px;
  background-color: var(--color-bg-elevated, var(--component-background));
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--site-border-color-split);

  .theme-menu-item {
    display: flex;
    align-items: center;
    padding: 7px 12px;
    border-radius: 6px;
    font-size: 13px;
    color: var(--site-text-color);
    cursor: pointer;
    transition: background-color 0.2s;
    user-select: none;

    &:hover {
      background-color: var(--site-hover-bg, rgba(0, 0, 0, 0.04));
    }

    .theme-menu-icon {
      margin-inline-end: 10px;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      color: var(--site-text-color-secondary);
    }

    .theme-menu-title {
      flex: 1;
      white-space: nowrap;
    }

    .theme-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--primary-color, #1677ff);
      margin-inline-start: 12px;
      flex-shrink: 0;
    }

    .theme-menu-link-icon {
      font-size: 11px;
      color: var(--site-text-color-secondary);
      margin-inline-start: 12px;
    }
  }

  .theme-menu-divider {
    height: 1px;
    margin: 6px 4px;
    background-color: var(--site-border-color-split);
  }

  .theme-color-section {
    padding: 6px 12px 8px;

    .theme-color-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: var(--site-text-color-secondary);
      margin-bottom: 8px;
    }

    .theme-color-reset {
      border: 0;
      padding: 0;
      background: transparent;
      color: var(--primary-color);
      font-size: 12px;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }

    .theme-color-swatches {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .theme-color-swatch {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      cursor: pointer;
      transition: transform 0.18s ease, box-shadow 0.18s ease;

      &:hover {
        transform: scale(1.14);
      }

      &.selected {
        box-shadow: 0 0 0 2px var(--component-background), 0 0 0 4px var(--primary-color);
      }

      .swatch-check {
        color: #fff;
        font-size: 11px;
        line-height: 1;
      }
    }
  }
}
</style>
