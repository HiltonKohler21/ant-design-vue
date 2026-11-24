<docs>
---
order: 26.6
title:
  zh-CN: 自定义单元格省略提示
  en-US: ellipsis column custom tooltip
---

## zh-CN

设置 `column.ellipsis.showTitle` 关闭单元格内容自动省略后默认的 `title` 提示，使用 `Tooltip` 替代。

## en-US

Ellipsis cell content via setting `column.ellipsis.showTitle`, use `Tooltip` instead of the html title attribute.
</docs>

<template>
  <a-table :columns="columns" :data-source="data">
    <template #bodyCell="{ column, text }">
      <template v-if="column.key === 'name'">
        <a>{{ text }}</a>
      </template>
      <template v-else-if="String(column.key || '').startsWith('address')">
        <a-tooltip placement="topLeft" :title="text">
          {{ text }}
        </a-tooltip>
      </template>
    </template>
  </a-table>
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
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: 80,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address 1',
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Long Column Long Column Long Column',
    dataIndex: 'address',
    key: 'address 2',
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Long Column Long Column',
    dataIndex: 'address',
    key: 'address 3',
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Long Column',
    dataIndex: 'address',
    key: 'address 4',
    ellipsis: {
      showTitle: false,
    },
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 2 Lake Park, London No. 2 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park, Sydney No. 1 Lake Park',
  },
];
</script>
