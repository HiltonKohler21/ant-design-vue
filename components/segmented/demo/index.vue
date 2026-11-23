<template>
  <demo-sort>
    <basic />
    <vertical />
    <block />
    <shape />
    <disabled />
    <custom />
    <dynamic />
    <size />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import Basic from './basic.vue';
import Block from './block.vue';
import Disabled from './disabled.vue';
import Custom from './custom.vue';
import Dynamic from './dynamic.vue';
import Size from './size.vue';
import Vertical from './vertical.vue';
import Shape from './shape.vue';

export default defineComponent({
  components: { Size, Dynamic, Custom, Disabled, Block, Basic, Vertical, Shape },
  category: 'Components',
  subtitle: '分段控制器',
  type: 'Data Display',
  title: 'Segmented',
  CN,
  US,
});
</script>
