<docs>
---
order: 4
version: 4.3.0
title:
  zh-CN: 面板式步骤
  en-US: Panel Steps
---

## zh-CN

面板类型的步骤条。

## en-US

Panel style steps.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-steps type="panel" :current="current" :items="items" @change="onChange" />
    <a-steps
      type="panel"
      size="small"
      variant="outlined"
      :current="current"
      :items="items"
      @change="onChange"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { StepsProps } from 'ant-design-vue';

const current = ref(0);

const onChange = (value: number) => {
  current.value = value;
};

const items: StepsProps['items'] = [
  {
    title: 'Step 1',
    subTitle: '00:00',
    content: 'This is a content.',
  },
  {
    title: 'Step 2',
    content: 'This is a content.',
    status: 'error',
  },
  {
    title: 'Step 3',
    content: 'This is a content.',
  },
];
</script>
