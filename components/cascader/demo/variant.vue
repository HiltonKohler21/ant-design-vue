<docs>
---
order: 12
version: 4.3.0
title:
  zh-CN: 形态变体
  en-US: Variants
---

## zh-CN

Cascader 形态变体，可选 `outlined`、`filled`、`borderless`、`underlined` 四种形态。

## en-US

Variants of Cascader, there are four variants: `outlined`, `filled`, `borderless` and `underlined`.

</docs>
<template>
  <a-space direction="vertical" style="width: 100%">
    <a-cascader :options="options" placeholder="Please select" variant="borderless" />
    <a-cascader :options="options" placeholder="Please select" variant="filled" />
    <a-cascader :options="options" placeholder="Please select" variant="outlined" />
    <a-cascader :options="options" placeholder="Please select" variant="underlined" />
  </a-space>
</template>
<script lang="ts" setup>
import type { CascaderProps } from '@hiltonkohler21/ant-design-vue';

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
];
</script>
