<docs>
---
order: 15
title:
  zh-CN: 菜单可选选择
  en-US: Selectable Menu
---

## zh-CN

添加 `menu` 中的 `selectable` 属性可以开启选择能力。

## en-US

Configure the `selectable` property in `menu` to enable selectable ability.
</docs>

<template>
  <a-dropdown
    :menu="{
      items,
      selectable: true,
      defaultSelectedKeys: ['3'],
    }"
  >
    <a-typography-link>
      <a-space>
        Selectable
        <DownOutlined />
      </a-space>
    </a-typography-link>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { DownOutlined } from '@ant-design/icons-vue';

const items = [
  {
    key: '1',
    label: 'Item 1',
  },
  {
    key: '2',
    label: 'Item 2',
  },
  {
    key: '3',
    label: 'Item 3',
  },
];
</script>
