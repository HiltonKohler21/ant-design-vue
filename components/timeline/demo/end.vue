<docs>
---
order: 8
title:
  zh-CN: 另一侧时间轴点
  en-US: End alternate
---

## zh-CN

时间轴点可以在另一侧。

## en-US

End alternate timeline.
</docs>

<template>
  <a-timeline mode="end" :items="items" />
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { ClockCircleOutlined } from '@ant-design/icons-vue';
import type { TimelineProps } from '@hiltonkohler21/ant-design-vue';

const items: TimelineProps['items'] = [
  {
    content: 'Create a services site 2015-09-01',
  },
  {
    content: 'Solve initial network problems 2015-09-01',
  },
  {
    icon: h(ClockCircleOutlined),
    color: 'red',
    content: 'Technical testing 2015-09-01',
  },
  {
    content: 'Network problems being solved 2015-09-01',
  },
];
</script>
