<docs>
---
order: 0
title:
  zh-CN: 基础用法
  en-US: Basic
---

## zh-CN

在卡片边框上循环流动的光束。光束直接注入子元素内部，自动贴合子元素的尺寸与圆角。

## en-US

A beam travelling along the card border. The beam injects directly into the child element and inherits its exact size and border radius.

</docs>
<template>
  <a-border-beam>
    <a-card title="BorderBeam" style="width: 320px">
      <p style="margin: 0; color: var(--ant-color-text-secondary)">
        光束沿容器边框流畅环绕，无需额外包裹层，自动继承圆角与边框。
      </p>
    </a-card>
  </a-border-beam>
</template>
