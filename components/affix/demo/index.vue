<template>
  <demo-sort>
    <basic />
    <on-change />
    <target />
    <debug />
  </demo-sort>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import Basic from './basic.vue';
import OnChange from './on-change.vue';
import Target from './target.vue';
import Debug from './debug.vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    OnChange,
    Target,
    Debug,
  },
});
</script>
