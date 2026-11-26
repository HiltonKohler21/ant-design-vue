<docs>
---
order: 26.3
version: 4.3.0
title:
  zh-CN: 统一列配置
  en-US: Shared column props
---

## zh-CN

通过 `column` 在 Table 上统一设置列属性，并按需在单列上覆盖。

## en-US

Use `column` to set shared column props on the table and override them per column when needed.
</docs>

<template>
  <a-table
    :columns="columns"
    :data-source="data"
    :column="{ align: 'center', ellipsis: true }"
    :pagination="false"
    :scroll="{ x: 'max-content' }"
  />
</template>

<script lang="ts" setup>
import type { TableColumnsType } from '@hiltonkohler21/ant-design-vue';

interface DataType {
  key: string;
  name: string;
  address: string;
  description: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 140,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    width: 180,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    align: 'left',
    width: 220,
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    description: 'Shared column props let repeated column settings live on the table.',
    address: 'No. 1 Lake Park Road, Hangzhou, Zhejiang, China',
  },
  {
    key: '2',
    name: 'Jim Green',
    description: 'Columns can still override the default alignment or other shared props.',
    address: 'No. 99 Garden Avenue, Pudong, Shanghai, China',
  },
];
</script>
