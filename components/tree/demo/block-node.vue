<docs>
---
order: 15
title:
  zh-CN: 占据整行
  en-US: Block Node
---

## zh-CN

节点占据一行。

## en-US

Make treeNode fill remaining horizontal space.
</docs>

<template>
  <a-tree
    checkable
    :default-selected-keys="['0-1']"
    default-expand-all
    :tree-data="treeData"
    block-node
  />
</template>

<script lang="ts" setup>
import type { TreeProps } from 'ant-design-vue';

const treeData: TreeProps['treeData'] = [
  {
    title: 'parent',
    key: '0',
    children: [
      {
        title: 'child 1',
        key: '0-0',
        disabled: true,
      },
      {
        title: 'child 2',
        key: '0-1',
        disableCheckbox: true,
      },
    ],
  },
];
</script>
