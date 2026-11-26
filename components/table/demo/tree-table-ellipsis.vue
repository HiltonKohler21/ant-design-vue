<docs>
---
order: 17.3
debug: true
title:
  zh-CN: 树形数据省略情况测试
  en-US: Tree data ellipsis debug demo
---

## zh-CN

调试树形数据在开启首列固定和自动省略时的布局表现。

## en-US

Debug tree table layout with ellipsis and toggleable fixed first column.
</docs>

<template>
  <a-space align="center" :style="{ marginBottom: '16px' }">
    Fixed first column:
    <a-switch v-model:checked="fixed" />
  </a-space>
  <a-table
    :columns="columns"
    :row-selection="{ columnWidth: 100 }"
    :expandable="{ defaultExpandAllRows: true }"
    :data-source="data"
    :scroll="{ x: 'max-content' }"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { TableColumnsType } from '@hiltonkohler21/ant-design-vue';

interface DataType {
  key: number;
  name: string;
  age: number;
  address: string;
  children?: DataType[];
}

const data: DataType[] = [
  {
    key: 1,
    name: 'John Brown sr. John Brown sr. John Brown sr. John Brown sr. John Brown sr. John Brown sr.',
    age: 60,
    address: 'New York No. 1 Lake Park',
    children: [
      {
        key: 11,
        name: 'John Brown sr. John Brown sr. John Brown sr. John Brown sr. John Brown sr. John Brown sr.',
        age: 42,
        address: 'New York No. 2 Lake Park',
      },
      {
        key: 12,
        name: 'John Brown sr. John Brown sr. John Brown sr. John Brown sr. John Brown sr. John Brown sr.',
        age: 30,
        address: 'New York No. 3 Lake Park',
        children: [
          {
            key: 121,
            name: 'John Brown sr. John Brown sr. John Brown sr. John Brown sr. John Brown sr. John Brown sr.',
            age: 16,
            address: 'New York No. 3 Lake Park',
          },
        ],
      },
      {
        key: 13,
        name: 'Jim Green sr. Jim Green sr. Jim Green sr. Jim Green sr.',
        age: 72,
        address: 'London No. 1 Lake Park',
        children: [
          {
            key: 131,
            name: 'Jim Green. Jim Green. Jim Green. Jim Green. Jim Green. Jim Green.',
            age: 42,
            address: 'London No. 2 Lake Park',
            children: [
              {
                key: 1311,
                name: 'Jim Green jr. Jim Green jr. Jim Green jr. Jim Green jr.',
                age: 25,
                address: 'London No. 3 Lake Park',
              },
              {
                key: 1312,
                name: 'Jimmy Green sr. Jimmy Green sr. Jimmy Green sr.',
                age: 18,
                address: 'London No. 4 Lake Park',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 2,
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
];

const fixed = ref(true);

const columns = computed<TableColumnsType<DataType>>(() => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 240,
    ellipsis: true,
    fixed: fixed.value,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: 100,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
]);
</script>
