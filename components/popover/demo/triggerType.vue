<docs>
---
order: 1
title:
  zh-CN: 三种触发方式
  en-US: Three ways to trigger
---

## zh-CN

鼠标移入、聚集、点击。

## en-US

Mouse to click, focus and move in.

</docs>
<template>
  <a-space wrap>
    <a-popover title="Title" trigger="hover">
      <template #content>
        <p style="margin: 0">Content</p>
        <p style="margin: 0">Content</p>
      </template>
      <a-button>Hover me</a-button>
    </a-popover>
    <a-popover title="Title" trigger="focus">
      <template #content>
        <p style="margin: 0">Content</p>
        <p style="margin: 0">Content</p>
      </template>
      <a-button>Focus me</a-button>
    </a-popover>
    <a-popover title="Title" trigger="click">
      <template #content>
        <p style="margin: 0">Content</p>
        <p style="margin: 0">Content</p>
      </template>
      <a-button>Click me</a-button>
    </a-popover>
  </a-space>
</template>
