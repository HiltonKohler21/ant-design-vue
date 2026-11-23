<docs>
---
order: 1
title:
  zh-CN: 平滑过渡
  en-US: Smooth Transition
---

## zh-CN

使用 `Tooltip.UniqueProvider`（`<a-tooltip-unique-provider>`）包裹多个相邻的 Tooltip，使它们共享同一个浮层容器并在切换时平滑移动过渡。

## en-US

Wrap sibling `Tooltip` components inside `Tooltip.UniqueProvider` (`<a-tooltip-unique-provider>`) so they share a single popup container and smoothly transition between triggers.

</docs>

<template>
  <a-tooltip-unique-provider>
    <a-flex vertical gap="small">
      <a-flex gap="small" justify="center">
        <a-tooltip title="Top Left Tooltip" placement="top">
          <a-button type="primary">Top 1</a-button>
        </a-tooltip>
        <a-tooltip title="Top Right Tooltip" placement="top">
          <a-button type="primary">Top 2</a-button>
        </a-tooltip>
      </a-flex>
      <a-flex gap="small" justify="center">
        <a-tooltip title="Bottom Left Tooltip" placement="bottom">
          <a-button>Bottom 1</a-button>
        </a-tooltip>
        <a-tooltip title="Bottom Right Tooltip" placement="bottom">
          <a-button>Bottom 2</a-button>
        </a-tooltip>
      </a-flex>
    </a-flex>
  </a-tooltip-unique-provider>
</template>
