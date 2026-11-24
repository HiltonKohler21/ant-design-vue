<docs>
---
order: 5.5
version: 4.3.0
title:
  zh-CN: 形态变体
  en-US: Variants
---

## zh-CN

TreeSelect 形态变体，可选 `outlined` `filled` `borderless` `underlined` 四种形态。

## en-US

Variants of TreeSelect, there are four variants: `outlined`, `filled`, `borderless` and `underlined`.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-tree-select :style="style" placeholder="Borderless" variant="borderless" />
    <a-tree-select :style="style" placeholder="Filled" variant="filled" />
    <a-tree-select :style="style" placeholder="Outlined" variant="outlined" />
    <a-tree-select :style="style" placeholder="Underlined" variant="underlined" />
  </a-flex>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue';

const style: CSSProperties = {
  width: '100%',
  maxWidth: '100%',
};
</script>
