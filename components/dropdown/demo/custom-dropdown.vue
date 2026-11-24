<docs>
---
order: 9
title:
  zh-CN: 扩展菜单
  en-US: Custom dropdown
---

## zh-CN

使用 `popupRender` 对下拉菜单进行自由扩展。如果你并不需要 Menu 内容，请直接使用 Popover 组件。

## en-US

Customize the dropdown menu via `popupRender`. If you don't need the Menu content, use the Popover component directly.
</docs>

<template>
  <a-dropdown :menu="{ items }" :popup-render="popupRender">
    <a class="ant-dropdown-link" @click.prevent>
      <a-space>
        Hover me
        <DownOutlined />
      </a-space>
    </a>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { cloneVNode, h } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';
import { Button, Divider, Space, theme } from 'ant-design-vue';

const { useToken } = theme;
const { token } = useToken();

const items = [
  {
    key: '1',
    label: h(
      'a',
      { target: '_blank', rel: 'noopener noreferrer', href: 'https://www.antgroup.com' },
      '1st menu item',
    ),
  },
  {
    key: '2',
    label: h(
      'a',
      { target: '_blank', rel: 'noopener noreferrer', href: 'https://www.aliyun.com' },
      '2nd menu item (disabled)',
    ),
    disabled: true,
  },
  {
    key: '3',
    label: h(
      'a',
      { target: '_blank', rel: 'noopener noreferrer', href: 'https://www.luohanacademy.com' },
      '3rd menu item (disabled)',
    ),
    disabled: true,
  },
];

const popupRender = (menu: any) =>
  h(
    'div',
    {
      style: {
        backgroundColor: token.value.colorBgElevated,
        borderRadius: `${token.value.borderRadiusLG}px`,
        boxShadow: token.value.boxShadowSecondary,
      },
    },
    [
      menu ? cloneVNode(menu, { style: { boxShadow: 'none' } }) : null,
      h(Divider, { style: { margin: '0px' } }),
      h(Space, { style: { padding: '8px' } }, () =>
        h(Button, { type: 'primary' }, () => 'Click me!'),
      ),
    ],
  );
</script>
