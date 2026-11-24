<docs>
---
order: 10
title:
  zh-CN: 拖拽排序（拖拽手柄）
  en-US: Drag sorting with handler
---

## zh-CN

通过拖拽手柄实现列表项的拖拽排序。

## en-US

Implement drag sorting with a dedicated drag handle using native HTML5 drag-and-drop events.
</docs>

<template>
  <a-list :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item
        :key="item.key"
        :draggable="activeHandleKey === item.key"
        :style="{
          opacity: draggingKey === item.key ? 0.5 : 1,
          backgroundColor:
            dragOverKey === item.key && draggingKey !== item.key
              ? 'rgba(22, 119, 255, 0.08)'
              : undefined,
          transition: 'background-color 0.2s ease',
        }"
        @dragstart="onDragStart($event, item.key)"
        @dragover.prevent="onDragOver(item.key)"
        @drop.prevent="onDrop(item.key)"
        @dragend="onDragEnd"
      >
        <div :style="{ display: 'flex', alignItems: 'center', gap: '8px' }">
          <a-button
            type="text"
            size="small"
            :style="{ cursor: 'move' }"
            @mousedown="activeHandleKey = item.key"
            @mouseup="activeHandleKey = null"
          >
            <template #icon>
              <HolderOutlined />
            </template>
          </a-button>
          <span>{{ item.key }} {{ item.content }}</span>
        </div>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { HolderOutlined } from '@ant-design/icons-vue';

interface Item {
  key: number;
  content: string;
}

const data = ref<Item[]>([
  { key: 1, content: 'Racing car sprays burning fuel into crowd.' },
  { key: 2, content: 'Japanese princess to wed commoner.' },
  { key: 3, content: 'Australian walks 100km after outback crash.' },
  { key: 4, content: 'Man charged over missing wedding girl.' },
  { key: 5, content: 'Los Angeles battles huge wildfires.' },
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
