<docs>
---
order: 5.5
title:
  zh-CN: 自定义回填方式
  en-US: ShowCheckedStrategy
---

## zh-CN

通过设置 `showCheckedStrategy` 选择回填方式。

## en-US

Shows a selected item in a box using `showCheckedStrategy`.
</docs>

<template>
  <a-space direction="vertical" :style="{ width: '100%' }">
    <a-cascader
      v-model:value="valueChild"
      :style="{ width: '100%' }"
      :options="options"
      multiple
      max-tag-count="responsive"
      :show-checked-strategy="SHOW_CHILD"
      @change="onChange"
    />
    <a-cascader
      v-model:value="valueParent"
      :style="{ width: '100%' }"
      :options="options"
      multiple
      max-tag-count="responsive"
      @change="onChange"
    />
  </a-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Cascader } from '@hiltonkohler21/ant-design-vue';
import type { CascaderProps } from '@hiltonkohler21/ant-design-vue';

const { SHOW_CHILD } = Cascader;

const valueChild = ref<(string | number)[][]>([
  ['bamboo', 'little', 'fish'],
  ['bamboo', 'little', 'cards'],
  ['bamboo', 'little', 'bird'],
]);

const valueParent = ref<(string | number)[][]>([['bamboo']]);

const options: CascaderProps['options'] = [
  {
    label: 'Light',
    value: 'light',
    children: Array.from({ length: 20 }).map((_, index) => ({
      label: `Number ${index}`,
      value: index,
    })),
  },
  {
    label: 'Bamboo',
    value: 'bamboo',
    children: [
      {
        label: 'Little',
        value: 'little',
        children: [
          {
            label: 'Toy Fish',
            value: 'fish',
          },
          {
            label: 'Toy Cards',
            value: 'cards',
          },
          {
            label: 'Toy Bird',
            value: 'bird',
          },
        ],
      },
    ],
  },
];

const onChange: CascaderProps['onChange'] = value => {
  console.log(value);
};
</script>
