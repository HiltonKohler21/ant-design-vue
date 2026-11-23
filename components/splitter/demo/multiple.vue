<docs>
---
order: 4
title:
  zh-CN: 多面板
  en-US: Multiple panels
---

## zh-CN

切分成三个或更多可调节面板。

## en-US

Split into three or more resizable panels.

</docs>
<template>
  <a-splitter style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px">
    <a-splitter-panel default-size="20%" min="15%">
      <div style="padding: 16px">Panel 1</div>
    </a-splitter-panel>
    <a-splitter-panel default-size="50%">
      <div style="padding: 16px">Panel 2</div>
    </a-splitter-panel>
    <a-splitter-panel>
      <div style="padding: 16px">Panel 3</div>
    </a-splitter-panel>
  </a-splitter>
</template>
