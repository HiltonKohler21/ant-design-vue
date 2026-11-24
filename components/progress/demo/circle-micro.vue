<docs>
---
order: 3
title:
  zh-CN: 响应式进度圈
  en-US: Responsive circular progress bar
---

## zh-CN

响应式的圈形进度，当 `width` 小于等于 20 的时候，进度信息将不会显示在进度圈里面，而是以 Tooltip 的形式显示。

## en-US

Responsive circular progress bar. When `width` is smaller than 20, progress information will be displayed in Tooltip.

</docs>

<template>
  <a-flex align="center" gap="small">
    <a-progress
      type="circle"
      rail-color="#e6f4ff"
      :percent="60"
      :stroke-width="20"
      :size="14"
      :format="number => `In progress, ${number}% complete`"
    />
    <span>Code release</span>
  </a-flex>
</template>
