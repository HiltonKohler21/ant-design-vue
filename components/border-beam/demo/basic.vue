<docs>
---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

在卡片边框上循环流动的光束。

## en-US

A beam travelling along the card border.

</docs>
<template>
  <a-border-beam color="#1677ff" :count="1" :duration="4" :line-width="1">
    <div class="beam-card">
      <h3>BorderBeam</h3>
      <p>Hover 或静态展示均可，光束沿边框循环流动。</p>
    </div>
  </a-border-beam>
</template>
<style scoped>
.beam-card {
  width: 320px;
  padding: 20px 24px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #f0f0f0;
}
.beam-card h3 {
  margin: 0 0 8px;
  font-size: 16px;
}
.beam-card p {
  margin: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 13px;
}
</style>
