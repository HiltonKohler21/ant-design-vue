<docs>
---
order: 6
title:
  zh-CN: 节点样式变体
  en-US: Variant
---

## zh-CN

通过 `variant` 可以设置时间轴节点为填充（`filled`）或描边（`outlined`）样式，并支持 `items` 配置项用法。

## en-US

Use `variant` to switch between `filled` and `outlined` node styles with config-driven `items`.

</docs>

<template>
  <a-radio-group v-model:value="variant" style="margin-bottom: 20px">
    <a-radio-button value="outlined">Outlined</a-radio-button>
    <a-radio-button value="filled">Filled</a-radio-button>
  </a-radio-group>
  <a-timeline :variant="variant" :items="items" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { TimelineItemType, TimelineVariant } from 'ant-design-vue';

const variant = ref<TimelineVariant>('filled');
const items: TimelineItemType[] = [
  { color: 'green', content: 'Create a services site 2015-09-01' },
  { color: 'blue', content: 'Solve initial network problems 2015-09-01' },
  { color: 'red', content: 'Technical testing 2015-09-01' },
  { color: 'gray', content: 'Network problems being solved 2015-09-01' },
];
</script>
