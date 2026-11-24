<docs>
---
order: 12
debug: true
title:
  zh-CN: Group 内图标等宽
  en-US: Group same width
---

## zh-CN

窄容器下长文本换行时 Radio 图标保持固定尺寸不被压缩。

## en-US

Radio icons keep consistent width when long labels wrap in a narrow container.
</docs>

<template>
  <div
    :style="{
      width: '280px',
      maxWidth: '100%',
      border: '1px solid var(--ant-color-border-secondary, #f0f0f0)',
      padding: '16px',
    }"
  >
    <a-radio-group v-model:value="value" :options="options" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const options = [
  { label: 'Short', value: 'a' },
  { label: 'Long label that may wrap in narrow container', value: 'b' },
  { label: 'Medium', value: 'c' },
];

const value = ref('a');
</script>
