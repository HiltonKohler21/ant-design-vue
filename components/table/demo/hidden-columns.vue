<docs>
---
order: 21
version: 4.3.0
title:
  zh-CN: 隐藏列
  en-US: Hidden Columns
---

## zh-CN

通过设置列的 `hidden` 属性动态控制列的显示与隐藏。

## en-US

Dynamically show or hide table columns with the `hidden` column property.

</docs>

<template>
  <a-divider>Columns displayed</a-divider>
  <a-checkbox-group v-model:value="checkedList" :options="options" />
  <a-table
    :columns="visibleColumns"
    :data-source="data"
    :pagination="false"
    style="margin-top: 24px"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { TableColumnsType } from '@hiltonkohler21/ant-design-vue';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
  { title: 'Column 1', dataIndex: 'address', key: '1' },
  { title: 'Column 2', dataIndex: 'address', key: '2' },
  { title: 'Column 3', dataIndex: 'address', key: '3' },
  { title: 'Column 4', dataIndex: 'address', key: '4' },
  { title: 'Column 5', dataIndex: 'address', key: '5' },
  { title: 'Column 6', dataIndex: 'address', key: '6' },
  { title: 'Column 7', dataIndex: 'address', key: '7' },
  { title: 'Column 8', dataIndex: 'address', key: '8' },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
];

const defaultCheckedList = columns.map(item => String(item.key));
const checkedList = ref<string[]>(defaultCheckedList);

const options = columns.map(({ key, title }) => ({
  label: String(title),
  value: String(key),
}));

const visibleColumns = computed(() =>
  columns.map(item => ({
    ...item,
    hidden: !checkedList.value.includes(String(item.key)),
  })),
);
</script>
