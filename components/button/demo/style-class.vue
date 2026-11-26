<docs>
---
order: 21
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom Semantic DOM Styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Button 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Button by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex gap="small" class="style-class-demo">
    <a-button type="default" :class-names="classNames" :styles="stylesObject">Object</a-button>
    <a-button type="primary" :class-names="classNames" :styles="stylesFn">Function</a-button>
  </a-flex>
</template>

<script lang="ts" setup>
import type { ButtonProps } from '@hiltonkohler21/ant-design-vue';

const classNames: ButtonProps['classNames'] = {
  root: 'custom-button-root',
  content: 'custom-button-content',
};

const stylesObject: ButtonProps['styles'] = {
  root: {
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
};

const stylesFn: ButtonProps['styles'] = info => {
  if (info.props.type === 'primary') {
    return {
      root: {
        backgroundColor: '#171717',
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
.style-class-demo :deep(.custom-button-root) {
  border: var(--ant-line-width, 1px) var(--ant-line-type, solid) var(--ant-color-border, #d9d9d9);
  border-radius: var(--ant-border-radius, 6px);
  padding: var(--ant-padding-xs, 8px) var(--ant-padding, 16px);
  height: auto;
}

.style-class-demo :deep(.custom-button-content) {
  color: var(--ant-color-text, rgba(0, 0, 0, 0.88));
}
</style>
