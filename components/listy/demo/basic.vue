<docs>
---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

普通列表与虚拟滚动列表。

## en-US

A plain list and a virtual scrolling list.

</docs>
<template>
  <a-space direction="vertical" style="width: 100%" :size="24">
    <a-listy :data="data" :item-key="'key'" :item-render="renderItem" />
    <a-listy
      :data="largeData"
      :item-key="'key'"
      :item-render="renderItem"
      :height="220"
      :item-height="42"
    />
  </a-space>
</template>
<script lang="ts" setup>
import { h } from 'vue';

const data = Array.from({ length: 5 }, (_, i) => ({ key: i, label: `Item ${i + 1}` }));
const largeData = Array.from({ length: 500 }, (_, i) => ({
  key: i,
  label: `Row ${i + 1}`,
}));
const renderItem = (item: any) => h('span', item.label);
</script>
