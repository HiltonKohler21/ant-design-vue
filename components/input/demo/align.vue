<docs>
---
order: 102
debug: true
title:
  zh-CN: 文本对齐
  en-US: Text Align
---

## zh-CN

默认对齐效果。

## en-US

Align without Space.
</docs>

<template>
  <div style="max-width: 100%">
    <a-mentions :style="{ width: '100px' }" :rows="1" />
    <a-textarea :rows="1" :style="{ width: '100px' }" />
    <a-button type="primary">Button</a-button>
    <a-input :style="{ width: '100px' }" />
    <a-typography-text copyable>Ant Design</a-typography-text>
    <a-input prefix="1" suffix="2" :style="{ width: '100px' }" />
    <a-input addon-before="1" addon-after="2" :style="{ width: '100px' }" />
    <a-input-number :style="{ width: '100px' }" />
    <a-date-picker :style="{ width: '100px' }" />
    <a-time-picker :style="{ width: '100px' }" />
    <a-select :style="{ width: '100px' }" default-value="jack" :options="selectOptions" />
    <a-select :style="{ width: '100px' }" default-value="" :options="selectOptions" />
    <a-select :style="{ width: '100px' }" :options="selectOptions" />
    <a-tree-select :style="{ width: '100px' }" />
    <a-cascader
      v-model:value="cascaderVal"
      :options="options"
      :style="{ width: '180px', maxWidth: '100%' }"
    />
    <a-range-picker :style="{ maxWidth: '100%' }" />
    <a-date-picker picker="month" :style="{ width: '120px' }" />
    <a-radio-group default-value="a">
      <a-radio-button value="a">Hangzhou</a-radio-button>
      <a-radio-button value="b">Shanghai</a-radio-button>
    </a-radio-group>
    <a-auto-complete :style="{ width: '100px' }" placeholder="input here" />
    <br />
    <a-input prefix="$" addon-before="Http://" addon-after=".com" default-value="mysite" />
    <a-input :style="narrowStyle" suffix="Y" />
    <a-input :style="narrowStyle" />
    <a-input :style="narrowStyle" default-value="1" suffix="Y" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { CSSProperties } from 'vue';

const narrowStyle: CSSProperties = {
  width: '50px',
};

const cascaderVal = ref(['zhejiang', 'hangzhou', 'xihu']);

const options = [
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

const selectOptions = [
  { value: 'jack', label: 'Jack' },
  { value: 'lucy', label: 'Lucy' },
];
</script>
