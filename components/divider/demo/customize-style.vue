<docs>
---
order: 5
debug: true
title:
  zh-CN: 样式自定义
  en-US: Style Customization
---

## zh-CN

测试一些 `style` 修改样式的行为。

## en-US

Use `style` to change default style.
</docs>

<template>
  <a-divider style="border-width: 2px; border-color: #7cb305" />
  <a-divider style="border-color: #7cb305" dashed />
  <a-divider style="border-color: #7cb305" dashed>Text</a-divider>
  <a-divider vertical style="height: 60px; border-color: #7cb305" />
  <a-divider vertical style="height: 60px; border-color: #7cb305" dashed />

  <div style="display: flex; flex-direction: column; height: 50px; box-shadow: 0 0 1px red">
    <a-divider style="background: rgba(0, 255, 0, 0.05)" title-placement="start">Text</a-divider>
  </div>
</template>
