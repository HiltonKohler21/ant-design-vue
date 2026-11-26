<docs>
---
order: 10
title:
  zh-CN: 只设置图标
  en-US: With Icon only
---

## zh-CN

在 Segmented Item 选项中只设置 Icon。

## en-US

Set `icon` without `label` for Segmented Item.
</docs>

<template>
  <a-segmented :options="options" />
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons-vue';
import type { SegmentedProps } from '@hiltonkohler21/ant-design-vue';

const options: SegmentedProps['options'] = [
  { value: 'List', icon: h(BarsOutlined) },
  { value: 'Kanban', icon: h(AppstoreOutlined) },
];
</script>
