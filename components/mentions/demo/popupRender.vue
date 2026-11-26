<docs>
---
order: 8
version: 4.3.0
title:
  zh-CN: 自定义弹出层
  en-US: Customize Popup
---

## zh-CN

使用 `popupRender` 对下拉菜单进行自定义渲染。

## en-US

Customize the dropdown menu rendering via `popupRender`.
</docs>

<template>
  <a-mentions style="width: 100%" :popup-render="popupRender" :options="options" />
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { Divider, theme } from '@hiltonkohler21/ant-design-vue';

const { token } = theme.useToken();

const options = [
  {
    value: 'afc163',
    label: 'afc163',
  },
  {
    value: 'zombieJ',
    label: 'zombieJ',
  },
  {
    value: 'yesmeck',
    label: 'yesmeck',
  },
];

const popupRender = (menu: any) =>
  h('div', null, [
    h(
      'div',
      {
        style: {
          padding: `${token.value.paddingXS}px ${token.value.paddingSM}px`,
          fontWeight: token.value.fontWeightStrong,
          color: token.value.colorTextDescription,
        },
      },
      'Custom Header',
    ),
    h(Divider, { style: { margin: `${token.value.marginXXS}px 0` } }),
    menu,
  ]);
</script>
