<docs>
---
order: 9
title:
  zh-CN: 范围可拖拽
  en-US: Draggable track
---

## zh-CN

可以设置 `range.draggableTrack`，使得范围刻度整体可拖拽。

## en-US

Make range track draggable when set `range.draggableTrack`.
</docs>

<template>
  <a-slider v-model:value="value" :range="{ draggableTrack: true }" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value = ref<number[]>([20, 50]);
</script>
