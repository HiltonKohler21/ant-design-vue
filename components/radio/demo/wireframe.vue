<docs>
---
order: 13
debug: true
title:
  zh-CN: 线框风格
  en-US: Wireframe
---

## zh-CN

线框风格下的 Radio.Group 展示效果。

## en-US

Radio.Group display in wireframe theme mode.
</docs>

<template>
  <a-config-provider :theme="{ token: { wireframe: true } }">
    <a-space direction="vertical">
      <a-radio-group v-model:value="value" :options="options" />
      <a-radio-group :value="1" :options="options" disabled />
    </a-space>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { RadioGroupProps } from 'ant-design-vue';

const value = ref(1);
const options: RadioGroupProps['options'] = [
  { value: 1, label: 'A' },
  { value: 2, label: 'B' },
  { value: 3, label: 'C' },
  { value: 4, label: 'D' },
];
</script>
