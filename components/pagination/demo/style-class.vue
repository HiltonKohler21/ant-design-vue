<docs>
---
order: 16
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Pagination 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Pagination by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-pagination :total="500" :class-names="paginationClassNames" :styles="objectStyles" />
    <a-pagination :total="500" size="small" :class-names="paginationClassNames" :styles="styleFn" />
  </a-flex>
</template>

<script lang="ts" setup>
import type { PaginationProps } from 'ant-design-vue';

const paginationClassNames: PaginationProps['classNames'] = {
  root: 'demo-pagination-root',
};

const objectStyles: PaginationProps['styles'] = {
  item: {
    borderRadius: '999px',
  },
};

const styleFn: PaginationProps['styles'] = ({ props }) => {
  if (props.size === 'small') {
    return {
      item: {
        backgroundColor: 'rgba(200, 200, 200, 0.3)',
        marginInlineEnd: '4px',
      },
    };
  }
  return {};
};
</script>

<style>
.demo-pagination-root {
  border: 2px dashed #ccc;
  padding: 8px;
}
</style>
