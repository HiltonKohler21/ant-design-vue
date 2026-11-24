<docs>
---
order: 7
title:
  zh-CN: 无限加载
  en-US: Infinite loading
---

## zh-CN

在 `@scroll` 事件中判断列表即将滚动到底部时按需追加下一页数据，实现无限滚动。配合 `virtual`，数据不断累积也仅渲染视口内的行。

## en-US

Detect in `@scroll` when the list is near the bottom to append the next page on demand. Combined with `virtual`, only visible rows are rendered as data grows.
</docs>

<template>
  <a-flex vertical gap="small">
    <a-listy virtual :items="items" row-key="id" :height="360" @scroll="handleScroll">
      <template #item="{ item }">
        <span>{{ item.content }}</span>
      </template>
    </a-listy>
    <a-flex justify="center" align="center" style="height: 28px">
      <a-spin v-if="loading" size="small" />
      <a-typography-text v-else type="secondary">{{ items.length }} items loaded</a-typography-text>
    </a-flex>
  </a-flex>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref } from 'vue';

interface Item {
  id: number;
  content: string;
}

const PAGE_SIZE = 50;

const makePage = (offset: number): Item[] =>
  Array.from({ length: PAGE_SIZE }, (_, index) => ({
    id: offset + index,
    content: `Item ${offset + index + 1}`,
  }));

const items = ref<Item[]>(makePage(0));
const loading = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

const handleScroll = (event: UIEvent) => {
  const target = event.currentTarget as HTMLElement | null;
  if (!target || loading.value) {
    return;
  }
  const { scrollTop, clientHeight, scrollHeight } = target;
  if (scrollHeight - scrollTop - clientHeight > 160) {
    return;
  }
  loading.value = true;
  timer = setTimeout(() => {
    items.value = [...items.value, ...makePage(items.value.length)];
    loading.value = false;
  }, 600);
};

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer);
  }
});
</script>
