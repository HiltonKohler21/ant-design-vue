<docs>
---
order: 1
title:
  zh-CN: 形态变体
  en-US: Variants
---

## zh-CN

提及组件形态变体，可选 `outlined`、`filled`、`borderless`、`underlined` 四种形态。

## en-US

Variants of Mentions: `outlined`, `filled`, `borderless`, and `underlined`.

</docs>

<template>
  <a-flex vertical :gap="12">
    <a-mentions v-model:value="value1" placeholder="Outlined" :options="options" />
    <a-mentions v-model:value="value2" placeholder="Filled" variant="filled" :options="options" />
    <a-mentions
      v-model:value="value3"
      placeholder="Borderless"
      variant="borderless"
      :options="options"
    />
    <a-mentions
      v-model:value="value4"
      placeholder="Underlined"
      variant="underlined"
      :options="options"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value1 = ref('');
const value2 = ref('');
const value3 = ref('');
const value4 = ref('');

const options = [
  { value: 'afc163', label: 'afc163' },
  { value: 'zombieJ', label: 'zombieJ' },
  { value: 'yesmeck', label: 'yesmeck' },
];
</script>
