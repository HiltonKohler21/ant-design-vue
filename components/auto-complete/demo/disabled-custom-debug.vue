<docs>
---
order: 11
debug: true
title:
  zh-CN: 禁用自定义输入 Debug
  en-US: Disabled custom input debug
---

## zh-CN

禁用自定义输入组件 Debug。

## en-US

Disabled custom input debug.
</docs>

<template>
  <a-flex :gap="12" wrap="wrap">
    <a-input disabled placeholder="Regular Input" :style="{ width: '200px', maxWidth: '100%' }" />
    <a-auto-complete disabled :style="{ width: '200px', maxWidth: '100%' }">
      <a-textarea disabled />
    </a-auto-complete>
    <a-select disabled :options="[]" :style="{ width: '200px', maxWidth: '100%' }" />
  </a-flex>
</template>
