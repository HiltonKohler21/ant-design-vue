<docs>
---
order: 5
debug: true
title:
  zh-CN: Table 固定列
  en-US: Fixed columns in Table
---

## zh-CN

在固定列 Table 中使用水印的调试示例。

## en-US

Debug example for Watermark wrapping a Table with fixed columns.
</docs>

<template>
  <a-watermark content="Ant Design">
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      :scroll="{ x: 'max-content' }"
    >
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'operation'">
          <a>action</a>
        </template>
      </template>
    </a-table>
  </a-watermark>
</template>

<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Full Name',
    width: 120,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
  },
  {
    title: 'Age',
    width: 100,
    dataIndex: 'age',
    key: 'age',
    fixed: 'left',
  },
  ...Array.from({ length: 8 }, (_, index) => ({
    title: `Column ${index + 1}`,
    dataIndex: 'address',
    key: `column-${index + 1}`,
    width: 120,
  })),
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
  },
];

const dataSource: DataType[] = [
  { key: '1', name: 'Olivia', age: 32, address: 'New York Park' },
  { key: '2', name: 'Ethan', age: 40, address: 'London Park' },
];
</script>
