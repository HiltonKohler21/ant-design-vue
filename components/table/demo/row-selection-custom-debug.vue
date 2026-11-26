<docs>
---
order: 29.8
debug: true
title:
  zh-CN: 自定义选择项组
  en-US: Custom selection group
---

## zh-CN

调试使用 `rowSelection.renderCell` 配合 `rowSpan` 合并选择列单元格。

## en-US

Debug custom `rowSelection.renderCell` returning merged `rowSpan` selection cells.
</docs>

<template>
  <a-table :row-selection="rowSelection" :columns="columns" :data-source="dataSource" />
</template>

<script lang="ts" setup>
import { h } from 'vue';
import type { TableColumnsType, TableProps } from '@hiltonkohler21/ant-design-vue';

interface DataType {
  key: number;
  name: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
];

const dataSource: DataType[] = Array.from({ length: 46 }).map((_, i) => ({
  key: i,
  name: i % 2 === 0 ? `Edward King ${i}` : 'Another Row',
}));

const rowSelection: TableProps<DataType>['rowSelection'] = {
  renderCell: (checked, _record, index, node) => ({
    props: { rowSpan: index % 2 === 0 ? 2 : 0 },
    children: h('span', null, [`${String(checked)}: `, node]),
  }),
};
</script>
