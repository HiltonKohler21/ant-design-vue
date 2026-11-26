<docs>
---
order: 1.6
version: 4.3.0
title:
  zh-CN: 多字段搜索
  en-US: Multi field search
---

## zh-CN

使用 `optionFilterProp` 多字段搜索。

## en-US

Use `optionFilterProp` for multi-field search.
</docs>

<template>
  <a-select
    placeholder="Select an option"
    style="width: 200px"
    :show-search="{ optionFilterProp: ['label', 'otherField'] }"
    :options="options"
  />
</template>

<script lang="ts" setup>
import type { SelectProps } from '@hiltonkohler21/ant-design-vue';

const options: SelectProps['options'] = [
  { value: 'a11', label: 'a11', otherField: 'c11' },
  { value: 'b22', label: 'b22', otherField: 'b11' },
  { value: 'c33', label: 'c33', otherField: 'b33' },
  { value: 'd44', label: 'd44', otherField: 'd44' },
];
</script>
