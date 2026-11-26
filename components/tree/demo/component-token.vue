<docs>
---
order: 12
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

组件 Token

## en-US

Component Token
</docs>

<template>
  <a-config-provider :theme="treeTheme">
    <a-tree
      v-model:expanded-keys="expandedKeys"
      v-model:selected-keys="selectedKeys"
      v-model:checked-keys="checkedKeys"
      checkable
      :tree-data="treeData"
      @select="onSelect"
      @check="onCheck"
    >
      <template #title="{ title, key }">
        <span v-if="key === '0-0-1-0'" style="color: #1677ff">{{ title }}</span>
        <template v-else>{{ title }}</template>
      </template>
    </a-tree>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ConfigProviderProps, TreeProps } from '@hiltonkohler21/ant-design-vue';

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
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true,
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
        children: [{ title: 'sss', key: '0-0-1-0' }],
      },
    ],
  },
];

const expandedKeys = ref<string[]>(['0-0-0', '0-0-1']);
const selectedKeys = ref<string[]>(['0-0-1']);
const checkedKeys = ref<string[]>(['0-0-0', '0-0-1']);

const onSelect: TreeProps['onSelect'] = (keys, info) => {
  console.log('selected', keys, info);
};

const onCheck: TreeProps['onCheck'] = (keys, info) => {
  console.log('onCheck', keys, info);
};

const treeTheme: ConfigProviderProps['theme'] = {
  components: {
    Tree: {
      nodeHoverBg: '#fff2f0',
      nodeHoverColor: '#1677ff',
      nodeSelectedBg: '#ffa39e',
      nodeSelectedColor: '#fff',
      indentSize: 80,
    } as Record<string, any>,
  },
};
</script>
