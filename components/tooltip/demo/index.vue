<template>
  <demo-sort>
    <basic />
    <SmoothTransition />
    <placement />
    <Arrow />
    <auto-adjust-overflow />
    <color />
    <arrow-point-at-center />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Placement from './placement.vue';
import arrowPointAtCenter from './arrow-point-at-center.vue';
import AutoAdjustOverflow from './auto-adjust-overflow.vue';
import Color from './color.vue';
import Arrow from './arrow.vue';
import SmoothTransition from './smooth-transition.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Placement,
    arrowPointAtCenter,
    AutoAdjustOverflow,
    Color,
    Arrow,
    SmoothTransition,
  },
  setup() {
    return {};
  },
});
</script>
