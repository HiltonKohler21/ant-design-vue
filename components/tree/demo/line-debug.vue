<docs>
---
order: 21
debug: true
title:
  zh-CN: 连接线调试
  en-US: Line debug
---

## zh-CN

自定义 `titleHeight` 与 `switcherSize` 下的连接线样式调试。

## en-US

Debug connecting lines with custom `titleHeight` and `switcherSize` component tokens.
</docs>

<template>
  <a-config-provider :theme="lineTheme">
    <a-space direction="vertical" :style="{ width: '100%' }">
      <a-tree show-line default-expand-all :tree-data="treeData">
        <template #icon><carry-out-outlined /></template>
      </a-tree>
      <a-tree show-line default-expand-all :tree-data="treeData" draggable>
        <template #icon><carry-out-outlined /></template>
      </a-tree>
      <a-tree show-line default-expand-all :tree-data="treeData" checkable>
        <template #icon><carry-out-outlined /></template>
      </a-tree>
    </a-space>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { CarryOutOutlined } from '@ant-design/icons-vue';
import type { ConfigProviderProps, TreeProps } from 'ant-design-vue';

const lineTheme: ConfigProviderProps['theme'] = {
  components: {
    Tree: {
      titleHeight: 32,
      switcherSize: 24,
    } as Record<string, any>,
  },
};

const treeData: TreeProps['treeData'] = [
  {
    key: 'parent 1',
    title: 'parent 1',
    children: [
      {
        key: 'parent 1-0',
        title: 'parent 1-0',
        children: [
          {
            key: 'leaf1',
            title: 'leaf1',
          },
          {
            key: 'leaf2',
            title: 'leaf2',
          },
        ],
      },
      {
        key: 'parent 1-1',
        title: 'parent 1-1',
        children: [
          {
            key: 'sss',
            title: 'sss',
          },
        ],
      },
    ],
  },
];
</script>
