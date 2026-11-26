<docs>
---
order: 11.5
version: 4.3.0
title:
  zh-CN: 扩展菜单
  en-US: Custom dropdown
---

## zh-CN

使用 `popupRender` 对下拉菜单进行自由扩展。

## en-US

Customize the dropdown menu via `popupRender`.
</docs>

<template>
  <a-cascader :options="options" :popup-render="popupRender" placeholder="Please select" />
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { Divider } from '@hiltonkohler21/ant-design-vue';
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

const popupRender = (menus: any) =>
  h('div', null, [
    menus,
    h(Divider, { style: { margin: '0' } }),
    h('div', { style: { padding: '8px' } }, 'The footer is not very short.'),
  ]);
</script>
