<docs>
---
order: 10
title:
  zh-CN: 无边框与变体
  en-US: Borderless & Variant
---

## zh-CN

使用 `variant` 属性切换卡片变体，可选 `outlined`（默认带边框）或 `borderless`（无边框，适合置于灰色背景上）。

## en-US

Switch card appearance via the `variant` prop: `outlined` (default bordered) or `borderless` (ideal on a neutral gray background).
</docs>

<template>
  <div class="card-variant-bg">
    <a-flex gap="large" wrap="wrap">
      <a-card title="Outlined Card" variant="outlined" style="width: 280px">
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </a-card>
      <a-card title="Borderless Card" variant="borderless" style="width: 280px">
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </a-card>
    </a-flex>
  </div>
</template>

<style scoped>
.card-variant-bg {
  padding: 24px;
  background: var(--ant-color-bg-layout, #f5f5f5);
  border-radius: 8px;
}
</style>
