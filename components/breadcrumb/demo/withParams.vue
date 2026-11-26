<docs>
---
order: 2
title:
  zh-CN: 带有参数的
  en-US: With Params
---

## zh-CN

带有路由参数的。

## en-US

With route params.
</docs>

<template>
  <a-breadcrumb :items="items" :params="{ id: 1 }" />
</template>

<script lang="ts" setup>
import type { BreadcrumbProps } from '@hiltonkohler21/ant-design-vue';

const items: BreadcrumbProps['items'] = [
  {
    title: 'Users',
  },
  {
    title: ':id',
    href: '',
  },
];
</script>
