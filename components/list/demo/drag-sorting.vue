<docs>
---
order: 9
title:
  zh-CN: 拖拽排序
  en-US: Drag sorting
---

## zh-CN

使用原生拖拽事件实现列表项的拖拽排序。

## en-US

Implement drag sorting for list items using native HTML5 drag-and-drop events.
</docs>

<template>
  <a-list :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item
        :key="item.key"
        draggable="true"
        :style="{
          cursor: 'move',
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
        <div>{{ item.key }} {{ item.content }}</div>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

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

const draggingKey = ref<number | null>(null);
const dragOverKey = ref<number | null>(null);

const onDragStart = (e: DragEvent, key: number) => {
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
  draggingKey.value = null;
  dragOverKey.value = null;
};
</script>
