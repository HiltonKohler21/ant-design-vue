<docs>
---
order: 8
title:
  zh-CN: Debug Routes
  en-US: Debug Routes
---

## zh-CN

原 `routes` 调试。

## en-US

Origin `routes` debug.
</docs>

<template>
  <a-breadcrumb :routes="routes" />
</template>

<script lang="ts" setup>
import type { BreadcrumbProps } from '@hiltonkohler21/ant-design-vue';

const routes: BreadcrumbProps['routes'] = [
  {
    path: '/home',
    breadcrumbName: 'Home',
  },
  {
    path: '/user',
    breadcrumbName: 'User',
    children: [
      {
        path: '/user1',
        breadcrumbName: 'User1',
      },
      {
        path: '/user2',
        breadcrumbName: 'User2',
      },
    ],
  },
];
</script>
