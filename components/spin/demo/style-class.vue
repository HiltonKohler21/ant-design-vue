<docs>
---
order: 7
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Spin 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Spin by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex align="center" gap="medium" class="spin-style-class-demo">
    <a-spin spinning :percent="0" :class-names="classNames" :styles="stylesObject" />
    <a-spin spinning :percent="0" :class-names="classNames" :styles="stylesFn" size="small" />
  </a-flex>
</template>

<script lang="ts" setup>
import type { SpinProps } from '@hiltonkohler21/ant-design-vue';

const classNames: SpinProps['classNames'] = {
  root: 'custom-spin-root',
};

const stylesObject: SpinProps['styles'] = {
  indicator: {
    color: '#00d4ff',
  },
};

const stylesFn: SpinProps['styles'] = ({ props }) => {
  if (props.size === 'small') {
    return {
      indicator: {
        color: '#722ed1',
      },
    };
  }
  return {};
};
</script>

<style scoped>
.spin-style-class-demo :deep(.custom-spin-root) {
  padding: 8px;
}
</style>
