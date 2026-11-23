<template>
  <h1>
    <router-link id="logo" :to="isZhCN ? '/index-cn' : '/'">
      <img alt="Ant Design Vue" :src="logo" />
      <span class="logo-title">Ant Design Vue</span>
    </router-link>
  </h1>
</template>

<script lang="ts">
import type { GlobalConfig } from '../../type';
import { GLOBAL_CONFIG } from '../../SymbolKey';
import { computed, defineComponent, inject } from 'vue';
import logo from '../../assets/logo.svg';

export default defineComponent({
  name: 'HeaderLogo',
  setup() {
    const globalConfig = inject<GlobalConfig>(GLOBAL_CONFIG);
    const isZhCN = computed(() => globalConfig?.isZhCN?.value ?? false);
    return { logo, isZhCN };
  },
});
</script>

<style lang="less" scoped>
#logo {
  display: inline-flex;
  align-items: center;
  height: var(--header-height);
  padding-inline-start: 32px;
  padding-inline-end: 16px;
  overflow: hidden;
  color: var(--site-text-color);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.18px;
  line-height: var(--header-height);
  white-space: nowrap;
  text-decoration: none;

  img {
    height: 32px;
    width: 32px;
    margin-inline-end: 12px;
    flex-shrink: 0;
  }

  .logo-title {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media only screen and (max-width: 767.99px) {
  #logo {
    padding-inline-start: 16px;
    padding-inline-end: 12px;
    font-size: 16px;

    img {
      height: 28px;
      width: 28px;
      margin-inline-end: 8px;
    }
  }
}
</style>
