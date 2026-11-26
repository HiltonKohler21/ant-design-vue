<docs>
---
order: 1.5
title:
  zh-CN: 从数据直接生成
  en-US: Generate from tree data
---

## zh-CN

使用 `treeData` 把 JSON 数据直接生成树结构。

## en-US

The tree structure can be populated using `treeData` property. This is a quick and easy way to provide the tree content.
</docs>

<template>
  <a-tree-select
    v-model:value="value"
    :style="{ width: '100%' }"
    :styles="{ popup: { root: { maxHeight: '400px', overflow: 'auto' } } }"
    :tree-data="treeData"
    placeholder="Please select"
    tree-default-expand-all
    @change="onChange"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { TreeSelectProps } from '@hiltonkohler21/ant-design-vue';

const value = ref<string>();

const treeData: TreeSelectProps['treeData'] = [
  {
    title: 'Node1',
    value: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-1',
      },
      {
        title: 'Child Node2',
        value: '0-0-2',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
  },
];

const onChange = (newValue: string) => {
  console.log(newValue);
};
</script>
