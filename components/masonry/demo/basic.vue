<docs>
---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

按最短列自动分配，支持不等高内容。

## en-US

Items are distributed into the currently shortest column.

</docs>
<template>
  <a-masonry :items="items" :columns="4" :gutter="12">
    <template #item="{ item }">
      <div
        :style="{
          height: `${item.height}px`,
          background: item.color,
          borderRadius: '8px',
          padding: '12px',
          color: '#fff',
        }"
      >
        {{ item.label }}
      </div>
    </template>
  </a-masonry>
</template>
<script lang="ts" setup>
const colors = ['#1677ff', '#52c41a', '#faad14', '#eb2f96', '#722ed1', '#13c2c2'];
const heights = [120, 180, 90, 150, 200, 110, 160, 130, 190, 100, 140, 170];

const items = heights.map((height, index) => ({
  key: index,
  height,
  label: `Item ${index + 1}`,
  color: colors[index % colors.length],
}));
</script>
