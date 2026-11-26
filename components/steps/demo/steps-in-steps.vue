<docs>
---
order: 14
debug: true
title:
  zh-CN: Steps 嵌套 Steps
  en-US: Steps inside Steps
---

## zh-CN

测试 Steps 嵌套 Steps 的样式。

## en-US

Test style of Steps inside Steps.
</docs>

<template>
  <div>
    <a-radio-group v-model:value="size" :style="{ marginBottom: '16px' }">
      <a-radio value="small">Small</a-radio>
      <a-radio value="medium">Medium</a-radio>
    </a-radio-group>
    <a-steps :size="size" orientation="vertical" :items="outerItems" />
  </div>
</template>

<script lang="ts" setup>
import { computed, h, ref } from 'vue';
import { Card, Steps } from '@hiltonkohler21/ant-design-vue';
import type { StepsProps } from '@hiltonkohler21/ant-design-vue';

const size = ref<StepsProps['size']>('medium');
const content = 'This is a content.';

const innerItems: StepsProps['items'] = [
  { title: 'Finished', content },
  { title: 'In Progress', content },
  { title: 'Waiting', content },
];

const outerItems = computed<StepsProps['items']>(() => [
  {
    title: 'Finished',
    content: h(Card, null, {
      default: () => h(Steps, { size: size.value, items: innerItems }),
    }),
  },
  {
    title: 'In Progress',
    content,
  },
  {
    title: 'Waiting',
    content,
  },
]);
</script>
