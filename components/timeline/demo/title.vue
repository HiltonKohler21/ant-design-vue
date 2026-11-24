<docs>
---
order: 9
title:
  zh-CN: 标题
  en-US: Title
---

## zh-CN

使用 `title` 标签单独展示时间。

## en-US

Use `title` show time alone.
</docs>

<template>
  <a-radio-group v-model:value="mode" :style="{ marginBottom: '20px' }">
    <a-radio value="start">Start</a-radio>
    <a-radio value="end">End</a-radio>
    <a-radio value="alternate">Alternate</a-radio>
  </a-radio-group>
  <a-timeline :mode="mode" :items="items" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { TimelineProps } from 'ant-design-vue';

const mode = ref<'start' | 'alternate' | 'end'>('start');

const items: TimelineProps['items'] = [
  {
    title: '2015-09-01',
    content: 'Create a services',
  },
  {
    title: '2015-09-01 09:12:11',
    content: 'Solve initial network problems',
  },
  {
    content: 'Technical testing',
  },
  {
    title: '2015-09-01 09:12:11',
    content: 'Network problems being solved',
  },
];
</script>
