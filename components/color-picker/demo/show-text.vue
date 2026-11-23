<docs>
---
order: 4
title:
  zh-CN: 渲染文本
  en-US: Rendering Trigger Text
---

## zh-CN

通过设置 `showText` 可以让触发器显示当前颜色文本，或者传入函数自定义渲染。

## en-US

Show current color text on trigger via `showText`, or customize text display using a function.

</docs>
<template>
  <a-space :size="16">
    <a-color-picker defaultValue="#1677ff" showText />
    <a-color-picker defaultValue="#52c41a" :showText="color => `自定义: ${color.toHexString()}`" />
  </a-space>
</template>
