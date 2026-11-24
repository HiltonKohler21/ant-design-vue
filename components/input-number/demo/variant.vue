<docs>
---
order: 8
version: 4.3.0
title:
  zh-CN: 形态变体
  en-US: Variants
---

## zh-CN

InputNumber 形态变体，可选 `outlined` `filled` `borderless` `underlined` 四种形态。

## en-US

Variants of InputNumber, there are four variants: `outlined` `filled` `borderless` and `underlined`.
</docs>

<template>
  <a-flex vertical :gap="12">
    <a-input-number placeholder="Outlined" :style="{ width: '200px' }" />
    <a-input-number placeholder="Filled" variant="filled" :style="{ width: '200px' }" />
    <a-input-number placeholder="Borderless" variant="borderless" :style="{ width: '200px' }" />
    <a-input-number placeholder="Underlined" variant="underlined" :style="{ width: '200px' }" />
  </a-flex>
</template>
