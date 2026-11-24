<docs>
---
order: 11
title:
  zh-CN: 语义化自定义
  en-US: Semantic Sample
---

## zh-CN

通过语义化结构，可以实现更丰富的定制样式。

## en-US

Achieve richer custom styles by using semantic structure.
</docs>

<template>
  <a-timeline :items="items" />
</template>

<script lang="ts" setup>
import type { TimelineProps } from 'ant-design-vue';

const items: TimelineProps['items'] = [
  {
    content: 'Create a services site 2015-09-01',
  },
  {
    content: 'Solve initial network problems 2015-09-01',
    styles: {
      root: {
        height: '100px',
      },
      rail: {
        borderStyle: 'dashed',
      },
    },
  },
  {
    content: '...for a long time...',
    styles: {
      root: {
        height: '100px',
      },
      rail: {
        borderStyle: 'dashed',
      },
      content: {
        opacity: 0.45,
      },
    },
  },
  {
    content: 'Technical testing 2015-09-01',
  },
  {
    content: 'Network problems being solved 2015-09-01',
  },
];
</script>
