<docs>
---
order: 9
debug: true
title:
  zh-CN: 目录 Debug
  en-US: Directory Debug
---

## zh-CN

目录树与普通树在禁用、勾选、拖拽等组合下的样式调试。

## en-US

Debug directory tree and normal tree combinations with disabled, checkable, and draggable states.
</docs>

<template>
  <a-flex wrap="wrap" gap="large">
    <a-directory-tree draggable :default-selected-keys="['0-0-0']" />
    <a-directory-tree
      :tree-data="treeData"
      default-expand-all
      checkable
      :default-selected-keys="['0-1-0']"
      @select="onSelect"
      @expand="onExpand"
    />
    <a-directory-tree
      :tree-data="treeData"
      default-expand-all
      draggable
      checkable
      :default-selected-keys="['0-1']"
      @select="onSelect"
      @expand="onExpand"
    />
    <a-directory-tree
      :tree-data="treeData"
      default-expand-all
      multiple
      @select="onSelect"
      @expand="onExpand"
    />
    <a-tree
      :tree-data="treeData"
      default-expand-all
      :default-selected-keys="['0-1']"
      @select="onSelect"
      @expand="onExpand"
    />
    <a-tree
      :tree-data="treeData"
      default-expand-all
      checkable
      :default-selected-keys="['0-1', '0-0-0', '0-0-1', '0-1-1']"
      @select="onSelect"
      @expand="onExpand"
    />
    <a-tree
      :tree-data="treeData"
      default-expand-all
      draggable
      :default-selected-keys="['0-1-0']"
      @select="onSelect"
      @expand="onExpand"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import type { TreeProps } from '@hiltonkohler21/ant-design-vue';

const treeData: TreeProps['treeData'] = [
  {
    title: 'parent 0',
    key: '0-0',
    children: [
      { title: 'leaf 0-0', key: '0-0-0', isLeaf: true, disabled: true },
      { title: 'leaf 0-1', key: '0-0-1', isLeaf: true, disableCheckbox: true },
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
      { title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
    ],
  },
];

const onSelect: TreeProps['onSelect'] = (keys, info) => {
  console.log('Trigger Select', keys, info);
};

const onExpand: TreeProps['onExpand'] = (keys, info) => {
  console.log('Trigger Expand', keys, info);
};
</script>
