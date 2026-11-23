<docs>
---
order: 1
title:
  zh-CN: 虚拟滚动
  en-US: Virtual scrolling
---

## zh-CN

一万条数据的长列表。通过设置 `virtual` 和 `height` 开启虚拟滚动，仅渲染视口内的行，并支持通过 `scrollTo` 按像素偏移或行键精确跳转。

## en-US

A long list of 10,000 rows. Enable `virtual` with `height` to render only visible rows, and jump imperatively by pixel offset or item key via `scrollTo`.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-space wrap>
      <a-button @click="scrollToTop">Scroll to Top (0)</a-button>
      <a-button @click="scrollToOffset">Scroll to 500px</a-button>
      <a-button type="primary" @click="scrollToKey(5000)">Scroll to Key 5000</a-button>
      <a-button @click="scrollToKey(9999, 'bottom')">Scroll to Last (9999)</a-button>
    </a-space>
    <a-listy ref="listRef" virtual :items="items" :height="360" row-key="id">
      <template #item="{ item }">
        <a-flex justify="space-between" align="center">
          <span>{{ item.content }}</span>
          <a-typography-text type="secondary">#{{ item.id }}</a-typography-text>
        </a-flex>
      </template>
    </a-listy>
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ListyRef, ScrollAlign } from 'ant-design-vue';

interface Item {
  id: number;
  content: string;
}

const listRef = ref<ListyRef>();

const items: Item[] = Array.from({ length: 10000 }, (_, index) => ({
  id: index,
  content: `Item ${index}`,
}));

const scrollToTop = () => {
  listRef.value?.scrollTo(0);
};

const scrollToOffset = () => {
  listRef.value?.scrollTo(500);
};

const scrollToKey = (key: number, align: ScrollAlign = 'top') => {
  listRef.value?.scrollTo({ key, align });
};
</script>
