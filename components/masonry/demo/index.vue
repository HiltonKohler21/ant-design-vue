<template>
  <demo-sort :cols="1">
    <basic />
    <responsive />
    <dynamic />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import Basic from './basic.vue';
import Responsive from './responsive.vue';
import Dynamic from './dynamic.vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Responsive,
    Dynamic,
  },
});
</script>
