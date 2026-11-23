<docs>
---
order: 3
title:
  zh-CN: 自定义尺寸、速度与偏移
  en-US: Size, Duration & Outset
---

## zh-CN

灵活配置 `size`、`duration`、`lineWidth` 和 `outset`，可直接包裹按钮、卡片等任意带圆角的元素。

## en-US

Customize `size`, `duration`, `lineWidth`, and `outset` on buttons, cards, or any rounded element.

</docs>
<template>
  <a-space :size="20" align="center" wrap>
    <a-border-beam :duration="3" :line-width="2" :size="80" :color="['#1677ff', '#722ed1']">
      <a-button size="large">AI Generate</a-button>
    </a-border-beam>

    <a-border-beam
      :duration="8"
      :line-width="2"
      :size="150"
      :outset="2"
      :color="['#13c2c2', '#1677ff']"
    >
      <div class="beam-pill">
        <span>Slow Wide Beam (outset = 2px)</span>
      </div>
    </a-border-beam>
  </a-space>
</template>
<style scoped>
.beam-pill {
  position: relative;
  padding: 10px 22px;
  border-radius: 999px;
  background: var(--ant-color-bg-container, #fff);
  border: 1px solid var(--ant-color-border-secondary, #f0f0f0);
  color: var(--ant-color-text, rgba(0, 0, 0, 0.88));
  font-size: 14px;
}
</style>
