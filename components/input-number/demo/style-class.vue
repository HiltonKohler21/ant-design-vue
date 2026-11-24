<docs>
---
order: 16
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 InputNumber 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of the InputNumber by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle" class="input-number-style-class-demo">
    <a-input-number :class-names="semanticClassNames" :styles="stylesObject" placeholder="Object" />
    <a-input-number
      :class-names="semanticClassNames"
      :styles="stylesFn"
      placeholder="Function"
      size="large"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import type { InputNumberProps } from 'ant-design-vue';

const semanticClassNames: InputNumberProps['classNames'] = {
  root: 'custom-input-number-root',
};

const stylesObject: InputNumberProps['styles'] = {
  input: {
    fontSize: '14px',
  },
};

const stylesFn: InputNumberProps['styles'] = ({ props }) => {
  if (props.size === 'large') {
    return {
      root: {
        backgroundColor: 'rgba(114, 46, 209, 0.08)',
        borderColor: '#722ed1',
      },
    };
  }
  return {};
};
</script>

<style scoped>
.input-number-style-class-demo :deep(.custom-input-number-root) {
  border: 1px solid #1677ff;
  border-radius: 8px;
  width: 200px;
}
</style>
