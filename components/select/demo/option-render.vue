<docs>
---
order: 3.5
version: 4.3.0
title:
  zh-CN: 自定义下拉选项
  en-US: Custom dropdown options
---

## zh-CN

使用 `optionRender` 自定义渲染下拉选项。

## en-US

Use `optionRender` to customize the rendering dropdown options.
</docs>

<template>
  <a-select
    v-model:value="value"
    mode="multiple"
    style="width: 100%"
    placeholder="Please select your current mood."
    :options="options"
    :option-render="optionRender"
    @change="handleChange"
  />
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { Space } from '@hiltonkohler21/ant-design-vue';
import type { SelectProps } from '@hiltonkohler21/ant-design-vue';

const value = ref<string[]>(['happy']);

const options = [
  {
    label: 'Happy',
    value: 'happy',
    emoji: '😄',
    desc: 'Feeling Good',
  },
  {
    label: 'Sad',
    value: 'sad',
    emoji: '😢',
    desc: 'Feeling Blue',
  },
  {
    label: 'Angry',
    value: 'angry',
    emoji: '😡',
    desc: 'Furious',
  },
  {
    label: 'Cool',
    value: 'cool',
    emoji: '😎',
    desc: 'Chilling',
  },
  {
    label: 'Sleepy',
    value: 'sleepy',
    emoji: '😴',
    desc: 'Need Sleep',
  },
];

const optionRender: SelectProps['optionRender'] = option =>
  h(Space, null, () => [
    h('span', { role: 'img', 'aria-label': option.data.label }, option.data.emoji),
    `${option.data.label} (${option.data.desc})`,
  ]);

const handleChange = (val: string[]) => {
  console.log(`selected ${val}`);
};
</script>
