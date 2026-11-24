<docs>
---
order: 12.5
debug: true
title:
  zh-CN: 紧凑型（窄容器）
  en-US: Narrow size
---

## zh-CN

调试窄容器下的紧凑表格与分页展示效果。

## en-US

Debug small table and pagination layout in a narrow container.
</docs>

<template>
  <div :style="{ width: '300px', maxWidth: '100%' }">
    <a-table
      :columns="columns"
      :data-source="dataSource"
      size="small"
      :pagination="{ defaultCurrent: 13 }"
      :scroll="{ x: 'max-content' }"
    />
  </div>
</template>

<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';

interface DataType {
  key: number;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];

const dataSource: DataType[] = Array.from({ length: 200 }).map((_, key) => ({
  key,
  name: 'Sample Name',
  age: 30 + (key % 5),
  address: `Sample Address ${key}`,
}));
</script>
