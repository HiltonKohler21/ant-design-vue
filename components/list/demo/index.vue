<template>
  <demo-sort :cols="1">
    <simple />
    <basic />
    <loadmore />
    <vertical />
    <grid />
    <resposive />
  </demo-sort>
</template>
<script lang="ts">
import Basic from './basic.vue';
import Simple from './simple.vue';
import Loadmore from './loadmore.vue';
import Vertical from './vertical.vue';
import Grid from './grid.vue';
import Resposive from './resposive.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';
export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Simple,
    Loadmore,
    Vertical,
    Grid,
    Resposive,
  },
  setup() {
    return {};
  },
});
</script>
