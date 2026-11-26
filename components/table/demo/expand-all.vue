<docs>
---
order: 14.3
version: 4.3.0
title:
  zh-CN: 展开全部行
  en-US: Expand all rows
---

## zh-CN

使用 `expandedRowRender` 时，可以通过 `showExpandAll` 在展开列的表头中显示全部展开控件。该控件只影响当前页中允许展开的行。

## en-US

With `expandedRowRender`, set `showExpandAll` to display an expand-all control in the expand column header. The control only affects expandable rows on the current page.
</docs>

<template>
  <a-table :columns="columns" :data-source="data" :expandable="expandable">
    <template #expandedRowRender="{ record }">
      <p style="margin: 0">{{ record.description }}</p>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import type { TableColumnsType, TableProps } from '@hiltonkohler21/ant-design-vue';

interface DataType {
  key: number;
  name: string;
  age: number;
  address: string;
  description: string;
}

const columns: TableColumnsType<DataType> = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Age', dataIndex: 'age' },
  { title: 'Address', dataIndex: 'address' },
];

const data: DataType[] = [
  {
    key: 1,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York.',
  },
  {
    key: 2,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London.',
  },
  {
    key: 3,
    name: 'Not Expandable',
    age: 29,
    address: 'Jiangsu No. 1 Lake Park',
    description: 'This row is not expandable.',
  },
  {
    key: 4,
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sydney.',
  },
];

const expandable: TableProps<DataType>['expandable'] = {
  rowExpandable: record => record.name !== 'Not Expandable',
  showExpandAll: true,
};
</script>
