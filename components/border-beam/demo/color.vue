<docs>
---
order: 1
title:
  zh-CN: 自定义颜色与渐变
  en-US: Custom Color & Gradient
---

## zh-CN

通过 `color` 设置纯色、颜色数组或带百分比的渐变色标。

## en-US

Customize beam color with a solid color, color array, or gradient color stops.

</docs>
<template>
  <a-space :size="20" wrap>
    <a-border-beam color="#52c41a">
      <div class="beam-box">
        <h4>Solid Color</h4>
        <p>#52c41a</p>
      </div>
    </a-border-beam>

    <a-border-beam :color="['#1677ff', '#722ed1', '#eb2f96']">
      <div class="beam-box">
        <h4>Color Array</h4>
        <p>Blue → Purple → Pink</p>
      </div>
    </a-border-beam>

    <a-border-beam
      :color="[
        { color: '#fa8c16', percent: 0 },
        { color: '#f5222d', percent: 50 },
        { color: '#722ed1', percent: 100 },
      ]"
    >
      <div class="beam-box">
        <h4>Gradient Stops</h4>
        <p>Custom stop percentages</p>
      </div>
    </a-border-beam>
  </a-space>
</template>
<style scoped>
.beam-box {
  position: relative;
  width: 210px;
  padding: 16px 20px;
  border-radius: 12px;
  background: var(--ant-color-bg-container, #fff);
  border: 1px solid var(--ant-color-border-secondary, #f0f0f0);
}
.beam-box h4 {
  margin: 0 0 6px;
  font-size: 14px;
  color: var(--ant-color-text, rgba(0, 0, 0, 0.88));
}
.beam-box p {
  margin: 0;
  font-size: 12px;
  color: var(--ant-color-text-secondary, rgba(0, 0, 0, 0.65));
}
</style>
