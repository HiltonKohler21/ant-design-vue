<docs>
---
order: 25.6
title:
  zh-CN: 拖拽手柄列
  en-US: Drag sorting with handler
---

## zh-CN

使用原生 HTML5 拖拽事件结合拖拽手柄列，仅在按住手柄图标时允许拖拽行进行排序。

## en-US

Implement drag sorting with a dedicated drag handle column using native HTML5 drag-and-drop events.
</docs>

<template>
  <a-table
    row-key="key"
    :columns="columns"
    :data-source="dataSource"
    :custom-row="customRow"
    :pagination="false"
    :scroll="{ x: 'max-content' }"
  >
    <template #bodyCell="{ column, index }">
      <template v-if="column.key === 'sort'">
        <a-button
          type="text"
          size="small"
          draggable="true"
          :style="{ cursor: 'move' }"
          @dragstart="onHandleDragStart($event, index)"
          @dragend="onDragEnd"
        >
          <template #icon>
            <HolderOutlined />
          </template>
        </a-button>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { HolderOutlined } from '@ant-design/icons-vue';
import type { TableColumnsType, TableProps } from '@hiltonkohler21/ant-design-vue';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
  { key: 'sort', align: 'center', width: 80 },
  { title: 'Name', dataIndex: 'name', width: 140 },
  { title: 'Age', dataIndex: 'age', width: 80 },
  { title: 'Address', dataIndex: 'address' },
];

const dataSource = ref<DataType[]>([
  { key: '1', name: 'John Brown', age: 32, address: 'Long text Long' },
  { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  { key: '3', name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park' },
]);

const dragIndex = ref<number | null>(null);
const dropIndex = ref<number | null>(null);

const onHandleDragStart = (e: DragEvent, index: number) => {
  dragIndex.value = index;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  }
};

const onDragEnd = () => {
  dragIndex.value = null;
  dropIndex.value = null;
};

const customRow: TableProps<DataType>['customRow'] = (_record, index) => ({
  style: {
    opacity: dragIndex.value === index ? 0.5 : 1,
    outline:
      dropIndex.value === index && dragIndex.value !== null && dragIndex.value !== index
        ? '2px dashed #1677ff'
        : undefined,
  },
  onDragover: (e: DragEvent) => {
    if (dragIndex.value === null) return;
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
    onDragEnd();
  },
});
</script>
