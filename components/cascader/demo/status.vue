<docs>
---
order: 12.5
version: 3.3.0
title:
  zh-CN: 自定义状态
  en-US: Status
---

## zh-CN

使用 `status` 为 Cascader 添加状态，可选 `error` 或者 `warning`。

## en-US

Add status to Cascader with `status`, which could be `error` or `warning`.
</docs>

<template>
  <a-space direction="vertical" :style="{ width: '100%' }">
    <a-cascader status="error" placeholder="Error" />
    <a-cascader status="warning" multiple placeholder="Warning multiple" />
  </a-space>
</template>
