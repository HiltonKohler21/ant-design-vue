<template>
  <demo-sort :cols="1">
    <basic />
    <multi-line />
    <watermark-image />
    <custom />
    <portal />
    <debug />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import Basic from './basic.vue';
import MultiLine from './multi-line.vue';
import WatermarkImage from './image.vue';
import Custom from './custom.vue';
import Portal from './portal.vue';
import Debug from './debug.vue';
export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    MultiLine,
    WatermarkImage,
    Custom,
    Portal,
    Debug,
  },
});
</script>
