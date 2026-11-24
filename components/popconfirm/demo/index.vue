<template>
  <demo-sort>
    <basic />
    <local />
    <placement />
    <dynamic-trigger />
    <icon />
    <promiseVue />
    <style-class />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Local from './local.vue';
import Icon from './icon.vue';
import Placement from './placement.vue';
import DynamicTrigger from './dynamic-trigger.vue';
import promiseVue from './promise.vue';
import StyleClass from './style-class.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    promiseVue,
    Basic,
    Local,
    Icon,
    Placement,
    DynamicTrigger,
    StyleClass,
  },
  setup() {
    return {};
  },
});
</script>
