<template>
  <demo-sort :cols="2">
    <basic />
    <color />
    <multiple />
    <custom />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import Basic from './basic.vue';
import Color from './color.vue';
import Multiple from './multiple.vue';
import Custom from './custom.vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Color,
    Multiple,
    Custom,
  },
});
</script>
