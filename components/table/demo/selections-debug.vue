<docs>
---
order: 30.6
debug: true
title:
  zh-CN: 带下拉箭头的表头
  en-US: selections with icon
---

## zh-CN

调试带边框表格中开启默认选择项下拉箭头时的表头对齐。

## en-US

Debug bordered table selection header alignment when `selections: true` dropdown icon is enabled.
</docs>

<template>
  <a-table
    bordered
    :row-selection="{ type: 'checkbox', selections: true }"
    :columns="columns"
    :data-source="data"
  />
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
