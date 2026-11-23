<template>
  <div class="home-page">
    <Header />
    <main class="home-main">
      <HeroBanner :is-zh-c-n="isZhCN" />
      <ThemePreview :is-zh-c-n="isZhCN" />
      <ComponentsShowcase :is-zh-c-n="isZhCN" />
      <DesignFramework :is-zh-c-n="isZhCN" />
    </main>
    <Footer :is-c-n="isZhCN" />
    <a-back-top />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';
import Header from '../layouts/header/index.vue';
import Footer from '../layouts/Footer.vue';
import { GLOBAL_CONFIG } from '../SymbolKey';
import type { GlobalConfig } from '../type';
import HeroBanner from './home/HeroBanner.vue';
import ThemePreview from './home/ThemePreview.vue';
import ComponentsShowcase from './home/ComponentsShowcase.vue';
import DesignFramework from './home/DesignFramework.vue';

export default defineComponent({
  name: 'HomePage',
  components: {
    Header,
    Footer,
    HeroBanner,
    ThemePreview,
    ComponentsShowcase,
    DesignFramework,
  },
  setup() {
    const globalConfig = inject<GlobalConfig>(GLOBAL_CONFIG);
    const isZhCN = computed(() => globalConfig?.isZhCN?.value ?? false);
    return {
      isZhCN,
    };
  },
});
</script>

<style lang="less" src="./Home.less"></style>
