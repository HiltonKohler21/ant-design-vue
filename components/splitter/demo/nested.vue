<docs>
---
order: 7
title:
  zh-CN: 嵌套使用
  en-US: Nested
---

## zh-CN

水平与垂直嵌套切分。

## en-US

Nested horizontal and vertical split panels.

</docs>
<template>
  <a-splitter style="height: 300px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px">
    <a-splitter-panel default-size="30%">
      <div style="padding: 16px">Left sidebar</div>
    </a-splitter-panel>
    <a-splitter-panel>
      <a-splitter layout="vertical" style="height: 100%">
        <a-splitter-panel default-size="50%">
          <div style="padding: 16px">Top Content</div>
        </a-splitter-panel>
        <a-splitter-panel>
          <div style="padding: 16px">Bottom Content</div>
        </a-splitter-panel>
      </a-splitter>
    </a-splitter-panel>
  </a-splitter>
</template>
