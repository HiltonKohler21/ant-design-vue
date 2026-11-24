<docs>
---
order: 31
title:
  en-US: Resizable column
  zh-CN: 可伸缩列
---

## zh-CN

设置 resizable 开启拖动列

鼠标 hover 到 Name、 Age 分割线上体验一下吧

## en-US

set resizable for drag column
</docs>

<template>
  <a-table :columns="columns" :data-source="data" @resize-column="handleResizeColumn">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>
          {{ record.name }}
        </a>
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
import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';

const data = [
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

const columns = ref<TableColumnsType>([
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    resizable: true,
    width: 150,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    resizable: true,
    width: 100,
    minWidth: 100,
    maxWidth: 200,
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
]);

function handleResizeColumn(w: number, col: any) {
  col.width = w;
}
</script>
