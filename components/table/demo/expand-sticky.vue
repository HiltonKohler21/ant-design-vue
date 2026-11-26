<docs>
---
order: 14.6
debug: true
title:
  zh-CN: 可自定义展开位置
  en-US: Customizable expansion position
---

## zh-CN

通过 `Table.EXPAND_COLUMN` 调试自定义展开图标列位置与单元格合并场景。

## en-US

Debug custom expand column placement via `Table.EXPAND_COLUMN` together with rowSpan cells.
</docs>

<template>
  <a-table
    bordered
    :columns="columns"
    :expandable="expandable"
    :data-source="data"
    :scroll="{ x: 'max-content' }"
  >
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'x'">
        <a>Delete</a>
      </template>
    </template>
    <template #expandedRowRender="{ record }">
      <div>{{ record.description }}</div>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { Table } from '@hiltonkohler21/ant-design-vue';
import type { TableColumnsType, TableProps } from '@hiltonkohler21/ant-design-vue';

interface DataType {
  key: number;
  team: string;
  name: string;
  age: number;
  address: string;
  description: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Team',
    dataIndex: 'team',
    key: 'team',
    customCell: (_record, index = 0) => (index % 2 === 0 ? { rowSpan: 2 } : { rowSpan: 0 }),
    width: 100,
  },
  Table.EXPAND_COLUMN as any,
  { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
  {
    title: 'Action',
    dataIndex: '',
    key: 'x',
  },
];

const data: DataType[] = [
  {
    key: 1,
    team: 'Team A',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
  },
  {
    key: 2,
    team: 'Team A',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
  },
  {
    key: 3,
    team: 'Team B',
    name: 'Not Expandable',
    age: 29,
    address: 'Jiangsu No. 1 Lake Park',
    description: 'This not expandable',
  },
  {
    key: 4,
    team: 'Team B',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.',
  },
];

const expandable: TableProps<DataType>['expandable'] = {
  expandedRowOffset: 3,
};
</script>
