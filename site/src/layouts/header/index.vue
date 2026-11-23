<template>
  <header id="header" :class="headerClassName">
    <a-row class="header-row" :style="{ flexFlow: 'nowrap', height: '64px', position: 'relative' }">
      <a-col v-bind="colProps[0]" class="header-logo-col">
        <Logo />
      </a-col>
      <a-col v-bind="colProps[1]" class="menu-row">
        <span v-if="!isMobile" class="header-search-divider" aria-hidden="true" />
        <div class="header-search-wrap">
          <SearchBox
            key="search"
            :is-zh-c-n="isZhCN"
            :responsive="responsive"
            @triggerFocus="onTriggerSearching"
          />
        </div>
        <Menu v-if="!isMobile" />
      </a-col>
      <a-popover
        v-if="isMobile"
        v-model:open="menuOpen"
        overlay-class-name="popover-menu"
        placement="bottomRight"
        trigger="click"
        arrow-point-at-center
      >
        <UnorderedListOutlined class="nav-phone-icon" />
        <template #content>
          <Menu :is-mobile="isMobile" />
        </template>
      </a-popover>
    </a-row>
  </header>
</template>
<script lang="ts">
import type { GlobalConfig } from '../../type';
import { GLOBAL_CONFIG } from '../../SymbolKey';
import { getLocalizedPathname } from '../../utils/util';
import { computed, defineComponent, inject, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Logo from './Logo.vue';
import Menu from './Menu.vue';
import { UnorderedListOutlined } from '@ant-design/icons-vue';
import SearchBox from './SearchBox.vue';

export default defineComponent({
  name: 'SiteHeader',
  components: {
    Logo,
    Menu,
    UnorderedListOutlined,
    SearchBox,
  },
  setup() {
    const route = useRoute();
    const globalConfig = inject<GlobalConfig>(GLOBAL_CONFIG);

    const isHome = computed(() => {
      return ['/', '/index', '/index-cn'].includes(route.path);
    });

    const menuOpen = ref(false);
    watch(
      () => route.path,
      () => {
        menuOpen.value = false;
      },
    );

    const colProps = computed(() =>
      isHome.value
        ? [{ flex: 'none' }, { flex: 'auto' }]
        : [
            {
              xxxl: 4,
              xxl: 4,
              xl: 5,
              lg: 6,
              md: 6,
              sm: 18,
              xs: 18,
            },
            {
              xxxl: 20,
              xxl: 20,
              xl: 19,
              lg: 18,
              md: 18,
              sm: 6,
              xs: 6,
            },
          ],
    );

    const headerClassName = computed(() => ({
      clearfix: true,
      'home-header': isHome.value,
    }));

    const searching = ref(false);
    const onTriggerSearching = (value: boolean) => {
      searching.value = value;
    };

    return {
      isZhCN: globalConfig.isZhCN,
      isMobile: globalConfig.isMobile,
      responsive: globalConfig.responsive,
      getLocalizedPathname,
      headerClassName,
      colProps,
      menuOpen,
      onTriggerSearching,
    };
  },
});
</script>
<style lang="less" src="./index.less"></style>
