<docs>
---
order: 4
title:
  en-US: Custom selection
  zh-CN: 自定义选择项
---

## zh-CN

通过 `rowSelection.selections` 自定义选择项，默认不显示下拉选项，设为 `true` 时显示默认选择项。

## en-US

Use `rowSelection.selections` custom selections, default no select dropdown, show default selections via setting to `true`.

</docs>

<template>
  <a-table :row-selection="rowSelection" :columns="columns" :data-source="data" />
</template>

<script lang="ts" setup>
import { computed, ref, unref } from 'vue';
import { Table } from '@hiltonkohler21/ant-design-vue';
import type { TableColumnsType, TableProps } from '@hiltonkohler21/ant-design-vue';

interface DataType {
  key: string | number;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
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

const data: DataType[] = Array.from({ length: 46 }).map((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32,
  address: `London, Park Lane no. ${i}`,
}));

const selectedRowKeys = ref<DataType['key'][]>([]);

const onSelectChange = (changeableRowKeys: DataType['key'][]) => {
  console.log('selectedRowKeys changed: ', changeableRowKeys);
  selectedRowKeys.value = changeableRowKeys;
};

const rowSelection = computed<TableProps<DataType>['rowSelection']>(() => ({
  selectedRowKeys: unref(selectedRowKeys),
  onChange: onSelectChange,
  selections: [
    Table.SELECTION_ALL,
    Table.SELECTION_INVERT,
    Table.SELECTION_NONE,
    {
      key: 'odd',
      text: 'Select Odd Row',
      onSelect: changeableRowKeys => {
        selectedRowKeys.value = changeableRowKeys.filter((_, index) => index % 2 === 0);
      },
    },
    {
      key: 'even',
      text: 'Select Even Row',
      onSelect: changeableRowKeys => {
        selectedRowKeys.value = changeableRowKeys.filter((_, index) => index % 2 !== 0);
      },
    },
  ],
}));
</script>
