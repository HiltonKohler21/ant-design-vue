<docs>
---
order: 10
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Menu 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Menu by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-menu
      :class-names="menuClassNames"
      :items="items"
      :styles="objectStyles"
      :style="{ maxWidth: '100%' }"
    />
    <a-menu
      mode="inline"
      :class-names="menuClassNames"
      :items="items"
      :styles="stylesFn"
      :style="{ maxWidth: '100%' }"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import type { MenuProps } from 'ant-design-vue';

const menuClassNames: MenuProps['classNames'] = {
  root: 'demo-menu-root',
  item: 'demo-menu-item',
};

const items: MenuProps['items'] = [
  {
    key: 'SubMenu',
    label: 'Navigation One',
    children: [
      {
        key: 'g1',
        label: 'Item 1',
        type: 'group',
        children: [
          { key: '1', label: 'Option 1' },
          { key: '2', label: 'Option 2' },
        ],
      },
    ],
  },
  { key: 'mail', label: 'Navigation Two' },
];

const objectStyles: MenuProps['styles'] = {
  root: {
    border: '1px solid var(--ant-color-border-secondary, #f0f0f0)',
    padding: '8px',
    borderRadius: '4px',
  },
  item: {
    color: '#1677ff',
  },
  subMenu: {
    list: {
      color: '#fa541c',
    },
  },
};

const stylesFn: MenuProps['styles'] = info => {
  const hasSub = info.props.items?.[0];
  return {
    root: {
      backgroundColor: hasSub ? 'rgba(22, 119, 255, 0.08)' : undefined,
    },
  };
};
</script>

<style>
.demo-menu-root {
  border: 1px solid var(--ant-color-border-secondary, #f0f0f0);
  max-width: 100%;
  padding: 8px;
  border-radius: 4px;
}
.demo-menu-item {
  color: #1677ff;
}
</style>
