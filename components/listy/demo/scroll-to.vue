<docs>
---
order: 9
debug: true
title:
  zh-CN: 滚动控制
  en-US: Scroll control
---

## zh-CN

通过 ref 的 `scrollTo` 滚动到指定像素位置、数据项或分组，`align` 与 `offset` 控制对齐方式。`onScroll` 可以监听原生滚动事件。

## en-US

Use `scrollTo` on the ref to jump to a pixel position, an item or a group, with `align` and `offset` controlling the alignment. `onScroll` listens to the native scroll event.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-flex gap="small" wrap align="center">
      <a-segmented v-model:value="align" :options="alignOptions" />
      <a-space-compact>
        <a-input-number v-model:value="targetKey" :min="0" :max="59" :style="{ width: '70px' }" />
        <a-button @click="scrollToItem">Scroll to item</a-button>
      </a-space-compact>
      <a-space-compact>
        <a-select v-model:value="groupKey" :options="groupOptions" :style="{ width: '110px' }" />
        <a-button @click="scrollToGroup">Scroll to group</a-button>
      </a-space-compact>
      <a-button @click="scrollToTop">Back to top</a-button>
    </a-flex>
    <a-listy
      ref="listRef"
      :items="items"
      row-key="id"
      :height="400"
      sticky
      :group="groupConfig"
      :item-render="renderItem"
      @scroll="handleScroll"
    />
    <a-typography-text type="secondary">scrollTop: {{ scrollTop }}px</a-typography-text>
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ListyRef, ScrollAlign } from 'ant-design-vue';

interface Item {
  id: number;
  group: string;
}

const items: Item[] = Array.from({ length: 60 }, (_, index) => ({
  id: index,
  group: `Group ${Math.floor(index / 10)}`,
}));

const groups = Array.from({ length: 6 }, (_, index) => `Group ${index}`);
const groupOptions = groups.map(group => ({ value: group, label: group }));
const alignOptions: ScrollAlign[] = ['top', 'bottom', 'auto'];

const listRef = ref<ListyRef>();
const align = ref<ScrollAlign>('top');
const targetKey = ref<number | null>(40);
const groupKey = ref('Group 3');
const scrollTop = ref(0);

const groupConfig = {
  key: (item: Item) => item.group,
  title: (group: string) => group,
};

const renderItem = (item: Item) => `Item ${item.id}`;

const scrollToItem = () => {
  listRef.value?.scrollTo({ key: targetKey.value ?? 0, align: align.value });
};

const scrollToGroup = () => {
  listRef.value?.scrollTo({ groupKey: groupKey.value, align: align.value });
};

const scrollToTop = () => {
  listRef.value?.scrollTo(0);
};

const handleScroll = (event: UIEvent) => {
  const target = event.currentTarget as HTMLElement | null;
  if (target) {
    scrollTop.value = Math.round(target.scrollTop);
  }
};
</script>
