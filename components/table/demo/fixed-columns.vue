<docs>
---
order: 19
title:
  en-US: Fixed Columns
  zh-CN: 固定列
---

## zh-CN

对于列数很多的数据，可以固定前后的列，横向滚动查看其它数据，需要和 `scroll.x` 配合使用。

> 若列头与内容不对齐或出现列重复，请指定**固定列**的宽度 `width`。如果指定 `width` 不生效或出现白色垂直空隙，请尝试建议留一列不设宽度以适应弹性布局，或者检查是否有超长连续字段破坏布局。
>
> 建议指定 `scroll.x` 为大于表格宽度的固定值或百分比。注意，且非固定列宽度之和不要超过 `scroll.x`。

## en-US

To fix some columns and scroll inside other columns, and you must set `scroll.x` meanwhile.

> Specify the width of columns if header and cell do not align properly. If specified width is not working or have gutter between columns, please try to leave one column at least without width to fit fluid layout, or make sure no long word to break table layout.
>
> A fixed value which is greater than table width for `scroll.x` is recommended. The sum of unfixed columns should not greater than `scroll.x`.

</docs>

<template>
  <a-table
    class="fixed-columns-table"
    :pagination="false"
    :columns="columns"
    :data-source="data"
    :scroll="{ x: 'max-content' }"
  >
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'operation'">
        <a>action</a>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import type { TableColumnsType } from '@hiltonkohler21/ant-design-vue';

interface DataItem {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataItem> = [
  { title: 'Full Name', width: 100, dataIndex: 'name', key: 'name', fixed: 'start' },
  { title: 'Age', width: 100, dataIndex: 'age', key: 'age', fixed: 'start', sorter: true },
  ...Array.from({ length: 20 }, (_, i) => ({
    title: `Column ${i + 1}`,
    dataIndex: 'address',
    key: String(i + 1),
  })),
  {
    title: 'Action',
    key: 'operation',
    fixed: 'end',
    width: 100,
  },
];

const data: DataItem[] = [
  {
    key: '1',
    name: 'Olivia',
    age: 32,
    address: 'New York Park',
  },
  {
    key: '2',
    name: 'Ethan',
    age: 40,
    address: 'London Park',
  },
];
</script>

<style scoped>
.fixed-columns-table :deep(.ant-table-body),
.fixed-columns-table :deep(.ant-table-content) {
  scrollbar-width: thin;
  scrollbar-color: rgba(140, 140, 140, 0.35) transparent;
}
</style>
