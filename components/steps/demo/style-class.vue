<docs>
---
order: 15
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom Semantic DOM Styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Steps 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Steps by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle" class="steps-style-class-demo">
    <a-steps :items="items" :current="1" :class-names="classNames" :styles="stylesObject" />
    <a-steps
      :items="items"
      :current="1"
      :class-names="classNames"
      :styles="stylesFn"
      type="navigation"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import type { StepsProps } from '@hiltonkohler21/ant-design-vue';

const items: StepsProps['items'] = [
  { title: 'Finished', content: 'This is a content.' },
  { title: 'In Progress', content: 'This is a content.' },
  { title: 'Waiting', content: 'This is a content.' },
];

const classNames: StepsProps['classNames'] = {
  root: 'custom-steps-root',
};

const stylesObject: StepsProps['styles'] = {
  itemIcon: { borderRadius: '30%' },
  itemContent: { fontStyle: 'italic' },
};

const stylesFn: StepsProps['styles'] = info => {
  if (info.props.type === 'navigation') {
    return {
      root: {
        borderColor: '#1890ff',
      },
    };
  }
  return {};
};
</script>

<style scoped>
.steps-style-class-demo :deep(.custom-steps-root) {
  border: 2px dashed var(--ant-color-border, #d9d9d9);
  border-radius: var(--ant-border-radius, 6px);
  padding: var(--ant-padding, 16px);
}
</style>
