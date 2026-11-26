<docs>
---
order: 25.2
title:
  zh-CN: 拖拽排序
  en-US: Drag sorting
---

## zh-CN

使用 `customRow` 结合原生 HTML5 拖拽事件实现表格行拖拽排序。

## en-US

Use `customRow` with native HTML5 drag-and-drop events to implement row drag sorting.
</docs>

<template>
  <a-table
    row-key="key"
    :columns="columns"
    :data-source="dataSource"
    :custom-row="customRow"
    :pagination="false"
    :scroll="{ x: 'max-content' }"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { TableColumnsType, TableProps } from '@hiltonkohler21/ant-design-vue';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 140,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    width: 80,
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];

const dataSource = ref<DataType[]>([
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address:
      'Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text',
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
    address: 'Sidney No. 1 Lake Park',
  },
]);

const dragIndex = ref<number | null>(null);
const dropIndex = ref<number | null>(null);

const customRow: TableProps<DataType>['customRow'] = (_record, index) => ({
  draggable: true,
  style: {
    cursor: 'move',
    opacity: dragIndex.value === index ? 0.5 : 1,
    outline:
      dropIndex.value === index && dragIndex.value !== index ? '2px dashed #1677ff' : undefined,
  },
  onDragstart: (e: DragEvent) => {
    dragIndex.value = index ?? null;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index ?? ''));
    }
  },
  onDragover: (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    dropIndex.value = index ?? null;
  },
  onDrop: (e: DragEvent) => {
    e.preventDefault();
    const from = dragIndex.value;
    const to = index;
    if (from !== null && to !== undefined && from !== to) {
      const next = [...dataSource.value];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      dataSource.value = next;
    }
    dragIndex.value = null;
    dropIndex.value = null;
  },
  onDragend: () => {
    dragIndex.value = null;
    dropIndex.value = null;
  },
});
</script>
