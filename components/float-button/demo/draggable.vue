<docs>
---
order: 9
title:
  zh-CN: 可拖拽
  en-US: Draggable
---

## zh-CN

结合指针事件或拖拽库实现可拖拽悬浮按钮。

## en-US

Implement drag-and-drop functionality with pointer events or third-party libraries.
</docs>

<template>
  <div
    ref="containerRef"
    :style="{
      position: 'relative',
      height: '240px',
      overflow: 'hidden',
      padding: '16px',
      border: '1px solid var(--ant-color-border-secondary, rgba(0, 0, 0, 0.06))',
      borderRadius: '8px',
      userSelect: isDragging ? 'none' : undefined,
    }"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointercancel="handlePointerUp"
  >
    <span :style="{ color: 'var(--ant-color-text-tertiary, #999)' }">
      按住并拖动右下角悬浮按钮 / Drag the float button inside the container
    </span>
    <a-float-button
      :style="{
        position: 'absolute',
        insetInlineEnd: '24px',
        bottom: '24px',
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : undefined,
        touchAction: 'none',
      }"
      @pointerdown="handlePointerDown"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

const containerRef = ref<HTMLElement | null>(null);
const position = reactive({ x: 0, y: 0 });
const isDragging = ref(false);

let startPointerX = 0;
let startPointerY = 0;
let startPosX = 0;
let startPosY = 0;

const handlePointerDown = (e: PointerEvent) => {
  isDragging.value = true;
  startPointerX = e.clientX;
  startPointerY = e.clientY;
  startPosX = position.x;
  startPosY = position.y;
  (e.currentTarget as HTMLElement | null)?.setPointerCapture?.(e.pointerId);
};

const handlePointerMove = (e: PointerEvent) => {
  if (!isDragging.value) {
    return;
  }
  const nextX = startPosX + (e.clientX - startPointerX);
  const nextY = startPosY + (e.clientY - startPointerY);
  const container = containerRef.value;
  if (container) {
    const minX = -(container.clientWidth - 72);
    const maxX = 16;
    const minY = -(container.clientHeight - 72);
    const maxY = 16;
    position.x = Math.min(Math.max(nextX, minX), maxX);
    position.y = Math.min(Math.max(nextY, minY), maxY);
  } else {
    position.x = nextX;
    position.y = nextY;
  }
};

const handlePointerUp = () => {
  isDragging.value = false;
};
</script>
