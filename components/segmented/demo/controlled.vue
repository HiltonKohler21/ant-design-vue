<docs>
---
order: 5
title:
  zh-CN: 受控模式
  en-US: Controlled mode
---

## zh-CN

受控的 Segmented。

## en-US

Controlled Segmented.
</docs>

<template>
  <a-segmented v-model:value="value" :options="['Map', 'Transit', 'Satellite']" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value = ref<string>('Map');
</script>
