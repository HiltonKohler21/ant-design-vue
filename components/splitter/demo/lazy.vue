<docs>
---
order: 5
title:
  zh-CN: 延迟渲染模式
  en-US: Lazy
---

## zh-CN

设置 `lazy` 属性后，拖拽时仅移动预览线，松手后才更新面板尺寸。

## en-US

Set `lazy` to update panel sizes only after dragging finishes.

</docs>
<template>
  <a-splitter
    lazy
    style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px"
  >
    <a-splitter-panel default-size="40%" min="20%" max="70%">
      <div style="padding: 16px">First (Lazy)</div>
    </a-splitter-panel>
    <a-splitter-panel>
      <div style="padding: 16px">Second (Lazy)</div>
    </a-splitter-panel>
  </a-splitter>
</template>
