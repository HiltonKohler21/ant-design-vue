<docs>
---
order: 1
version: 4.3.0
debug: true
title:
  zh-CN: 关闭行悬浮效果
  en-US: Disable row hover
---

## zh-CN

通过 `rowHoverable={false}` 关闭列表行的悬浮高亮效果。

## en-US

Disable the row hover highlight effect by setting `rowHoverable` to `false`.
</docs>

<template>
  <div
    :style="{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: '16px',
    }"
  >
    <section>
      <a-typography-title :level="5">Default</a-typography-title>
      <a-listy :items="items" row-key="id" :item-render="renderItem" />
    </section>
    <section>
      <a-typography-title :level="5">rowHoverable=false</a-typography-title>
      <a-listy :items="items" :row-hoverable="false" row-key="id" :item-render="renderItem" />
    </section>
  </div>
</template>

<script lang="ts" setup>
interface Item {
  id: number;
  content: string;
}

const items: Item[] = Array.from({ length: 4 }, (_, index) => ({
  id: index,
  content: `Item ${index}`,
}));

const renderItem = (item: Item) => item.content;
</script>
