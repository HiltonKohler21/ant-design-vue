<docs>
---
order: 31
debug: true
title:
  zh-CN: suffix
  en-US: suffix
---

## zh-CN

`suffix` 测试。

## en-US

`suffix` test.
</docs>

<template>
  <a-space direction="vertical">
    <a-date-picker suffix />
    <a-date-picker :suffix="false" />
    <a-date-picker />
    <a-date-picker :suffix="null" />
    <a-date-picker suffix="123" />
  </a-space>
</template>
