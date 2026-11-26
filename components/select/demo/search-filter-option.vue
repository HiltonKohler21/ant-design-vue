<docs>
---
order: 1.5
title:
  zh-CN: 自定义搜索
  en-US: Custom Search
---

## zh-CN

使用 `filterOption` 自定义搜索。

## en-US

Customize search using `filterOption`.
</docs>

<template>
  <a-select
    :show-search="{ filterOption }"
    placeholder="Select a person"
    style="width: 200px"
    :options="options"
  />
</template>

<script lang="ts" setup>
import type { SelectProps } from '@hiltonkohler21/ant-design-vue';

const options: SelectProps['options'] = [
  { value: '1', label: 'Jack' },
  { value: '2', label: 'Lucy' },
  { value: '3', label: 'Tom' },
];

const filterOption = (input: string, option?: any) =>
  String(option?.label ?? '')
    .toLowerCase()
    .includes(input.toLowerCase());
</script>
