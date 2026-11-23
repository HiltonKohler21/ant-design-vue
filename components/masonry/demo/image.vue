<docs>
---
order: 2
title:
  zh-CN: 图片
  en-US: Image
---

## zh-CN

容器自动捕获图片 `load` / `error` 事件并重新计算高度，实现懒加载图片的平滑重排。

## en-US

Masonry automatically listens to image `load` / `error` events in capture phase and rebalances columns smoothly as images load.

</docs>
<template>
  <a-masonry :columns="4" :gutter="16" :items="items">
    <template #item="{ item }">
      <img
        :src="`${item.data}?w=523&auto=format`"
        alt="sample"
        loading="lazy"
        style="width: 100%; display: block; border-radius: 8px"
      />
    </template>
  </a-masonry>
</template>
<script lang="ts" setup>
const imageList = [
  'https://images.unsplash.com/photo-1510001618818-4b4e3d86bf0f',
  'https://images.unsplash.com/photo-1507513319174-e556268bb244',
  'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2',
  'https://images.unsplash.com/photo-1492778297155-7be4c83960c7',
  'https://images.unsplash.com/photo-1508062878650-88b52897f298',
  'https://images.unsplash.com/photo-1506158278516-d720e72406fc',
  'https://images.unsplash.com/photo-1552203274-e3c7bd771d26',
  'https://images.unsplash.com/photo-1528163186890-de9b86b54b51',
];

const items = imageList.map((img, index) => ({
  key: `item-${index}`,
  data: img,
}));
</script>
