<docs>
---
order: 22
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom Semantic DOM Styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Select 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Select by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle" class="select-style-class-demo">
    <a-select
      :options="options"
      :class-names="classNames"
      :styles="stylesObject"
      placeholder="Object"
    >
      <template #prefix>
        <MehOutlined />
      </template>
    </a-select>
    <a-select
      :options="options"
      :class-names="classNames"
      :styles="stylesFn"
      placeholder="Function"
      variant="filled"
    >
      <template #prefix>
        <MehOutlined />
      </template>
    </a-select>
  </a-flex>
</template>

<script lang="ts" setup>
import { MehOutlined } from '@ant-design/icons-vue';
import type { SelectProps } from 'ant-design-vue';

const classNames: SelectProps['classNames'] = {
  root: 'custom-select-root',
  popup: {
    root: 'custom-select-style-class-popup',
  },
};

const options: SelectProps['options'] = [
  { value: 'GuangZhou', label: 'GuangZhou' },
  { value: 'ShenZhen', label: 'ShenZhen' },
];

const stylesObject: SelectProps['styles'] = {
  prefix: {
    color: '#1890ff',
  },
  suffix: {
    color: '#1890ff',
  },
};

const stylesFn: SelectProps['styles'] = ({ props }) => {
  if (props.variant === 'filled') {
    return {
      prefix: {
        color: '#722ed1',
      },
      suffix: {
        color: '#722ed1',
      },
      popup: {
        root: {
          border: '1px solid #722ed1',
        },
      },
    };
  }
  return {};
};
</script>

<style scoped>
.select-style-class-demo :deep(.custom-select-root) {
  border-radius: 8px;
  width: 300px;
}

:global(.custom-select-style-class-popup) {
  border-radius: 8px;
}
</style>
