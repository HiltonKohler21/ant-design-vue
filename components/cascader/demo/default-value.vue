<docs>
---
order: 0.5
title:
  zh-CN: 默认值
  en-US: Default value
---

## zh-CN

默认值通过数组的方式指定。

## en-US

Specifies default value by an array.
</docs>

<template>
  <a-cascader
    v-model:value="value"
    :options="options"
    placeholder="Please select"
    @change="onChange"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { CascaderProps } from '@hiltonkohler21/ant-design-vue';

const value = ref<string[]>(['zhejiang', 'hangzhou', 'xihu']);

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

const onChange: CascaderProps['onChange'] = val => {
  console.log(val);
};
</script>
