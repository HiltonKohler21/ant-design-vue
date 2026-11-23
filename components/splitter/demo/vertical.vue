<docs>
---
order: 1
title:
  zh-CN: 垂直分割
  en-US: Vertical
---

## zh-CN

垂直方向的分隔面板。

## en-US

Vertical split panels.

</docs>
<template>
  <a-splitter
    layout="vertical"
    style="height: 260px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px"
  >
    <a-splitter-panel default-size="40%">
      <div style="padding: 16px">Top panel</div>
    </a-splitter-panel>
    <a-splitter-panel>
      <div style="padding: 16px">Bottom panel</div>
    </a-splitter-panel>
  </a-splitter>
</template>
