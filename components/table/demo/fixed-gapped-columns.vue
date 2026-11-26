<docs>
---
order: 19.5
version: 4.3.0
title:
  zh-CN: 堆叠固定列
  en-US: Stack Fixed Columns
---

## zh-CN

混合固定列，滚动到一定距离进行堆叠，推荐配合 `bordered` 使用。

## en-US

Fixed column only when scroll some distance, and scroll to stack other columns. Recommend use with `bordered`.
</docs>

<template>
  <a-table
    bordered
    class="fixed-gapped-table"
    :columns="columns"
    :data-source="dataSource"
    :scroll="{ x: 'max-content' }"
    :pagination="false"
  >
    <template #bodyCell="{ column }">
      <template v-if="String(column.title || '').startsWith('Action')">
        <a>action</a>
      </template>
    </template>
  </a-table>
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
    title: 'Full Name',
    width: 100,
    dataIndex: 'name',
    fixed: 'start',
  },
  {
    title: 'Age',
    width: 100,
    dataIndex: 'age',
  },
  { title: 'Column 1', dataIndex: 'address', key: '1', fixed: 'start' },
  ...Array.from({ length: 19 }).map((_, idx) => ({
    title: `Column ${idx + 2}`,
    dataIndex: 'address',
    key: `${idx + 2}`,
  })),
  {
    title: 'Action 1',
    key: 'action1',
    fixed: 'end',
    width: 90,
  },
  {
    title: 'Action 2',
    key: 'action2',
    width: 90,
  },
  {
    title: 'Action 3',
    key: 'action3',
    fixed: 'end',
    width: 90,
  },
];

const dataSource: DataType[] = [
  { key: '1', name: 'Olivia', age: 32, address: 'New York Park' },
  { key: '2', name: 'Ethan', age: 40, address: 'London Park' },
];
</script>

<style scoped>
.fixed-gapped-table :deep(.ant-table-body),
.fixed-gapped-table :deep(.ant-table-content) {
  scrollbar-width: thin;
  scrollbar-color: rgba(140, 140, 140, 0.35) transparent;
}
</style>
