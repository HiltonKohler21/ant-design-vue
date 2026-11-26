<docs>
---
order: 3
debug: true
title:
  zh-CN: 最后一个及排序
  en-US: Pending and Reversing
---

## zh-CN

使用传统的 `pending` 与 `pendingDot` 属性配置幽灵节点（推荐使用 `items` 中 `loading` 配置替代）。

## en-US

Legacy `pending` and `pendingDot` props debug (prefer `item.loading` in `items`).
</docs>

<template>
  <a-flex vertical gap="middle" align="flex-start">
    <a-timeline pending="Recording..." :items="items" />
    <a-timeline pending="Recording..." pending-dot="🔴" :items="items" />
  </a-flex>
</template>

<script lang="ts" setup>
import type { TimelineProps } from '@hiltonkohler21/ant-design-vue';

const items: TimelineProps['items'] = [
  {
    content: 'Create a services site 2015-09-01',
  },
];
</script>
