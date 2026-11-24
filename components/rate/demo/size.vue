<docs>
---
order: 1
version: 6.0.0
title:
  zh-CN: 尺寸
  en-US: Sizes
---

## zh-CN

通过 `size` 属性设置评分组件的尺寸。

## en-US

Set the size of `Rate` via the `size` prop.
</docs>
<template>
  <a-flex vertical gap="middle">
    <a-rate v-model:value="value1" size="large" />
    <a-rate v-model:value="value2" />
    <a-rate v-model:value="value3" size="small" />
  </a-flex>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const value1 = ref<number>(3);
const value2 = ref<number>(3);
const value3 = ref<number>(3);
</script>
