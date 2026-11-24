<docs>
---
order: 3
debug: true
title:
  zh-CN: 调整浏览器大小，观察 Affix 容器是否发生变化。跟随变化为正常。#17678
  en-US: Debug
---

## zh-CN

DEBUG

## en-US

DEBUG

</docs>

<template>
  <div style="height: 10000px">
    <div>Top</div>
    <a-affix :offset-top="top">
      <div style="background: red">
        <a-button type="primary" @click="top += 10">Affix top</a-button>
      </div>
    </a-affix>
    <div>Bottom</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const top = ref<number>(10);
</script>
