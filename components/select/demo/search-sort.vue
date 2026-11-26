<docs>
---
order: 3.6
title:
  zh-CN: 带排序的搜索
  en-US: Search with sort
---

## zh-CN

在搜索模式下对过滤结果项进行排序。

## en-US

Search the options with sorting.
</docs>

<template>
  <a-select
    :show-search="{ optionFilterProp: 'label', filterSort }"
    style="width: 200px"
    placeholder="Search to Select"
    :options="options"
  />
</template>

<script lang="ts" setup>
import type { SelectProps } from '@hiltonkohler21/ant-design-vue';

const options: SelectProps['options'] = [
  { value: '1', label: 'Not Identified' },
  { value: '2', label: 'Closed' },
  { value: '3', label: 'Communicated' },
  { value: '4', label: 'Identified' },
  { value: '5', label: 'Resolved' },
  { value: '6', label: 'Cancelled' },
];

const filterSort = (optionA: any, optionB: any) =>
  String(optionA?.label ?? '')
    .toLowerCase()
    .localeCompare(String(optionB?.label ?? '').toLowerCase());
</script>
