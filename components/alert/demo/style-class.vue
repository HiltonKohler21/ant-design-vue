<docs>
---
order: 15
version: 6.0.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Alert 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Alert by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle" class="alert-style-class-demo">
    <a-alert
      show-icon
      title="Object styles"
      type="info"
      :class-names="alertClassNames"
      :styles="stylesObject"
    >
      <template #action>
        <a-button size="small">Action</a-button>
      </template>
    </a-alert>
    <a-alert
      show-icon
      title="Function styles"
      type="success"
      :class-names="alertClassNames"
      :styles="stylesFn"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import type { AlertProps } from 'ant-design-vue';

const alertClassNames: AlertProps['classNames'] = {
  root: 'custom-alert-root',
};

const stylesObject: AlertProps['styles'] = {
  icon: {
    fontSize: '18px',
  },
  section: {
    fontWeight: 500,
  },
};

const stylesFn: AlertProps['styles'] = ({ props }) => {
  if (props.type === 'success') {
    return {
      root: {
        backgroundColor: 'rgba(82, 196, 26, 0.1)',
        borderColor: '#b7eb8f',
      },
      icon: {
        color: '#52c41a',
      },
    };
  }

  if (props.type === 'warning') {
    return {
      root: {
        backgroundColor: 'rgba(250, 173, 20, 0.1)',
        borderColor: '#ffe58f',
      },
      icon: {
        color: '#faad14',
      },
    };
  }

  return {};
};
</script>

<style scoped>
.alert-style-class-demo :deep(.custom-alert-root) {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 12px;
}
</style>
