<docs>
---
order: 6
title:
  zh-CN: 拖拽排序
  en-US: Drag sorting
---

## zh-CN

使用原生拖拽事件和拖拽手柄，实现列表项的拖拽排序。

## en-US

Implement drag sorting for list items with a drag handle using native HTML5 drag-and-drop events.
</docs>

<template>
  <a-listy :items="data" :height="400" row-key="id">
    <template #item="{ item }">
      <div
        :draggable="activeHandleId === item.id"
        :style="{
          opacity: draggingId === item.id ? 0.5 : 1,
          backgroundColor:
            dragOverId === item.id && draggingId !== item.id
              ? 'rgba(22, 119, 255, 0.08)'
              : undefined,
          borderRadius: '4px',
          transition: 'background-color 0.2s ease',
        }"
        @dragstart="onDragStart($event, item.id)"
        @dragover.prevent="onDragOver(item.id)"
        @drop.prevent="onDrop(item.id)"
        @dragend="onDragEnd"
      >
        <a-flex align="center" gap="small">
          <a-button
            type="text"
            size="small"
            :style="{ cursor: 'move' }"
            @mousedown="activeHandleId = item.id"
            @mouseup="activeHandleId = null"
          >
            <template #icon>
              <HolderOutlined />
            </template>
          </a-button>
          <span>{{ item.content }}</span>
        </a-flex>
      </div>
    </template>
  </a-listy>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { HolderOutlined } from '@ant-design/icons-vue';

interface Item {
  id: number;
  content: string;
}

const data = ref<Item[]>(
  Array.from({ length: 20 }, (_, index) => ({
    id: index,
    content: `Item ${index}`,
  })),
);

const activeHandleId = ref<number | null>(null);
const draggingId = ref<number | null>(null);
const dragOverId = ref<number | null>(null);

const onDragStart = (e: DragEvent, id: number) => {
  if (activeHandleId.value !== id) {
    e.preventDefault();
    return;
  }
  draggingId.value = id;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(id));
  }
};

const onDragOver = (id: number) => {
  if (draggingId.value !== null && draggingId.value !== id) {
    dragOverId.value = id;
  }
};

const onDrop = (targetId: number) => {
  const sourceId = draggingId.value;
  if (sourceId === null || sourceId === targetId) {
    onDragEnd();
    return;
  }
  const next = [...data.value];
  const fromIndex = next.findIndex(item => item.id === sourceId);
  const toIndex = next.findIndex(item => item.id === targetId);
  if (fromIndex !== -1 && toIndex !== -1) {
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    data.value = next;
  }
  onDragEnd();
};

const onDragEnd = () => {
  activeHandleId.value = null;
  draggingId.value = null;
  dragOverId.value = null;
};
</script>
