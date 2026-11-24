<docs>
---
order: 2
version: 4.3.0
title:
  zh-CN: 可调整大小
  en-US: Resizable
---

## zh-CN

设置 `resizable` 属性，允许通过拖拽抽屉边缘来动态调整抽屉的宽度或高度。

## en-US

Set `resizable` to enable resizing the Drawer width or height by dragging its edge.
</docs>

<template>
  <a-space style="margin-bottom: 16px">
    <a-radio-group v-model:value="placement" @change="handlePlacementChange">
      <a-radio value="top">top</a-radio>
      <a-radio value="right">right</a-radio>
      <a-radio value="bottom">bottom</a-radio>
      <a-radio value="left">left</a-radio>
    </a-radio-group>
    <a-button type="primary" @click="open = true">Open Drawer</a-button>
  </a-space>
  <div>Current size: {{ size }}px</div>
  <a-drawer
    v-model:open="open"
    title="Resizable Drawer"
    :placement="placement"
    :size="size"
    :resizable="{ onResize: handleResize }"
  >
    <p>Drag the edge to resize the drawer</p>
    <p>Current size: {{ size }}px</p>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { DrawerProps } from 'ant-design-vue';

const open = ref<boolean>(false);
const placement = ref<DrawerProps['placement']>('right');
const size = ref<number>(378);

const handlePlacementChange = () => {
  size.value = 378;
};

const handleResize = (newSize: number) => {
  size.value = newSize;
};
</script>
