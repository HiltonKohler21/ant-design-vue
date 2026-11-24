<docs>
---
order: 12
version: 4.3.0
title:
  zh-CN: 滚动到嵌套节点
  en-US: Scroll to nested node
---

## zh-CN

受控模式可使用 `Tree.useTree` 获取节点路径并更新 `expandedKeys`，然后滚动到目标节点。

## en-US

In controlled mode, use `Tree.useTree` to get the node path and update `expandedKeys` before scrolling to the target node.
</docs>

<template>
  <a-flex vertical gap="small">
    <a-button @click="scrollToTarget">scrollTo: {{ TARGET_KEY }}</a-button>
    <a-tree
      ref="treeRef"
      v-model:expanded-keys="expandedKeys"
      :height="200"
      :tree-data="treeData"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Tree } from 'ant-design-vue';
import type { DataNode } from 'ant-design-vue/es/tree';

const TARGET_KEY = '0-1-1-1-1';

const createTree = (key = '0', level = 1): DataNode => ({
  key,
  title: key,
  children: level < 5 ? [0, 1].map(index => createTree(`${key}-${index}`, level + 1)) : undefined,
});

const treeData: DataNode[] = [createTree()];

const treeRef = ref<InstanceType<typeof Tree> | null>(null);
const expandedKeys = ref<(string | number)[]>([]);
const { getPath } = Tree.useTree(treeData, {});

const scrollToTarget = () => {
  expandedKeys.value = getPath(TARGET_KEY).map(({ key }) => key);
  treeRef.value?.scrollTo({ key: TARGET_KEY, align: 'top' });
};
</script>
