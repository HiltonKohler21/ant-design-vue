<docs>
---
order: 14.5
debug: true
title:
  zh-CN: 菜单项省略样式调试
  en-US: Menu item ellipsis
---

## zh-CN

调试 Cascader.Panel 菜单项长文本省略样式。

## en-US

Debug Cascader.Panel menu item ellipsis.
</docs>

<template>
  <a-cascader-panel :options="options" @change="onChange" />
</template>

<script lang="ts" setup>
import type { CascaderProps } from 'ant-design-vue';

const options: CascaderProps['options'] = [
  {
    value: 'zhejiang',
    label: 'ZhejiangZhejiangZhejiangZhejiangZhejiangZhejiangZhejiangZhejiangZhejiang',
    'aria-label': 'Zhejiang',
    'data-title': 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'HangzhouHangzhouHangzhouHangzhouHangzhouHangzhou',
        'aria-label': 'Hangzhou',
        'data-title': 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West LakeWest LakeWest LakeWest LakeWest Lake',
            'aria-label': 'West Lake',
            'data-title': 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'JiangsuJiangsuJiangsuJiangsuJiangsuJiangsuJiangsu',
    'aria-label': 'Jiangsu',
    'data-title': 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'NanjingNanjingNanjingNanjingNanjing',
        'aria-label': 'Nanjing',
        'data-title': 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua MenZhong Hua MenZhong Hua Men',
            'aria-label': 'Zhong Hua Men',
            'data-title': 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const onChange = (value: any) => {
  console.log(value);
};
</script>
