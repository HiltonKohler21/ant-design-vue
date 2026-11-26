<template>
  <a-menu
    id="nav"
    class="menu-site"
    :mode="menuMode"
    :selected-keys="activeMenuItem ? [activeMenuItem] : []"
    disabled-overflow
  >
    <a-menu-item key="design">
      <router-link :to="getLocalizedPathname('/docs/vue/design', isZhCN)">
        {{ isZhCN ? '设计' : 'Design' }}
      </router-link>
    </a-menu-item>
    <a-menu-item key="docs/vue">
      <router-link :to="getLocalizedPathname('/docs/vue/introduce', isZhCN)">
        {{ isZhCN ? '研发' : 'Development' }}
      </router-link>
    </a-menu-item>
    <a-menu-item key="components">
      <router-link :to="getLocalizedPathname('/components/overview', isZhCN)">
        {{ isZhCN ? '组件' : 'Components' }}
      </router-link>
    </a-menu-item>
    <a-menu-item key="for-agents">
      <router-link :to="getLocalizedPathname('/docs/vue/for-agents', isZhCN)">
        <span class="nav-agents-label">
          For Agents
          <a-tag color="blue" :bordered="false" class="nav-ai-tag">AI</a-tag>
        </span>
      </router-link>
    </a-menu-item>
    <template v-if="isMobile">
      <a-menu-item key="switch-lang" @click="$emit('langChange')">
        {{ $t('app.header.lang') }}
      </a-menu-item>
      <a-menu-item key="switch-rtl" @click="$emit('directionChange')">
        {{ direction === 'rtl' ? 'LTR' : 'RTL' }}
      </a-menu-item>
      <a-menu-item key="theme-editor">
        <router-link :to="isZhCN ? '/theme-editor-cn' : '/theme-editor'">
          {{ isZhCN ? '主题编辑器' : 'Theme Editor' }}
        </router-link>
      </a-menu-item>
      <a-menu-item key="github">
        <a
          href="https://github.com/HiltonKohler21/ant-design-vue"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </a-menu-item>
    </template>
  </a-menu>
</template>
<script lang="ts">
import type { GlobalConfig } from '../../type';
import { GLOBAL_CONFIG } from '../../SymbolKey';
import { getLocalizedPathname } from '../../utils/util';
import { computed, defineComponent, inject, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'HeaderNavigation',
  emits: ['langChange', 'directionChange'],
  setup() {
    const globalConfig = inject<GlobalConfig>(GLOBAL_CONFIG);
    const menuMode = computed(() => {
      return globalConfig?.isMobile?.value ? 'inline' : 'horizontal';
    });
    const route = useRoute();
    const activeMenuItem = ref('');

    watch(
      () => route.path,
      pathname => {
        if (pathname.includes('/design')) {
          activeMenuItem.value = 'design';
        } else if (pathname.includes('/for-agents') || pathname.includes('/mcp')) {
          activeMenuItem.value = 'for-agents';
        } else if (pathname.startsWith('/components')) {
          activeMenuItem.value = 'components';
        } else if (pathname.startsWith('/docs')) {
          activeMenuItem.value = 'docs/vue';
        } else {
          activeMenuItem.value = '';
        }
      },
      { immediate: true },
    );

    return {
      isMobile: globalConfig.isMobile,
      isZhCN: globalConfig.isZhCN,
      direction: globalConfig.direction,
      getLocalizedPathname,
      menuMode,
      activeMenuItem,
    };
  },
});
</script>
<style lang="less">
#nav {
  height: 100%;
  font-size: 14px;
  border: 0;
  background: transparent;

  &.ant-menu-horizontal {
    border-bottom: none;
    line-height: var(--header-height);

    & > .ant-menu-item,
    & > .ant-menu-submenu {
      min-width: 56px;
      height: var(--header-height);
      padding-inline: 14px;
      line-height: var(--header-height);
      top: 0;
      margin-top: 0;

      &::after {
        content: '';
        position: absolute;
        inset-inline: 14px;
        bottom: 0;
        top: auto;
        border-top: none !important;
        border-bottom: 2px solid transparent;
        transition: border-color 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      }

      &:hover::after,
      &.ant-menu-item-active::after,
      &.ant-menu-submenu-active::after,
      &.ant-menu-submenu-open::after {
        border-bottom-color: var(--primary-color) !important;
      }

      &.ant-menu-item-selected::after,
      &.ant-menu-submenu-selected::after {
        border-bottom-color: var(--primary-color) !important;
      }

      a {
        color: var(--site-text-color);
        transition: color 0.2s;
      }

      &:hover a {
        color: var(--primary-color);
      }

      &.ant-menu-item-selected a,
      &.ant-menu-submenu-selected a {
        color: var(--primary-color);
        font-weight: 500;
      }
    }

    & .ant-menu-submenu-title .anticon {
      margin: 0;
    }
  }

  & > .ant-menu-item,
  & > .ant-menu-submenu {
    text-align: center;
  }

  .nav-agents-label {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .nav-ai-tag {
    font-size: 10px;
    line-height: 15px;
    padding: 0 5px;
    margin-inline-start: 4px;
    margin-inline-end: 0;
    border-radius: 4px;
  }
}

.header-link {
  color: var(--site-text-color);
}

.ant-menu-item-active .header-link {
  color: var(--primary-color);
}

// Popover menu is only used for mobile
.popover-menu {
  width: 280px;

  .ant-popover-inner {
    padding: 0;
    overflow: hidden;
    background: var(--color-bg-elevated, var(--component-background));
  }

  .ant-popover-inner-content {
    padding: 4px 0;

    #nav {
      background: transparent;

      .ant-menu-item,
      .ant-menu-submenu {
        text-align: start;
      }

      .ant-menu-item-group-title {
        padding-inline-start: 24px;
        color: var(--site-text-color-secondary);
      }

      .ant-menu-item-group-list {
        padding: 0 12px;
      }

      .ant-menu-item,
      a {
        color: var(--site-text-color);
      }

      .ant-menu-item-selected,
      .ant-menu-item-selected a {
        color: var(--primary-color);
      }
    }
  }
}
</style>
