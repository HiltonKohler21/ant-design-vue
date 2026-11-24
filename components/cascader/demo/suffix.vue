<docs>
---
order: 11
version: 6.7.0
title:
  zh-CN: 前后缀
  en-US: Prefix and Suffix
---

## zh-CN

自定义后缀图标

## en-US

Custom suffix icon

</docs>
<template>
  <a-space wrap>
    <a-cascader
      v-model:value="value1"
      style="margin-top: 1rem"
      :options="options"
      placeholder="Please select"
    >
      <template #suffixIcon><smile-outlined class="test" /></template>
    </a-cascader>
    <a-cascader
      v-model:value="value2"
      suffix-icon="ab"
      style="margin-top: 1rem"
      :options="options"
      placeholder="Please select"
    />
  </a-space>
</template>
<script lang="ts" setup>
import { SmileOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import type { CascaderProps } from 'ant-design-vue';
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
const value1 = ref<string[]>([]);
const value2 = ref<string[]>([]);
</script>
