<docs>
---
order: 12
title:
  en-US: size
  zh-CN: 紧凑型
---

## zh-CN

两种紧凑型的列表，小型列表只用于对话框内。

## en-US

There are two compacted table sizes: `medium` and `small`. The `small` size is used in Modals only.

</docs>

<template>
  <a-divider>Medium size table</a-divider>
  <a-table :columns="columns" :data-source="data" size="medium" />
  <a-divider>Small size table</a-divider>
  <a-table :columns="columns" :data-source="data" size="small" />
</template>

<script lang="ts" setup>
import type { TableColumnsType } from '@hiltonkohler21/ant-design-vue';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Age', dataIndex: 'age' },
  { title: 'Address', dataIndex: 'address' },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
];
</script>
