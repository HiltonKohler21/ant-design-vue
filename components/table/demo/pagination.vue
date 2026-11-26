<docs>
---
order: 29.6
title:
  zh-CN: 分页设置
  en-US: Pagination Settings
---

## zh-CN

表格的分页设置。

## en-US

Table pagination settings.
</docs>

<template>
  <div>
    <a-space direction="vertical" :size="10" :style="{ width: '100%', marginBottom: '12px' }">
      <a-radio-group
        v-model:value="top"
        :options="topOptions"
        :style="{ display: 'flex', flexWrap: 'wrap', rowGap: '8px' }"
      />
      <a-radio-group
        v-model:value="bottom"
        :options="bottomOptions"
        :style="{ display: 'flex', flexWrap: 'wrap', rowGap: '8px' }"
      />
    </a-space>
    <a-table
      :columns="columns"
      :pagination="{ placement: [top, bottom] }"
      :data-source="data"
      :scroll="{ x: 'max-content' }"
    >
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
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { TableColumnsType, TablePaginationPlacement } from '@hiltonkohler21/ant-design-vue';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const topOptions = [
  { label: 'topStart', value: 'topStart' },
  { label: 'topCenter', value: 'topCenter' },
  { label: 'topEnd', value: 'topEnd' },
  { label: 'none', value: 'none' },
];

const bottomOptions = [
  { label: 'bottomStart', value: 'bottomStart' },
  { label: 'bottomCenter', value: 'bottomCenter' },
  { label: 'bottomEnd', value: 'bottomEnd' },
  { label: 'none', value: 'none' },
];

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

const top = ref<TablePaginationPlacement>('topStart');
const bottom = ref<TablePaginationPlacement>('bottomEnd');
</script>
