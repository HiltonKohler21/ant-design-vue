<docs>
---
order: 2
title:
  en-US: selection
  zh-CN: 可选择
---

## zh-CN

第一列是联动的选择框。可以通过选择框类型切换多选或单选。

## en-US

Rows can be selectable by making first column as a selectable column. You can switch between checkbox and radio selection.

</docs>

<template>
  <div>
    <a-radio-group v-model:value="selectionType">
      <a-radio value="checkbox">Checkbox</a-radio>
      <a-radio value="radio">radio</a-radio>
    </a-radio-group>
    <a-divider />
    <a-table :row-selection="rowSelection" :columns="columns" :data-source="data">
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex === 'name'">
          <a>{{ text }}</a>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { TableColumnType, TableProps } from 'ant-design-vue';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const selectionType = ref<'checkbox' | 'radio'>('checkbox');

const columns: TableColumnType<DataType>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sydney No. 1 Lake Park',
  },
];

const rowSelection = computed<TableProps<DataType>['rowSelection']>(() => ({
  type: selectionType.value,
  onChange: (selectedRowKeys: (string | number)[], selectedRows: DataType[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record: DataType) => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
}));
</script>
