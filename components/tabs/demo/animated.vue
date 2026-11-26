<docs>
---
order: 18
debug: true
title:
  zh-CN: 动画
  en-US: Animated
---

## zh-CN

动画切换。

## en-US

Animated of Tab Pane.
</docs>

<template>
  <a-space wrap :style="{ marginBottom: '12px' }">
    <a-switch v-model:checked="inkBar" checked-children="inkBar" un-checked-children="inkBar" />
    <a-switch v-model:checked="tabPane" checked-children="tabPane" un-checked-children="tabPane" />
  </a-space>
  <a-tabs :animated="{ inkBar, tabPane }" :items="items" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { TabsProps } from '@hiltonkohler21/ant-design-vue';

const inkBar = ref(true);
const tabPane = ref(true);

const items: TabsProps['items'] = [
  {
    label: 'Bamboo',
    key: '1',
    children: 'Hello Bamboo!',
    style: {
      height: '200px',
      boxShadow: '0 0 3px rgba(255, 0, 0, 0.5)',
    },
  },
  {
    label: 'Little',
    key: '2',
    children: 'Hi Little!',
    style: {
      height: '300px',
      boxShadow: '0 0 3px rgba(0, 255, 0, 0.5)',
    },
  },
  {
    label: 'Light',
    key: '3',
    children: 'Welcome Light!',
    style: {
      height: '100px',
      boxShadow: '0 0 3px rgba(0, 0, 255, 0.5)',
    },
  },
];
</script>
