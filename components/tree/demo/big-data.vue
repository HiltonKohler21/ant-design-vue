<docs>
---
order: 14
debug: true
title:
  zh-CN: 大数据
  en-US: Big data
---

## zh-CN

大数据虚拟滚动调试（10,000+ 节点）。

## en-US

Big data virtual scroll debug with 10,000+ nodes.
</docs>

<template>
  <a-tree default-expand-all :height="400" :tree-data="treeData" />
</template>

<script lang="ts" setup>
import type { TreeProps } from '@hiltonkohler21/ant-design-vue';

const treeData: NonNullable<TreeProps['treeData']> = [];

for (let i = 0; i < 100; i += 1) {
  const children: NonNullable<TreeProps['treeData']> = [];
  for (let j = 0; j < 100; j += 1) {
    children.push({
      title: `child ${i}-${j}`,
      key: `l-${i}-${j}`,
    });
  }
  treeData.push({
    title: `parent ${i}`,
    key: `l-${i}`,
    children,
  });
}
</script>
