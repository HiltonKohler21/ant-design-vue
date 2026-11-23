<docs>
---
order: 1
title:
  zh-CN: 响应式
  en-US: Responsive
---

## zh-CN

`columns` 和 `gutter` 均支持响应式断点配置，根据视口宽度自动调整列数与间距。

## en-US

Both `columns` and `gutter` support responsive breakpoint objects to adapt columns and spacing across viewports.

</docs>

<template>
  <a-masonry
    :columns="{ xs: 1, sm: 2, md: 3, lg: 4 }"
    :gutter="{ xs: 8, sm: 12, md: 16 }"
    :items="items"
  >
    <template #item="{ item, index }">
      <a-card size="small" :style="{ height: `${item.height}px` }">Item {{ index + 1 }}</a-card>
    </template>
  </a-masonry>
</template>

<script lang="ts" setup>
const heights = [120, 65, 95, 160, 100, 140, 80, 115, 70, 130, 90, 145];

const items = heights.map((height, index) => ({
  key: `item-${index}`,
  height,
}));
</script>
