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

The most basic usage.

</docs>
<template>
  <a-color-picker v-model:value="value" />
  <div style="margin-top: 12px">当前值：{{ value }}</div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref('#1677ff');
</script>
