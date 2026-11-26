<docs>
---
order: 5
title:
  zh-CN: 水平布局
  en-US: Horizontal
---

## zh-CN

通过 `orientation="horizontal"` 可以水平展示时间轴，支持 `start`、`end`、`alternate` 三种布局模式。

## en-US

Display timeline horizontally with `orientation="horizontal"`, supporting `start`, `end`, and `alternate` modes.

</docs>

<template>
  <a-flex vertical>
    <a-timeline orientation="horizontal" mode="start" :items="items" />
    <a-divider />
    <a-timeline orientation="horizontal" mode="end" :items="items" />
    <a-divider />
    <a-timeline orientation="horizontal" mode="alternate" :items="items" />
  </a-flex>
</template>
<script lang="ts" setup>
import type { TimelineItemType } from '@hiltonkohler21/ant-design-vue';

const items: TimelineItemType[] = [
  { content: 'Init' },
  { content: 'Start' },
  { content: 'Pending' },
  { content: 'Complete' },
];
</script>
