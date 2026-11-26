<docs>
---
order: 17.6
debug: true
title:
  zh-CN: 树形数据保留 key 测试
  en-US: Tree data preserveSelectedRowKeys debug
---

## zh-CN

调试树形数据分页时 `checkStrictly` 与 `preserveSelectedRowKeys` 的组合行为。

## en-US

Debug `checkStrictly` and `preserveSelectedRowKeys` with paginated tree data.
</docs>

<template>
  <a-space align="center" wrap :style="{ marginBottom: '16px' }">
    <span>CheckStrictly:</span>
    <a-switch v-model:checked="checkStrictly" />
    <span>preserveSelectedRowKeys:</span>
    <a-switch v-model:checked="preserveSelectedRowKeys" />
  </a-space>
  <a-table
    :columns="columns"
    :row-selection="rowSelection"
    :data-source="dataSource"
    :pagination="{ defaultPageSize: 5 }"
    :scroll="{ x: 'max-content' }"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { TableColumnsType, TableProps } from '@hiltonkohler21/ant-design-vue';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  children?: DataType[];
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
    width: '12%',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width: '30%',
    key: 'address',
  },
];

const dataSource: DataType[] = Array.from({ length: 15 }).map((_, i) => ({
  key: `key${i}`,
  name: `Edward ${i}`,
  age: 32,
  address: `London Park no. ${i}`,
  children: [
    {
      key: `subKey${i}1`,
      name: 'Brown',
      age: 16,
      address: 'New York No. 3 Lake Park',
    },
    {
      key: `subKey${i}2`,
      name: 'Jimmy',
      age: 16,
      address: 'New York No. 3 Lake Park',
    },
  ],
}));

const checkStrictly = ref(false);
const preserveSelectedRowKeys = ref(true);

const rowSelection = computed<TableProps<DataType>['rowSelection']>(() => ({
  checkStrictly: checkStrictly.value,
  preserveSelectedRowKeys: preserveSelectedRowKeys.value,
}));
</script>
