<template>
  <a-dropdown
    v-model:open="open"
    placement="bottomRight"
    trigger="click"
    :overlay-style="{ zIndex: 1050 }"
  >
    <a-button
      size="small"
      class="header-button header-icon-btn theme-switch-btn"
      :class="{ active: open }"
      :title="isZhCN ? '主题设置' : 'Theme Settings'"
    >
      <ThemeIcon style="font-size: 15px" />
    </a-button>
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
            <Light style="font-size: 13px" />
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

        <div class="theme-menu-divider" />

        <div class="theme-menu-item" @click="handleToggleHappyWork">
          <span class="theme-menu-icon">
            <ClockCircleOutlined />
          </span>
          <span class="theme-menu-title">{{ isZhCN ? '快乐工作特效' : 'Happy Work Effect' }}</span>
          <span v-if="isHappyWork" class="theme-dot" />
        </div>

        <div class="theme-menu-divider" />

        <div class="theme-menu-item" @click="handleOpenAiTheme">
          <span class="theme-menu-icon">
            <RobotOutlined />
          </span>
          <span class="theme-menu-title">{{ isZhCN ? 'AI 生成主题' : 'AI Theme' }}</span>
        </div>

        <div class="theme-menu-item" @click="handleOpenThemeEditor">
          <span class="theme-menu-icon">
            <ThemeEditorIcon style="font-size: 14px" />
          </span>
          <span class="theme-menu-title">{{ isZhCN ? '主题编辑器' : 'Theme Editor' }}</span>
          <LinkOutlined class="theme-menu-link-icon" />
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<script lang="ts">
import { defineComponent, inject, ref, computed } from 'vue';
import {
  SyncOutlined,
  ClockCircleOutlined,
  RobotOutlined,
  LinkOutlined,
} from '@ant-design/icons-vue';
import ThemeIcon from '../icons/ThemeIcon.vue';
import Light from '../icons/Light';
import Dark from '../icons/Dark';
import Compact from '../icons/Compact';
import ThemeEditorIcon from '../icons/ThemeEditorIcon';
import { GLOBAL_CONFIG } from '../../SymbolKey';
import type { GlobalConfig } from '../../type';

export default defineComponent({
  name: 'ThemeSwitch',
  components: {
    ThemeIcon,
    Light,
    Dark,
    Compact,
    ThemeEditorIcon,
    SyncOutlined,
    ClockCircleOutlined,
    RobotOutlined,
    LinkOutlined,
  },
  setup() {
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

    const handleOpenAiTheme = () => {
      open.value = false;
      const url = isZhCN.value ? '/theme-editor-cn' : '/theme-editor';
      window.open(url, '_blank');
    };

    const handleOpenThemeEditor = () => {
      open.value = false;
      const url = isZhCN.value ? '/theme-editor-cn' : '/theme-editor';
      window.open(url, '_blank');
    };

    return {
      open,
      isZhCN,
      currentSetting,
      isCompact,
      isHappyWork,
      handleSelectTheme,
      handleToggleCompact,
      handleToggleHappyWork,
      handleOpenAiTheme,
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
  width: 28px;
  height: 24px;
  padding: 0;

  &.active {
    color: var(--primary-color);
    border-color: var(--primary-color);
  }
}

.theme-switch-dropdown {
  min-width: 176px;
  padding: 6px 0;
  border-radius: 8px;
  background-color: var(--component-background);
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--site-border-color-split);

  .theme-menu-item {
    display: flex;
    align-items: center;
    padding: 7px 16px;
    font-size: 14px;
    color: var(--site-text-color);
    cursor: pointer;
    transition: background 0.2s;
    user-select: none;

    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    html[data-doc-theme='dark'] &:hover {
      background-color: rgba(255, 255, 255, 0.08);
    }

    .theme-menu-icon {
      margin-right: 12px;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      color: var(--site-text-color);
    }

    .theme-menu-title {
      flex: 1;
      white-space: nowrap;
    }

    .theme-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #1677ff;
      margin-left: 14px;
      flex-shrink: 0;
    }

    .theme-menu-link-icon {
      font-size: 12px;
      color: var(--site-text-color-secondary);
      margin-left: 14px;
    }
  }

  .theme-menu-divider {
    height: 1px;
    margin: 5px 0;
    background-color: var(--site-border-color-split);
  }
}
</style>
