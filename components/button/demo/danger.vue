<docs>
---
order: 12
title:
  zh-CN: 危险按钮
  en-US: Danger Buttons
---

## zh-CN

在 2.2.0 之后，危险成为一种按钮属性而不是按钮类型。

## en-US

The `danger` is a property of buttons after ant-design-vue 2.2.0.
</docs>

<template>
  <a-flex wrap="wrap" gap="small">
    <a-button type="primary" danger>Primary</a-button>
    <a-button danger>Default</a-button>
    <a-button type="dashed" danger>Dashed</a-button>
    <a-button type="text" danger>Text</a-button>
    <a-button type="link" danger>Link</a-button>
  </a-flex>
</template>
