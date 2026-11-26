<docs>
---
order: 5
title:
  zh-CN: 独立的分隔符
  en-US: Configuring the Separator Independently
---

## zh-CN

自定义单独的分隔符。

## en-US

Customize separator for each other.
</docs>

<template>
  <a-breadcrumb separator="" :items="items" />
</template>

<script lang="ts" setup>
import type { BreadcrumbProps } from '@hiltonkohler21/ant-design-vue';

const items: BreadcrumbProps['items'] = [
  {
    title: 'Location',
  },
  {
    type: 'separator',
    separator: ':',
  },
  {
    href: '',
    title: 'Application Center',
  },
  {
    type: 'separator',
  },
  {
    href: '',
    title: 'Application List',
  },
  {
    type: 'separator',
  },
  {
    title: 'An Application',
  },
];
</script>
