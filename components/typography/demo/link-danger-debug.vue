<docs>
---
order: 13
debug: true
title:
  zh-CN: Link danger Debug
  en-US: Link danger Debug
---

## zh-CN

Typography.Link 的 danger 颜色与 Button Link 的样式隔离。

## en-US

Typography.Link danger color and isolation from Button link styles.
</docs>
<template>
  <a-typography>
    <a-typography-text>Typography.Link 的 type="danger" 颜色应为 error 文本色。</a-typography-text>
    <br />
    <a-typography-link href="https://ant.design" type="danger">Danger Link</a-typography-link>
    <a-divider />
    <a-typography-text>Button 以 a 标签渲染时，不应被 Typography 链接样式影响。</a-typography-text>
    <br />
    <a-button type="link" href="https://ant.design">Button Link</a-button>
  </a-typography>
</template>
