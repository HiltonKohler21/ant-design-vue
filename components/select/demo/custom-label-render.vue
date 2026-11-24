<docs>
---
order: 13.6
version: 4.3.0
title:
  zh-CN: 自定义选中 label
  en-US: Custom Selected Label Render
---

## zh-CN

允许自定义渲染当前选中的 label，可用于 value 回填但对应选项缺失而不想直接渲染 value 的场景。

## en-US

Allows custom rendering of the currently selected label, which can be used for value backfill when the corresponding option is missing and you do not want to directly render the value.
</docs>

<template>
  <a-select
    v-model:value="value"
    :label-render="labelRender"
    style="width: 100%"
    :options="options"
  />
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import type { SelectProps } from 'ant-design-vue';

const value = ref<string>('1');

const options: SelectProps['options'] = [
  { label: 'gold', value: 'gold' },
  { label: 'lime', value: 'lime' },
  { label: 'green', value: 'green' },
  { label: 'cyan', value: 'cyan' },
];

const labelRender: SelectProps['labelRender'] = props => {
  const { label, value: val } = props;
  if (label) {
    return val;
  }
  return h('span', 'No option match');
};
</script>
