<docs>
---
order: 1
title:
  zh-CN: 垂直方向
  en-US: Vertical Direction
---

## zh-CN

使用 `vertical` 使分段控制器垂直排列。

## en-US

Make Segmented vertical via the `vertical` prop.

</docs>

<template>
  <a-segmented v-model:value="value" vertical :options="options">
    <template #label="{ payload }">
      <component :is="payload.icon" />
    </template>
  </a-segmented>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons-vue';

const value = ref('List');
const options = [
  { value: 'List', payload: { icon: BarsOutlined } },
  { value: 'Kanban', payload: { icon: AppstoreOutlined } },
];
</script>
