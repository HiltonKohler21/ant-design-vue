<docs>
---
order: 5
debug: true
version: 4.3.0
title:
  zh-CN: 持续更新
  en-US: Fresh
---

## zh-CN

通过 `fresh` 持续监听尺寸变化，会有性能损耗。

## en-US

Listening to size changes continuously with `fresh` will have performance costs.

</docs>

<template>
  <a-masonry fresh :columns="4" :gutter="16" :items="items">
    <template #item="{ item, index }">
      <a-card
        size="small"
        :style="{
          height: `${cardHeights[item.key]}px`,
          transition: 'height 0.3s',
          cursor: 'pointer',
        }"
        @click="randomizeHeight(String(item.key))"
      >
        {{ index + 1 }} - Click
      </a-card>
    </template>
  </a-masonry>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const initialHeights = [150, 50, 90, 70, 110, 150, 130, 80, 50, 90, 100, 150, 60, 50, 80];

const items = initialHeights.map((height, index) => {
  const item: { key: string; data: number; column?: number } = {
    key: `item-${index}`,
    data: height,
  };
  if (index === 4) {
    item.column = 0;
  }
  return item;
});

const cardHeights = reactive<Record<string, number>>(
  Object.fromEntries(items.map(item => [item.key, item.data])),
);

const randomizeHeight = (key: string) => {
  cardHeights[key] = Math.floor(Math.random() * 100) + 50;
};
</script>
