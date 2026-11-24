<docs>
---
order: 19
debug: true
title:
  zh-CN: 多行
  en-US: Multiple lines
---

## zh-CN

较长标题在窄容器内换行展示调试。

## en-US

Debug long tree node titles wrapping across multiple lines in a narrow container.
</docs>

<template>
  <a-tree
    checkable
    :default-expanded-keys="['0-0-0', '0-0-1']"
    :default-selected-keys="['0-0-1']"
    :default-checked-keys="['0-0-0', '0-0-1']"
    :tree-data="treeData"
    :style="{ width: '200px', maxWidth: '100%' }"
    @select="onSelect"
    @check="onCheck"
  >
    <template #title="{ title, key }">
      <span v-if="key === '0-0-1-0'" :style="{ color: '#1677ff' }">{{ title }}</span>
      <template v-else>{{ title }}</template>
    </template>
  </a-tree>
</template>

<script lang="ts" setup>
import type { TreeProps } from 'ant-design-vue';

const treeData: TreeProps['treeData'] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: 'This is a very very very very long text',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'This is also a very very very very very long text',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'This is a very very very very long title',
        key: '0-0-1',
        children: [{ title: 'sss', key: '0-0-1-0' }],
      },
    ],
  },
];

const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
  console.log('selected', selectedKeys, info);
};

const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
  console.log('onCheck', checkedKeys, info);
};
</script>
