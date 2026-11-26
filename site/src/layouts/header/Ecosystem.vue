<template>
  <a-menu class="ecosystem" mode="inline" :selectable="false">
    <a-menu-item-group key="ecosystem" :title="$t('app.header.menu.ecosystem')">
      <a-menu-item key="design">
        <router-link :to="getLocalizedPathname('/docs/vue/download', isZhCN)">
          {{ isZhCN ? '设计资源' : 'Design Resources' }}
        </router-link>
      </a-menu-item>
      <a-menu-item key="awesome">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/vueComponent/ant-design-vue-awesome"
        >
          Awesome Ant Design Vue
        </a>
      </a-menu-item>
    </a-menu-item-group>
  </a-menu>
</template>
<script lang="ts">
import { computed, defineComponent, inject } from 'vue';
import type { GlobalConfig } from '../../type';
import { GLOBAL_CONFIG } from '../../SymbolKey';
import { getLocalizedPathname } from '../../utils/util';

export default defineComponent({
  name: 'HeaderEcosystem',
  setup() {
    const globalConfig = inject<GlobalConfig>(GLOBAL_CONFIG);
    const isZhCN = computed(() => globalConfig?.isZhCN?.value ?? false);
    return {
      isZhCN,
      getLocalizedPathname,
    };
  },
});
</script>
<style lang="less" scoped>
.ecosystem {
  background: transparent;
  border-inline-end: 0 !important;

  a {
    color: var(--site-text-color);

    &:hover {
      color: var(--primary-color);
    }
  }
}
</style>
