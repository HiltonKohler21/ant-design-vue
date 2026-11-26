<docs>
---
order: 6
debug: true
title:
  zh-CN: 水平布局调试
  en-US: Horizontal Debug
---

## zh-CN

水平方向的时间线在不同 `mode` 下的调试示例。

## en-US

Horizontal layout debug across `start`, `end`, and `alternate` modes.
</docs>

<template>
  <a-flex vertical :style="{ maxWidth: '100%' }">
    <a-timeline orientation="horizontal" mode="start" :items="items" :styles="timelineStyles" />
    <a-divider />
    <a-timeline orientation="horizontal" mode="end" :items="items" :styles="timelineStyles" />
    <a-divider />
    <a-timeline orientation="horizontal" mode="alternate" :items="items" :styles="timelineStyles" />
  </a-flex>
</template>

<script lang="ts" setup>
import type { TimelineProps } from '@hiltonkohler21/ant-design-vue';

const longText = 'Long Text '.repeat(5);

const timelineStyles: TimelineProps['styles'] = {
  item: {
    boxShadow: '0 0 1px rgba(255, 0, 0, 0.6)',
  },
};

const items: TimelineProps['items'] = [
  {
    title: longText,
    content: longText,
  },
  {
    content: longText,
  },
  {
    content: longText,
  },
  {
    title: longText,
    content: longText,
  },
];
</script>
