<docs>
---
order: 14
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom Semantic DOM Styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Tooltip 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Tooltip by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex gap="middle">
    <a-tooltip :class-names="classNames" :styles="stylesObject" :arrow="false" title="Object text">
      <a-button>Object Style</a-button>
    </a-tooltip>
    <a-tooltip :class-names="classNames" :styles="stylesFn" :arrow="false" title="Function text">
      <a-button type="primary">Function Style</a-button>
    </a-tooltip>
  </a-flex>
</template>

<script lang="ts" setup>
import type { TooltipProps } from '@hiltonkohler21/ant-design-vue';

const classNames: TooltipProps['classNames'] = {
  container: 'custom-tooltip-style-class-container',
};

const stylesObject: TooltipProps['styles'] = {
  container: {
    borderRadius: '12px',
    boxShadow: 'inset 0 0 8px #ccc',
  },
};

const stylesFn: TooltipProps['styles'] = info => {
  if (!info.props.arrow) {
    return {
      container: {
        backgroundColor: 'rgba(53, 71, 125, 0.8)',
        padding: '12px',
        color: '#fff',
        borderRadius: '4px',
      },
    };
  }
  return {};
};
</script>

<style scoped>
:global(.custom-tooltip-style-class-container) {
  padding: 10px;
}
</style>
