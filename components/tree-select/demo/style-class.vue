<docs>
---
order: 12
version: 6.0.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom Semantic DOM Styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 TreeSelect 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of TreeSelect by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="large" class="tree-select-style-class-demo">
    <a-tree-select
      v-model:value="value1"
      :tree-data="treeData"
      :class-names="classNames"
      :styles="stylesObject"
      placeholder="Object"
    />
    <a-tree-select
      v-model:value="value2"
      :tree-data="treeData"
      :class-names="classNames"
      :styles="stylesFn"
      placeholder="Function"
      size="middle"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { TreeSelectProps } from 'ant-design-vue';

const value1 = ref<string>();
const value2 = ref<string>();

const classNames: TreeSelectProps['classNames'] = {
  root: 'custom-tree-select-root',
  popup: {
    root: 'custom-tree-select-popup-root',
  },
};

const stylesObject: TreeSelectProps['styles'] = {
  root: {
    fontSize: '16px',
  },
  suffix: {
    color: '#1890ff',
  },
  popup: {
    root: {
      border: '1px solid #1890ff',
    },
  },
};

const stylesFn: TreeSelectProps['styles'] = info => {
  if (info.props.size === 'middle') {
    return {
      suffix: {
        color: '#722ed1',
      },
      popup: {
        root: {
          border: '1px solid #722ed1',
        },
      },
    };
  }
  return {};
};

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
</script>

<style scoped>
.tree-select-style-class-demo :deep(.custom-tree-select-root) {
  width: 300px;
  border-radius: var(--ant-border-radius, 6px);
}

:global(.custom-tree-select-popup-root) {
  border-radius: var(--ant-border-radius-lg, 8px);
}
</style>
