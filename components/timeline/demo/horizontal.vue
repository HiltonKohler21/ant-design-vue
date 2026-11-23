<docs>
---
order: 7
title:
  zh-CN: 水平时间轴
  en-US: Horizontal
---

## zh-CN

通过 `orientation="horizontal"` 可以水平展示时间轴。

## en-US

Display timeline horizontally with `orientation="horizontal"`.

</docs>

<template>
  <a-timeline orientation="horizontal" :items="items" />
</template>
<script lang="ts" setup>
import type { TimelineItemType } from 'ant-design-vue';

const items: TimelineItemType[] = [
  { title: '2015-09-01', content: 'Create a services site' },
  { title: '2015-09-02', content: 'Solve initial network problems' },
  { title: '2015-09-03', content: 'Technical testing' },
  { title: '2015-09-04', content: 'Network problems being solved' },
];
</script>
