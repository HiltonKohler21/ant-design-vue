<docs>
---
order: 6
version: 6.0.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Popover 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Popover by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex gap="middle">
    <a-popover
      content="Object text"
      :class-names="classNames"
      :styles="stylesObject"
      :arrow="false"
    >
      <a-button>Object Style</a-button>
    </a-popover>
    <a-popover content="Function text" :class-names="classNames" :styles="stylesFn" :arrow="false">
      <a-button type="primary">Function Style</a-button>
    </a-popover>
  </a-flex>
</template>

<script lang="ts" setup>
import type { PopoverProps } from 'ant-design-vue';

const classNames: PopoverProps['classNames'] = {
  container: 'popover-style-class-container',
};

const stylesObject: PopoverProps['styles'] = {
  container: {
    background: '#eee',
    boxShadow: 'inset 5px 5px 3px #fff, inset -5px -5px 3px #ddd, 0 0 3px rgba(0,0,0,0.2)',
  },
  content: {
    color: '#262626',
  },
};

const stylesFn: PopoverProps['styles'] = info => {
  if (!info.props.arrow) {
    return {
      container: {
        backgroundColor: 'rgba(53, 71, 125, 0.8)',
        padding: '12px',
        borderRadius: '4px',
      },
      content: {
        color: '#fff',
      },
    };
  }
  return {};
};
</script>

<style scoped>
:global(.popover-style-class-container) {
  padding: 10px;
}
</style>
