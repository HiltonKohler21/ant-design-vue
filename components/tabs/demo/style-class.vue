<docs>
---
order: 17
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Tabs 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Tabs by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-tabs
      default-active-key="1"
      :items="items"
      :class-names="tabsClassNames"
      :styles="stylesObject"
    />
    <a-tabs
      tab-placement="start"
      type="card"
      default-active-key="1"
      :items="items"
      :class-names="tabsClassNames"
      :styles="stylesFn"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import type { TabsProps } from '@hiltonkohler21/ant-design-vue';

const tabsClassNames: TabsProps['classNames'] = {
  root: 'demo-tabs-semantic-root',
};

const stylesObject: TabsProps['styles'] = {
  root: {
    borderWidth: '2px',
    borderStyle: 'dashed',
    borderColor: 'var(--ant-color-border, #d9d9d9)',
    padding: '16px',
    marginBottom: '10px',
  },
  header: { backgroundColor: 'var(--ant-color-fill-alter, rgba(128, 128, 128, 0.06))' },
  item: { fontWeight: 700, color: '#1890ff', padding: '6px 10px' },
  indicator: { backgroundColor: 'rgba(255, 77, 79, 0.45)', height: '4px' },
  body: { backgroundColor: 'rgba(24, 144, 255, 0.1)' },
  content: { padding: '16px' },
};

const stylesFn: TabsProps['styles'] = info => {
  if (info.props.type === 'card') {
    return {
      root: {
        backgroundColor: 'var(--ant-color-fill-alter, rgba(128, 128, 128, 0.06))',
        borderColor: 'var(--ant-color-border-secondary, #d9d9d9)',
      },
      header: { textAlign: 'start' },
    };
  }
  return {};
};

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Tab 1',
    children: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    label: 'Tab 2',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: 'Tab 3',
    children: 'Content of Tab Pane 3',
  },
];
</script>

<style>
.demo-tabs-semantic-root {
  border-width: 2px;
  border-style: dashed;
  padding: 16px;
  margin-bottom: 10px;
}
</style>
