<docs>
---
order: 1
title:
  zh-CN: 受控操作示例
  en-US: Controlled Tree
---

## zh-CN

受控操作示例。

## en-US

Controlled mode lets parent nodes reflect the status of child nodes more intelligently.
</docs>

<template>
  <a-tree
    v-model:expanded-keys="expandedKeys"
    v-model:checked-keys="checkedKeys"
    v-model:selected-keys="selectedKeys"
    checkable
    :auto-expand-parent="autoExpandParent"
    :tree-data="treeData"
    @expand="onExpand"
    @check="onCheck"
    @select="onSelect"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { TreeProps } from 'ant-design-vue';

const treeData: TreeProps['treeData'] = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
];

const expandedKeys = ref<(string | number)[]>(['0-0-0', '0-0-1']);
const checkedKeys = ref<(string | number)[]>(['0-0-0']);
const selectedKeys = ref<(string | number)[]>([]);
const autoExpandParent = ref(true);

const onExpand: TreeProps['onExpand'] = expandedKeysValue => {
  console.log('onExpand', expandedKeysValue);
  expandedKeys.value = expandedKeysValue;
  autoExpandParent.value = false;
};

const onCheck: TreeProps['onCheck'] = checkedKeysValue => {
  console.log('onCheck', checkedKeysValue);
};

const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
  console.log('onSelect', selectedKeysValue, info);
};
</script>
