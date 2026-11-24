<docs>
---
order: 6.5
version: 4.3.0
title:
  zh-CN: 最大选中数量
  en-US: Max Count
---

## zh-CN

你可以通过设置 `maxCount` 约束最多可选中的数量，当超出限制时会变成禁止选中状态。

## en-US

You can set the `maxCount` prop to control the max number of items can be selected. When the limit is exceeded, the options will become disabled.
</docs>

<template>
  <a-tree-select
    v-model:value="value"
    :tree-data="treeData"
    multiple
    :max-count="MAX_COUNT"
    :style="{ width: '100%' }"
    tree-checkable
    placeholder="Please select"
    :show-checked-strategy="TreeSelect.SHOW_CHILD"
  >
    <template #suffix>
      <span>{{ value.length }} / {{ MAX_COUNT }}</span>
      <DownOutlined />
    </template>
  </a-tree-select>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';
import { TreeSelect } from 'ant-design-vue';
import type { TreeSelectProps } from 'ant-design-vue';

const MAX_COUNT = 3;
const value = ref<string[]>(['child1-1']);

const treeData: TreeSelectProps['treeData'] = [
  {
    title: 'Parent 1',
    value: 'parent1',
    children: [
      {
        title: 'Child 1-1',
        value: 'child1-1',
      },
      {
        title: 'Child 1-2',
        value: 'child1-2',
      },
    ],
  },
  {
    title: 'Parent 2',
    value: 'parent2',
    children: [
      {
        title: 'Child 2-1',
        value: 'child2-1',
      },
      {
        title: 'Child 2-2',
        value: 'child2-2',
      },
    ],
  },
];
</script>
