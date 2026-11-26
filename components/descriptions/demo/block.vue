<docs>
---
order: 12
title:
  zh-CN: 整行
  en-US: Row
---

## zh-CN

整行的展示。

## en-US

Display of the entire line.
</docs>

<template>
  <a-descriptions bordered title="User Info" :items="items" />
</template>

<script lang="ts" setup>
import type { DescriptionsProps } from '@hiltonkohler21/ant-design-vue';

const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'UserName',
    children: 'Zhou Maomao',
  },
  {
    key: '2',
    label: 'Live',
    span: 'filled',
    children: 'Hangzhou, Zhejiang',
  },
  {
    key: '3',
    label: 'Remark',
    span: 'filled',
    children: 'empty',
  },
  {
    key: '4',
    label: 'Address',
    span: 1,
    children: 'No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China',
  },
];
</script>
