<template>
  <demo-sort>
    <basic />
    <my-page />
  </demo-sort>
</template>

<script lang="ts">
import MyPage from './myPage.vue';
import { defineComponent } from 'vue';
import Basic from './basic.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
export default defineComponent({
  CN,
  US,
  components: {
    MyPage,
    Basic,
  },
});
</script>
