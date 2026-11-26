<template>
  <Navigation @langChange="onLangChange" @directionChange="onDirectionChange" />
  <template v-if="isMobile">
    <div class="mobile-header-tools">
      <a-select
        key="mobile-version"
        class="version mobile-version-select"
        size="small"
        :value="antdVersion"
        :dropdown-match-select-width="false"
        :aria-label="isZhCN ? '切换版本' : 'Switch version'"
        @change="handleVersionChange"
      >
        <a-select-option :value="antdVersion">{{ antdVersion }}</a-select-option>
        <a-select-option value="3x">3.x</a-select-option>
        <a-select-option value="2x">2.x (Not Recommended)</a-select-option>
        <a-select-option value="1x">1.x (For Vue 2)</a-select-option>
      </a-select>
      <ThemeSwitch />
    </div>
    <Ecosystem />
  </template>
  <template v-else>
    <div class="header-toolbar">
      <a-select
        key="version"
        class="version"
        size="small"
        :value="antdVersion"
        :dropdown-match-select-width="false"
        @change="handleVersionChange"
      >
        <a-select-option :value="antdVersion">{{ antdVersion }}</a-select-option>
        <a-select-option value="3x">3.x</a-select-option>
        <a-select-option value="2x">2.x (Not Recommended)</a-select-option>
        <a-select-option value="1x">1.x (For Vue 2)</a-select-option>
      </a-select>

      <a-tooltip :title="isZhCN ? 'Switch to English' : '切换至中文'" placement="bottom">
        <a-button
          key="lang-button"
          type="text"
          class="header-button header-pill-btn header-lang-button"
          @click="onLangChange"
        >
          {{ isZhCN ? 'En' : '中' }}
        </a-button>
      </a-tooltip>

      <a-tooltip
        :title="
          direction === 'rtl'
            ? isZhCN
              ? '切换为 LTR'
              : 'Switch to LTR'
            : isZhCN
            ? '切换为 RTL'
            : 'Switch to RTL'
        "
        placement="bottom"
      >
        <a-button
          key="direction-button"
          type="text"
          class="header-button header-pill-btn header-rtl-button"
          :class="{ active: direction === 'rtl' }"
          :aria-label="direction === 'rtl' ? 'Switch to LTR' : 'Switch to RTL'"
          @click="onDirectionChange"
        >
          {{ direction === 'rtl' ? 'RTL' : 'LTR' }}
        </a-button>
      </a-tooltip>

      <ThemeSwitch />
      <Github />
    </div>
  </template>
</template>
<script lang="ts">
import { computed, defineComponent, inject, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { version } from '@hiltonkohler21/ant-design-vue';
import Github from './Github.vue';
import Navigation from './Navigation.vue';
import Ecosystem from './Ecosystem.vue';
import ThemeSwitch from './ThemeSwitch.vue';
import { GLOBAL_CONFIG } from '../../SymbolKey';
import type { GlobalConfig } from '../../type';
import { getLocalizedPathname } from '../../utils/util';

export default defineComponent({
  name: 'HeaderMenu',
  components: {
    Navigation,
    Github,
    Ecosystem,
    ThemeSwitch,
  },
  props: ['isMobile'],
  setup() {
    const antdVersion = ref(version);
    const route = useRoute();
    const router = useRouter();
    const globalConfig = inject<GlobalConfig>(GLOBAL_CONFIG);
    const isZhCN = computed(() => globalConfig?.isZhCN?.value ?? false);
    const direction = computed(() => globalConfig?.direction?.value ?? 'ltr');

    const onLangChange = () => {
      const nextIsZhCN = !isZhCN.value;
      localStorage.setItem('locale', nextIsZhCN ? 'zh-CN' : 'en-US');
      const normalizedPath = route.path.replace(/\/$/, '') || '/';
      const localized = getLocalizedPathname(normalizedPath, nextIsZhCN, route.query);
      router.push({
        path: localized.path,
        query: localized.query,
        hash: route.hash,
      });
    };

    const onDirectionChange = () => {
      const next = direction.value === 'rtl' ? 'ltr' : 'rtl';
      globalConfig?.changeDirection?.(next);
    };

    const handleVersionChange = (v: string) => {
      if (v && v !== antdVersion.value) {
        window.location.href = 'https://hiltonkohler21.github.io/ant-design-vue/';
      }
    };

    return {
      isZhCN,
      direction,
      onLangChange,
      onDirectionChange,
      antdVersion,
      handleVersionChange,
    };
  },
});
</script>
<style lang="less" scoped>
.header-toolbar {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: none;

  .version {
    min-width: 78px;
    margin-inline-end: 2px;
  }

  .header-pill-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 0 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    color: var(--site-text-color);

    &:hover {
      background-color: var(--site-hover-bg, rgba(0, 0, 0, 0.04));
      color: var(--site-text-color);
    }

    &.active {
      color: var(--primary-color);
      background-color: var(--primary-color-bg, rgba(22, 119, 255, 0.08));
    }
  }
}

.mobile-header-tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 20px;
  border-top: 1px solid var(--site-border-color-split);
  border-bottom: 1px solid var(--site-border-color-split);

  .mobile-version-select {
    min-width: 96px;
  }
}
</style>
