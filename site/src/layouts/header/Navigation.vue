<template>
  <a-menu
    id="nav"
    class="menu-site"
    :mode="menuMode"
    :selected-keys="[activeMenuItem]"
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
      <router-link :to="getLocalizedPathname('/components/overview/', isZhCN)">
        {{ isZhCN ? '组件' : 'Components' }}
      </router-link>
    </a-menu-item>
    <a-menu-item key="for-agents">
      <router-link :to="getLocalizedPathname('/docs/vue/for-agents', isZhCN)">
        <span style="position: relative">
          For Agents
          <a-tag color="blue" :bordered="false" style="font-size: 10px; line-height: 14px; padding: 0 4px; margin-left: 4px; vertical-align: text-top; border-radius: 4px;">
            AI
          </a-tag>
        </span>
      </router-link>
    </a-menu-item>
    <template v-if="isMobile">
      <a-menu-item key="switch-lang" @click="$emit('langChange')">
        {{ $t('app.header.lang') }}
      </a-menu-item>
      <a-menu-item key="github">
        <a
          href="https://github.com/vueComponent/ant-design-vue"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
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
  emits: ['langChange'],
  setup() {
    const globalConfig = inject<GlobalConfig>(GLOBAL_CONFIG);
    const menuMode = computed(() => {
      return globalConfig.isMobile.value ? 'inline' : 'horizontal';
    });
    const route = useRoute();
    const activeMenuItem = ref('home');
    watch(
      () => route.path,
      pathname => {
        const modules = pathname.split('/');
        if (pathname.includes('/design')) {
          activeMenuItem.value = 'design';
        } else if (pathname.includes('/for-agents')) {
          activeMenuItem.value = 'for-agents';
        } else if (modules[1] === 'components') {
          activeMenuItem.value = 'components';
        } else if (modules[1] === 'docs') {
          activeMenuItem.value = `${modules[1]}/${modules[2]}`;
        } else {
          activeMenuItem.value = 'home';
        }
      },
      { immediate: true },
    );
    return {
      isMobile: globalConfig.isMobile,
      isZhCN: globalConfig.isZhCN,
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

  &.ant-menu-horizontal {
    border-bottom: none;

    & > .ant-menu-item,
    & > .ant-menu-submenu {
      min-width: (40px + 12px * 2);
      height: var(--header-height);
      padding-right: 12px;
      padding-left: 12px;
      line-height: var(--header-height);

      &::after {
        content: '';
        position: absolute;
        top: auto;
        right: 12px;
        bottom: 0;
        left: 12px;
        border-bottom: 2px solid transparent !important;
        transition: border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }

      &:hover::after {
        border-bottom-color: var(--primary-color) !important;
      }

      &.ant-menu-item-selected::after,
      &.ant-menu-submenu-selected::after {
        border-bottom-color: var(--primary-color) !important;
      }

      a {
        color: var(--site-text-color);
        transition: color 0.3s;
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
}

.header-link {
  color: var(--site-text-color);
}

.ant-menu-item-active .header-link {
  color: var(--primary-color);
}

// Popover menu is only used for mobile
.popover-menu {
  width: 300px;

  .ant-popover-inner-content {
    padding: 0;

    #nav {
      .ant-menu-item,
      .ant-menu-submenu {
        text-align: left;
      }

      .ant-menu-item-group-title {
        padding-left: 24px;
      }

      .ant-menu-item-group-list {
        padding: 0 16px;
      }

      .ant-menu-item,
      a {
        color: #333;
      }
    }
  }
}
</style>
