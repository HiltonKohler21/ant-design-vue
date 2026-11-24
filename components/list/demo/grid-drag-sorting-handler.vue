<docs>
---
order: 12
title:
  zh-CN: 栅格拖拽排序（拖拽手柄）
  en-US: Grid Drag sorting with handler
---

## zh-CN

通过拖拽手柄实现网格布局列表的拖拽排序。

## en-US

Implement drag sorting for grid list items with a drag handle using native HTML5 drag-and-drop events.
</docs>

<template>
  <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item
        :key="item.key"
        :draggable="activeHandleKey === item.key"
        :style="{
          opacity: draggingKey === item.key ? 0.5 : 1,
          transition: 'opacity 0.2s ease',
        }"
        @dragstart="onDragStart($event, item.key)"
        @dragover.prevent="onDragOver(item.key)"
        @drop.prevent="onDrop(item.key)"
        @dragend="onDragEnd"
      >
        <a-card
          :style="{
            borderColor:
              dragOverKey === item.key && draggingKey !== item.key ? '#1677ff' : undefined,
          }"
        >
          <template #title>
            <a-button
              type="text"
              size="small"
              :style="{ cursor: 'move', marginInlineEnd: '4px' }"
              @mousedown="activeHandleKey = item.key"
              @mouseup="activeHandleKey = null"
            >
              <template #icon>
                <HolderOutlined />
              </template>
            </a-button>
            <span>{{ item.title }}</span>
          </template>
          Card content
        </a-card>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { HolderOutlined } from '@ant-design/icons-vue';

interface GridItem {
  key: number;
  title: string;
}

const data = ref<GridItem[]>([
  { key: 1, title: 'Title 1' },
  { key: 2, title: 'Title 2' },
  { key: 3, title: 'Title 3' },
  { key: 4, title: 'Title 4' },
  { key: 5, title: 'Title 5' },
  { key: 6, title: 'Title 6' },
]);

const activeHandleKey = ref<number | null>(null);
const draggingKey = ref<number | null>(null);
const dragOverKey = ref<number | null>(null);

const onDragStart = (e: DragEvent, key: number) => {
  if (activeHandleKey.value !== key) {
    e.preventDefault();
    return;
  }
  draggingKey.value = key;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(key));
  }
};

const onDragOver = (key: number) => {
  if (draggingKey.value !== null && draggingKey.value !== key) {
    dragOverKey.value = key;
  }
};

const onDrop = (targetKey: number) => {
  const sourceKey = draggingKey.value;
  if (sourceKey === null || sourceKey === targetKey) {
    onDragEnd();
    return;
  }
  const next = [...data.value];
  const fromIndex = next.findIndex(item => item.key === sourceKey);
  const toIndex = next.findIndex(item => item.key === targetKey);
  if (fromIndex !== -1 && toIndex !== -1) {
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    data.value = next;
  }
  onDragEnd();
};

const onDragEnd = () => {
  activeHandleKey.value = null;
  draggingKey.value = null;
  dragOverKey.value = null;
};
</script>
