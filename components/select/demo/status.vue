<docs>
---
order: 16
version: 3.3.0
title:
  zh-CN: 自定义状态
  en-US: Status
---

## zh-CN

使用 `status` 为 Select 添加状态，可选 `error` 或者 `warning`。

## en-US

Add status to Select with `status`, which could be `error` or `warning`.

</docs>

<template>
  <a-space class="components-select-demo-status" direction="vertical" style="width: 100%">
    <a-select status="error" style="width: 100%" />
    <a-select status="warning" style="width: 100%" />
  </a-space>
</template>
<style scoped>
.components-select-demo-status :deep(.ant-select) {
  margin: 0;
}
</style>
