<docs>
---
order: 6
debug: true
title:
  zh-CN: 测试栅格列表
  en-US: Test Grid
---

## zh-CN

List `grid` 在各种情况下的样式表现，如 Fragment 和封装了 List.Item。

## en-US

Test List `grid` for some edge cases.
</docs>

<template>
  <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-card :title="item.title">Card content</a-card>
      </a-list-item>
    </template>
  </a-list>
  <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data">
    <template #renderItem>
      <WrappedListItem />
    </template>
  </a-list>
  <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data">
    <template #renderItem>
      <WrappedListItem />
      <div />
    </template>
  </a-list>
</template>

<script lang="ts" setup>
import { defineComponent, h } from 'vue';
import { Card, List } from 'ant-design-vue';

const data = [
  { title: 'Title 1' },
  { title: 'Title 2' },
  { title: 'Title 3' },
  { title: 'Title 4' },
  { title: 'Title 5' },
  { title: 'Title 6' },
];

const WrappedListItem = defineComponent({
  name: 'WrappedListItem',
  setup() {
    return () =>
      h(List.Item, null, {
        default: () => h(Card, { title: 'title' }, { default: () => 'Card content' }),
      });
  },
});
</script>
