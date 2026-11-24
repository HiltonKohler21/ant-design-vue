<docs>
---
order: 8
debug: true
title:
  zh-CN: 禁用下的 Tooltip
  en-US: Disabled to show Tooltip
---

## zh-CN

禁用状态下的 Checkbox 包裹在 Popover 中仍可触发悬停提示。

## en-US

Disabled Checkbox wrapped in Popover still triggers hover popup.
</docs>

<template>
  <div :style="{ padding: '32px' }">
    <a-popover content="xxxx" trigger="hover">
      <a-checkbox disabled checked />
    </a-popover>
  </div>
</template>
