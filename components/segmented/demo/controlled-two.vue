<docs>
---
order: 13
debug: true
title:
  zh-CN: 受控同步模式
  en-US: Controlled Synced mode
---

## zh-CN

测试受控模式下两个 Segmented 同步 state。

## en-US

Tests two Segmented synchronized states in controlled mode.
</docs>

<template>
  <a-space wrap>
    <a-segmented v-model:value="foo" :options="['AND', 'OR', 'NOT']" />
    <a-segmented v-model:value="foo" :options="['AND', 'OR', 'NOT']" />
  </a-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const foo = ref<string | number>('AND');
</script>
