<docs>
---
order: 9
debug: true
title:
  zh-CN: Group 内勾选框等宽
  en-US: Group same width
---

## zh-CN

窄容器下长文本换行时 Checkbox 图标保持固定尺寸不被压缩。

## en-US

Checkbox icons keep consistent width when long labels wrap in a narrow container.
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
    <a-checkbox-group v-model:value="value" :options="options" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { CheckboxOptionType } from 'ant-design-vue';

const options: CheckboxOptionType[] = [
  { label: 'Short', value: 'a' },
  { label: 'Long label that may wrap in narrow container', value: 'b' },
  { label: 'Medium', value: 'c' },
];

const value = ref<string[]>(['a']);
</script>
