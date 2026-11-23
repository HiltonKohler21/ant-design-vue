<docs>
---
order: 8
title:
  zh-CN: 胶囊形状
  en-US: Round Shape
---

## zh-CN

使用 `shape="round"` 展示胶囊形状的分段控制器。

## en-US

Render a pill-shaped Segmented control using `shape="round"`.

</docs>

<template>
  <a-flex gap="small" align="flex-start" vertical>
    <a-segmented v-model:value="size" :options="['small', 'middle', 'large']" />
    <a-segmented
      v-model:value="mode"
      :size="size === 'middle' ? undefined : size"
      shape="round"
      :options="options"
    >
      <template #label="{ payload }">
        <component :is="payload.icon" />
      </template>
    </a-segmented>
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { BulbOutlined, StarOutlined } from '@ant-design/icons-vue';

const size = ref<'small' | 'middle' | 'large'>('middle');
const mode = ref('light');

const options = [
  { value: 'light', payload: { icon: BulbOutlined } },
  { value: 'dark', payload: { icon: StarOutlined } },
];
</script>
