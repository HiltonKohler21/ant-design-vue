<template>
  <demo-sort>
    <basic />
    <local />
    <placement />
    <shift />
    <dynamic-trigger />
    <icon />
    <async-demo />
    <promise-vue />
    <style-class />
    <render-panel />
    <wireframe />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Local from './local.vue';
import Placement from './placement.vue';
import Shift from './shift.vue';
import DynamicTrigger from './dynamic-trigger.vue';
import Icon from './icon.vue';
import AsyncDemo from './async.vue';
import promiseVue from './promise.vue';
import StyleClass from './style-class.vue';
import RenderPanel from './render-panel.vue';
import Wireframe from './wireframe.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Local,
    Placement,
    Shift,
    DynamicTrigger,
    Icon,
    AsyncDemo,
    promiseVue,
    StyleClass,
    RenderPanel,
    Wireframe,
  },
  setup() {
    return {};
  },
});
</script>
