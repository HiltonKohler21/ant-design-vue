<docs>
---
order: 12.5
debug: true
title:
  zh-CN: _InternalPanelDoNotUseOrYouWillBeFired
  en-US: _InternalPanelDoNotUseOrYouWillBeFired
---

## zh-CN

调试用组件，请勿直接使用。

## en-US

Debug usage. Do not use in your production.
</docs>

<template>
  <InternalTreeSelect default-value="lucy" :style="{ width: '100%' }" :tree-data="treeData" />
</template>

<script lang="ts" setup>
import { TreeSelect } from 'ant-design-vue';
import type { TreeSelectProps } from 'ant-design-vue';

const InternalTreeSelect = TreeSelect._InternalPanelDoNotUseOrYouWillBeFired;

const treeData: TreeSelectProps['treeData'] = [
  {
    title: 'Node1',
    value: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-1',
      },
      {
        title: 'Child Node2',
        value: '0-0-2',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
  },
];
</script>
