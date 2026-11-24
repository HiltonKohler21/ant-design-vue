<docs>
---
order: 4
version: 4.3.0
title:
  zh-CN: 带移除图标
  en-US: Allow clear
---

## zh-CN

点击清除图标清空数值，`change` 接收 `null`。支持自定义清除图标，值为 `0` 时也可以清空。

## en-US

Click the clear icon to empty the value. `change` receives `null`. Supports a custom clear icon and clearing `0`.
</docs>

<template>
  <a-space direction="vertical">
    <a-input-number allow-clear :default-value="100" :style="{ width: '120px' }" />
    <a-input-number allow-clear :default-value="0" suffix="kg" :style="{ width: '120px' }" />
    <a-input-number allow-clear mode="spinner" :default-value="0" :style="{ width: '150px' }" />
  </a-space>
</template>
