<docs>
---
order: 7
version: 4.3.0
title:
  zh-CN: 标签放置位置与进度
  en-US: Title Placement and Progress
---

## zh-CN

使用 `titlePlacement` 设置标签位置，通过 `percent` 显示进度。

## en-US

Use `titlePlacement` to set the label position and display the progress through `percent`.
</docs>

<template>
  <div>
    <a-steps :current="1" title-placement="vertical" :items="items" ellipsis />
    <br />
    <a-steps :current="1" :percent="60" title-placement="vertical" :items="items" />
    <br />
    <a-steps :current="1" :percent="80" size="small" title-placement="vertical" :items="items" />
  </div>
</template>

<script lang="ts" setup>
import type { StepsProps } from 'ant-design-vue';

const content = 'This is a content.';
const items: StepsProps['items'] = [
  {
    title: 'Finished',
    content,
  },
  {
    title: 'In Progress',
    content,
  },
  {
    title: 'Waiting',
    content,
  },
];
</script>
