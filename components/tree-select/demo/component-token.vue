<docs>
---
order: 13
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
  <a-config-provider :theme="treeSelectTheme">
    <a-tree-select
      v-model:value="value"
      show-search
      style="width: 100%"
      :styles="popupStyles"
      placeholder="Please select"
      allow-clear
      tree-default-expand-all
      :tree-data="treeData"
      tree-node-filter-prop="label"
    >
      <template #title="{ value: val, label }">
        <b v-if="val === 'leaf3'" style="color: #08c">{{ label }}</b>
        <template v-else>{{ label }}</template>
      </template>
    </a-tree-select>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ConfigProviderProps, TreeSelectProps } from 'ant-design-vue';

const value = ref<string>();

const treeData: TreeSelectProps['treeData'] = [
  {
    value: 'parent 1',
    label: 'parent 1',
    children: [
      {
        value: 'parent 1-0',
        label: 'parent 1-0',
        children: [
          {
            value: 'leaf1',
            label: 'leaf1',
          },
          {
            value: 'leaf2',
            label: 'leaf2',
          },
        ],
      },
      {
        value: 'parent 1-1',
        label: 'parent 1-1',
        children: [
          {
            value: 'leaf3',
            label: 'leaf3',
          },
        ],
      },
    ],
  },
];

const popupStyles: TreeSelectProps['styles'] = {
  popup: {
    root: {
      maxHeight: '400px',
      overflow: 'auto',
    },
  },
};

const treeSelectTheme: ConfigProviderProps['theme'] = {
  components: {
    TreeSelect: {
      nodeHoverBg: '#fff2f0',
      nodeSelectedBg: '#ffa39e',
    } as Record<string, any>,
  },
};
</script>
