<docs>
---
order: 2
title:
  zh-CN: 形态变体
  en-US: Variants
---

## zh-CN

使用 `variant` 属性切换输入框的视觉变体，可选 `outlined` `borderless` `filled` `underlined`。也可以在 `ConfigProvider` 上统一设置全局变体。

## en-US

Use the `variant` prop to switch the visual variant of the input: `outlined` `borderless` `filled` `underlined`. The global variant can also be set on `ConfigProvider`.

</docs>
<template>
  <a-space direction="vertical" :size="16" style="width: 100%">
    <a-input v-model:value="value" variant="outlined" placeholder="Outlined" />
    <a-input v-model:value="value" variant="filled" placeholder="Filled" />
    <a-input v-model:value="value" variant="borderless" placeholder="Borderless" />
    <a-input v-model:value="value" variant="underlined" placeholder="Underlined" />
    <a-input v-model:value="value" variant="filled" placeholder="Filled with prefix" prefix="￥" />
    <a-textarea v-model:value="value" variant="filled" placeholder="Filled TextArea" :rows="2" />
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const value = ref<string>('');
</script>
