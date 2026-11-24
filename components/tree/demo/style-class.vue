<docs>
---
order: 20
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Tree 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Tree by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-tree
      :tree-data="treeData"
      :class-names="treeClassNames"
      :styles="stylesObject"
      auto-expand-parent
      checkable
    />
    <a-tree
      :tree-data="treeData"
      :class-names="treeClassNames"
      :styles="stylesFn"
      :checkable="false"
      auto-expand-parent
      :default-expanded-keys="['0-0-0', '0-0-1']"
      :default-selected-keys="['0-0-1']"
      :default-checked-keys="['0-0-0', '0-0-1']"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import type { TreeProps } from 'ant-design-vue';

const treeClassNames: TreeProps['classNames'] = {
  root: 'demo-tree-semantic-root',
  item: 'demo-tree-semantic-item',
  itemTitle: 'demo-tree-semantic-title',
};

const stylesObject: TreeProps['styles'] = {
  root: { border: '2px solid #d9d9d9' },
  item: { margin: '2px 0' },
};

const stylesFn: TreeProps['styles'] = info => {
  if (!info.props.checkable) {
    return {
      root: {
        border: '2px solid #E5D9F2',
        borderRadius: '4px',
      },
    };
  }
  return {};
};

const treeData: TreeProps['treeData'] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [
          {
            title: 'leaf',
            key: '0-0-1-0',
          },
        ],
      },
    ],
  },
];
</script>

<style>
.demo-tree-semantic-root {
  padding: 8px;
  border-radius: 4px;
}
.demo-tree-semantic-item {
  border-radius: 2px;
}
.demo-tree-semantic-title {
  font-size: 14px;
}
</style>
