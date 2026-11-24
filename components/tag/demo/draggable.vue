<docs>
---
order: 8
title:
  zh-CN: 可拖拽标签
  en-US: Draggable Tag
---

## zh-CN

使用原生 HTML5 拖拽事件实现标签的拖拽排序。

## en-US

Reorder tags via native HTML5 drag-and-drop events.

</docs>

<template>
  <a-flex gap="small" align="center" wrap>
    <a-tag
      v-for="(item, index) in items"
      :key="item.id"
      :color="overIndex === index ? 'processing' : undefined"
      draggable="true"
      style="cursor: move; user-select: none"
      @dragstart="handleDragStart(index)"
      @dragover.prevent="handleDragOver(index)"
      @drop.prevent="handleDrop(index)"
      @dragend="handleDragEnd"
    >
      {{ item.text }}
    </a-tag>
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface TagItem {
  id: number;
  text: string;
}

const items = ref<TagItem[]>([
  { id: 1, text: 'Tag 1' },
  { id: 2, text: 'Tag 2' },
  { id: 3, text: 'Tag 3' },
  { id: 4, text: 'Tag 4' },
]);

const draggingIndex = ref<number | null>(null);
const overIndex = ref<number | null>(null);

const handleDragStart = (index: number) => {
  draggingIndex.value = index;
};

const handleDragOver = (index: number) => {
  overIndex.value = index;
};

const handleDrop = (targetIndex: number) => {
  const from = draggingIndex.value;
  if (from === null || from === targetIndex) {
    handleDragEnd();
    return;
  }
  const next = [...items.value];
  const [moved] = next.splice(from, 1);
  next.splice(targetIndex, 0, moved);
  items.value = next;
  handleDragEnd();
};

const handleDragEnd = () => {
  draggingIndex.value = null;
  overIndex.value = null;
};
</script>
