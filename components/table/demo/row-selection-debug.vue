<docs>
---
order: 4.5
debug: true
title:
  zh-CN: 选择性能
  en-US: Selection Perf
---

## zh-CN

调试大数量行选择时的渲染性能。

## en-US

Debug row selection rendering performance with dynamic row count.
</docs>

<template>
  <a-space direction="vertical" :style="{ width: '100%' }">
    <a-input-number v-model:value="count" :min="0" :max="500" />
    <a-table
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="data"
      :pagination="false"
      :scroll="{ x: 'max-content' }"
    />
  </a-space>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { TableColumnsType, TableProps } from '@hiltonkohler21/ant-design-vue';

interface DataType {
  key: number;
  name: string;
  age: number;
  address: string;
}

const shouldCellUpdate = (record: DataType, prevRecord: DataType) => record !== prevRecord;

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    shouldCellUpdate,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    shouldCellUpdate,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    shouldCellUpdate,
  },
];

const genData = (length: number): DataType[] =>
  Array.from({ length }).map((_, i) => ({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  }));

const count = ref(50);
const data = computed(() => genData(count.value || 0));
const selectedRowKeys = ref<(string | number)[]>([]);

const rowSelection = computed<TableProps<DataType>['rowSelection']>(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: keys => {
    selectedRowKeys.value = keys;
  },
}));
</script>
