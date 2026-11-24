<template>
  <demo-sort>
    <Hook />
    <other />
    <duration />
    <stack />
    <loading />
    <thenable />
    <style-class />
    <update />
    <info />
    <customStyleVue />
    <render-panel />
    <component-token />
  </demo-sort>
</template>
<script lang="ts">
import Info from './info.vue';
import Other from './other.vue';
import Duration from './duration.vue';
import Stack from './stack.vue';
import Loading from './loading.vue';
import Thenable from './thenable.vue';
import StyleClass from './style-class.vue';
import Update from './update.vue';
import customStyleVue from './custom-style.vue';
import RenderPanel from './render-panel.vue';
import ComponentToken from './component-token.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
import Hook from './hook.vue';
export default defineComponent({
  CN,
  US,
  components: {
    Info,
    Other,
    Duration,
    Stack,
    Loading,
    Thenable,
    StyleClass,
    Update,
    customStyleVue,
    RenderPanel,
    ComponentToken,
    Hook,
  },
  setup() {
    return {};
  },
});
</script>
