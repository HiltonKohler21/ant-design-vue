<docs>
---
order: 25.4
title:
  zh-CN: 列拖拽排序
  en-US: Drag Column sorting
---

## zh-CN

使用 `customHeaderCell` 与 `customCell` 结合原生 HTML5 拖拽事件实现表格列拖拽排序。

## en-US

Use `customHeaderCell` and `customCell` with native HTML5 drag-and-drop events to implement column drag sorting.
</docs>

<template>
  <a-table
    row-key="key"
    :columns="tableColumns"
    :data-source="dataSource"
    :pagination="false"
    :scroll="{ x: 'max-content' }"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { CSSProperties } from 'vue';
import type { TableColumnsType } from '@hiltonkohler21/ant-design-vue';

interface DataType {
  key: string;
  name: string;
  gender: string;
  age: number;
  email: string;
  address: string;
}

const dataSource: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    gender: 'male',
    age: 32,
    email: 'JohnBrown@example.com',
    address: 'London No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    gender: 'female',
    age: 42,
    email: 'jimGreen@example.com',
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    gender: 'female',
    age: 32,
    email: 'JoeBlack@example.com',
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'George Hcc',
    gender: 'male',
    age: 20,
    email: 'george@example.com',
    address: 'Sidney No. 1 Lake Park',
  },
];

interface SimpleColumn {
  key: string;
  title: string;
  dataIndex: keyof DataType;
}

const columnList = ref<SimpleColumn[]>([
  { key: '0', title: 'Name', dataIndex: 'name' },
  { key: '1', title: 'Gender', dataIndex: 'gender' },
  { key: '2', title: 'Age', dataIndex: 'age' },
  { key: '3', title: 'Email', dataIndex: 'email' },
  { key: '4', title: 'Address', dataIndex: 'address' },
]);

const activeKey = ref<string | null>(null);
const overKey = ref<string | null>(null);
const dragDirection = ref<'left' | 'right'>('right');

const getDragStyle = (colKey: string): CSSProperties => {
  if (activeKey.value && activeKey.value === colKey) {
    return { backgroundColor: 'rgba(128, 128, 128, 0.25)', opacity: 0.55 };
  }
  if (overKey.value && overKey.value === colKey && activeKey.value !== overKey.value) {
    return dragDirection.value === 'right'
      ? { borderInlineEnd: '2px dashed #1677ff' }
      : { borderInlineStart: '2px dashed #1677ff' };
  }
  return {};
};

const tableColumns = computed<TableColumnsType<DataType>>(() =>
  columnList.value.map(col => ({
    ...col,
    customHeaderCell: () => ({
      draggable: true,
      style: {
        cursor: 'move',
        userSelect: 'none',
        ...getDragStyle(col.key),
      },
      onDragstart: (e: DragEvent) => {
        activeKey.value = col.key;
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', col.key);
        }
      },
      onDragover: (e: DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'move';
        }
        const fromIdx = columnList.value.findIndex(item => item.key === activeKey.value);
        const toIdx = columnList.value.findIndex(item => item.key === col.key);
        overKey.value = col.key;
        dragDirection.value = toIdx > fromIdx ? 'right' : 'left';
      },
      onDrop: (e: DragEvent) => {
        e.preventDefault();
        const fromIdx = columnList.value.findIndex(item => item.key === activeKey.value);
        const toIdx = columnList.value.findIndex(item => item.key === col.key);
        if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
          const next = [...columnList.value];
          const [moved] = next.splice(fromIdx, 1);
          next.splice(toIdx, 0, moved);
          columnList.value = next;
        }
        activeKey.value = null;
        overKey.value = null;
      },
      onDragend: () => {
        activeKey.value = null;
        overKey.value = null;
      },
    }),
    customCell: () => ({
      style: getDragStyle(col.key),
    }),
  })),
);
</script>
