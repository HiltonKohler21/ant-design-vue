<docs>
---
order: 5
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Empty 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Empty by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle" class="empty-style-class-demo">
    <a-empty
      :image="simpleImage"
      description="Object styles"
      :class-names="emptyClassNames"
      :styles="stylesObject"
    >
      <a-button type="primary">Create Now</a-button>
    </a-empty>
    <a-empty
      :image="simpleImage"
      description="Function styles"
      :class-names="emptyClassNames"
      :styles="stylesFn"
    >
      <a-button type="primary">Create Now</a-button>
    </a-empty>
  </a-flex>
</template>

<script lang="ts" setup>
import { Empty } from 'ant-design-vue';
import type { EmptyProps } from 'ant-design-vue';

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

const emptyClassNames: EmptyProps['classNames'] = {
  root: 'custom-empty-root',
};

const stylesObject: EmptyProps['styles'] = {
  root: { backgroundColor: '#f5f5f5', borderRadius: '8px' },
  image: { filter: 'grayscale(100%)' },
  description: { color: '#1890ff', fontWeight: 700 },
  footer: { marginTop: '16px' },
};

const stylesFn: EmptyProps['styles'] = ({ props }) => {
  if (props.description) {
    return {
      root: { backgroundColor: '#e6f7ff', border: '1px solid #91d5ff' },
      description: { color: '#1890ff', fontWeight: 700 },
      image: { filter: 'hue-rotate(180deg)' },
    };
  }
  return {};
};
</script>

<style scoped>
.empty-style-class-demo :deep(.custom-empty-root) {
  border: 1px dashed #ccc;
  padding: 16px;
}
</style>
