<docs>
---
order: 15
title:
  zh-CN: 级联面板
  en-US: Panel
---

## zh-CN

级联选择面板的独立使用。

## en-US

Standalone Cascader panel without dropdown popup.

</docs>
<template>
  <a-space direction="vertical" align="start">
    <a-switch
      v-model:checked="disabled"
      checked-children="Disabled"
      un-checked-children="Enabled"
    />
    <a-cascader-panel
      v-model:value="singleValue"
      :options="options"
      :disabled="disabled"
      @change="onChange"
    />
    <a-cascader-panel
      v-model:value="multipleValue"
      multiple
      :options="options"
      :disabled="disabled"
      @change="onMultipleChange"
    />
    <a-cascader-panel />
  </a-space>
</template>
<script lang="ts" setup>
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

const disabled = ref(false);
const singleValue = ref<(string | number)[]>([]);
const multipleValue = ref<(string | number)[][]>([]);

const onChange = (value: (string | number)[]) => {
  console.log(value);
};
const onMultipleChange = (value: (string | number)[][]) => {
  console.log(value);
};
</script>
