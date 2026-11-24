<docs>
---
order: 0
title:
  en-US: Basic Usage
  zh-CN: 基本用法
---

## zh-CN

简单的表格，最后一列是各种操作。

## en-US

Simple table with actions.
</docs>

<template>
  <a-table :columns="columns" :data-source="data">
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.key === 'name'">
        <a>{{ text }}</a>
      </template>
      <template v-else-if="column.key === 'tags'">
        <a-flex gap="small" align="center" wrap="wrap">
          <a-tag
            v-for="tag in record.tags"
            :key="tag"
            :color="tag === 'kawaii' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </a-flex>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-space size="middle">
          <a>Invite {{ record.name }}</a>
          <a>Delete</a>
        </a-space>
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
  tags: string[];
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: 'Action',
    key: 'action',
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['kawaii'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];
</script>
