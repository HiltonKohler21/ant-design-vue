<docs>
---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

最简单的用法。

## en-US

The simplest usage.

</docs>
<template>
  <a-rate v-model:value="value" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<number>(2);
</script>
