<docs>
---
order: 14
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom Semantic DOM Styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Space 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Space by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <div class="space-style-class-demo">
    <a-space :styles="stylesObject" :class-names="classNamesObject" separator="•">
      <a-button>Styled Button 1</a-button>
      <a-button>Styled Button 2</a-button>
      <a-button>Styled Button 3</a-button>
    </a-space>
    <a-space size="large" :styles="stylesFn" :class-names="classNamesFn">
      <a-button>Large Space Button 1</a-button>
      <a-button>Large Space Button 2</a-button>
      <a-button>Large Space Button 3</a-button>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
import type { SpaceProps } from 'ant-design-vue';

const classNamesObject: SpaceProps['classNames'] = {
  root: 'demo-space-root',
  item: 'demo-space-item',
  separator: 'demo-space-separator',
};

const classNamesFn: SpaceProps['classNames'] = info => {
  if (info.props.orientation === 'vertical') {
    return {
      root: 'demo-space-root--vertical',
    };
  }
  return {
    root: 'demo-space-root--horizontal',
  };
};

const stylesObject: SpaceProps['styles'] = {
  root: {
    borderWidth: '2px',
    borderStyle: 'dashed',
    padding: '8px',
    marginBottom: '10px',
  },
  item: {
    backgroundColor: '#f0f0f0',
    padding: '4px',
  },
  separator: {
    color: 'red',
    fontWeight: 700,
  },
};

const stylesFn: SpaceProps['styles'] = info => {
  if (info.props.size === 'large') {
    return {
      root: {
        backgroundColor: '#e6f7ff',
        borderColor: '#1890ff',
        padding: '8px',
      },
    };
  }
  return {
    root: {
      backgroundColor: '#fff7e6',
      borderColor: '#fa8c16',
    },
  };
};
</script>
