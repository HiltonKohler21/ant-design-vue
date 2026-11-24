<docs>
---
order: 10
debug: true
title:
  zh-CN: 自定义 lineWidth
  en-US: customize lineWidth
---

## zh-CN

验证自定义 `lineWidth` 组件 Token 下 Checkbox 的渲染效果。

## en-US

Verify Checkbox rendering with customized `lineWidth` component token.
</docs>

<template>
  <a-space wrap>
    <a-config-provider
      :theme="{
        components: {
          Checkbox: {
            lineWidth: 6,
          },
        },
      }"
    >
      <a-checkbox checked />
      <a-checkbox />
    </a-config-provider>
    <a-checkbox checked />
    <a-checkbox />
  </a-space>
</template>
