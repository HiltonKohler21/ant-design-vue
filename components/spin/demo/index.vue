<template>
  <demo-sort>
    <basic />
    <size />
    <nested />
    <tip />
    <delay />
    <custom-indicator />
    <percent />
    <style-class />
    <fullscreen />
    <inside />
    <list-debug />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Size from './size.vue';
import Inside from './inside.vue';
import Nested from './nested.vue';
import Tip from './tip.vue';
import Delay from './delay.vue';
import CustomIndicator from './custom-indicator.vue';
import Percent from './percent.vue';
import StyleClass from './style-class.vue';
import Fullscreen from './fullscreen.vue';
import ListDebug from './list-debug.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Size,
    Inside,
    Nested,
    Tip,
    Delay,
    CustomIndicator,
    Percent,
    StyleClass,
    Fullscreen,
    ListDebug,
  },
  setup() {
    return {};
  },
});
</script>
