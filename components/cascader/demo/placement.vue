<docs>
---
order: 11.6
title:
  zh-CN: 弹出位置
  en-US: Placement
---

## zh-CN

可以通过 `placement` 手动指定弹出的位置。

## en-US

You can manually specify the position of the popup via `placement`.
</docs>

<template>
  <a-space direction="vertical" :style="{ maxWidth: '100%' }">
    <a-radio-group v-model:value="placement">
      <a-radio-button value="topLeft">topLeft</a-radio-button>
      <a-radio-button value="topRight">topRight</a-radio-button>
      <a-radio-button value="bottomLeft">bottomLeft</a-radio-button>
      <a-radio-button value="bottomRight">bottomRight</a-radio-button>
    </a-radio-group>
    <a-cascader :options="options" placeholder="Please select" :placement="placement" />
  </a-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { CascaderProps } from '@hiltonkohler21/ant-design-vue';

const placement = ref<'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'>('topLeft');

const options: CascaderProps['options'] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];
</script>
