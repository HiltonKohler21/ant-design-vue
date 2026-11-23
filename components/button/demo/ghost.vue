<docs>
---
order: 8
title:
  zh-CN: 幽灵按钮
  en-US: Ghost Button
---

## zh-CN

幽灵按钮将按钮的内容反色，背景变为透明，常用在有色背景上。

## en-US

`ghost` property will make button's background transparent, it is commonly used in colored background.

</docs>

<template>
  <div class="site-button-ghost-wrapper">
    <a-space>
      <a-button type="primary" ghost>Primary</a-button>
      <a-button ghost>Default</a-button>
      <a-button type="dashed" ghost>Dashed</a-button>
      <a-button type="primary" danger ghost>Danger</a-button>
    </a-space>
  </div>
</template>
<style scoped>
.site-button-ghost-wrapper {
  padding: 16px;
  background: rgb(190, 200, 200);
  border-radius: var(--ant-border-radius, 6px);
}
[data-theme='dark'] .site-button-ghost-wrapper {
  background: rgba(255, 255, 255, 0.16);
}
</style>
