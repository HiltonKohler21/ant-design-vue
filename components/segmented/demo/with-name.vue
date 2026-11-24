<docs>
---
order: 11
version: 4.3.0
title:
  zh-CN: 配合 name 使用
  en-US: With name
---

## zh-CN

可以为 Segmented 配置 `name` 参数，为组合内的 input 元素赋予相同的 `name` 属性，使浏览器把 Segmented 下的 input 真正看作是一组（例如可以通过方向键始终**在同一组内**更改选项）。

## en-US

Passing the `name` property to all `input[type="radio"]` that are in the same Segmented. It is usually used to let the browser see your Segmented as a real "group" and keep the default behavior. For example, using left/right keyboard arrow to change your selection in the same Segmented.
</docs>

<template>
  <div :style="{ maxWidth: '100%', overflowX: 'auto' }">
    <a-segmented :options="['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']" name="group" />
  </div>
</template>
