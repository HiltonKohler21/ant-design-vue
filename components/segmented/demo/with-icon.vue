<docs>
---
order: 9
title:
  zh-CN: 设置图标
  en-US: With Icon
---

## zh-CN

给 Segmented Item 设置 Icon。`icon` 也支持第三方图标库的裸 `<svg>` 元素，会自动与文字居中对齐。

## en-US

Set `icon` for Segmented Item. `icon` also accepts a bare `<svg>` element from a third-party icon library, which stays vertically centred with the label.
</docs>

<template>
  <a-segmented :options="options" />
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons-vue';
import type { SegmentedProps } from 'ant-design-vue';

// Icons from third-party libraries render as a bare `<svg>` rather than an `.anticon` wrapper.
// It stays vertically centred with the label.
const CalendarIcon = () =>
  h(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: '1em',
      height: '1em',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 2,
      'aria-hidden': 'true',
    },
    [
      h('rect', { x: 3, y: 4, width: 18, height: 18, rx: 2 }),
      h('path', { d: 'M16 2v4M8 2v4M3 10h18' }),
    ],
  );

const options: SegmentedProps['options'] = [
  { label: 'List', value: 'List', icon: h(BarsOutlined) },
  { label: 'Kanban', value: 'Kanban', icon: h(AppstoreOutlined) },
  { label: 'Calendar', value: 'Calendar', icon: CalendarIcon },
];
</script>
