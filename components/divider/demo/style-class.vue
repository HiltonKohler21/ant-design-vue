<docs>
---
order: 8
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义分割线的[语义结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of divider by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <div>
    <a-divider :class-names="classNamesObject">classNames Object</a-divider>
    <a-divider title-placement="start" :class-names="classNamesFn">classNames Function</a-divider>
    <a-divider :styles="stylesObject">styles Object</a-divider>
    <a-divider size="small" :styles="stylesFn">styles Function</a-divider>
  </div>
</template>

<script lang="ts" setup>
import type { DividerProps } from '@hiltonkohler21/ant-design-vue';

const classNamesObject: DividerProps['classNames'] = {
  root: 'demo-divider-root',
  content: 'demo-divider-content',
  rail: 'demo-divider-rail',
};

const classNamesFn: DividerProps['classNames'] = info => {
  if (info.props.titlePlacement === 'start') {
    return {
      root: 'demo-divider-root--start',
    };
  }
  return {
    root: 'demo-divider-root--default',
  };
};

const stylesObject: DividerProps['styles'] = {
  root: { borderWidth: '2px', borderStyle: 'dashed' },
  content: { fontStyle: 'italic' },
  rail: { opacity: 0.85 },
};

const stylesFn: DividerProps['styles'] = info => {
  if (info.props.size === 'small') {
    return {
      root: { opacity: 0.6, cursor: 'default' },
    };
  }
  return {
    root: { backgroundColor: '#fafafa', borderColor: '#d9d9d9' },
  };
};
</script>
