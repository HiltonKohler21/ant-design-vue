<docs>
---
order: 8
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Popconfirm 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Popconfirm by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex gap="middle">
    <a-popconfirm
      title="Object text"
      description="Object description"
      :class-names="classNames"
      :styles="stylesObject"
      :arrow="false"
    >
      <a-button>Object Style</a-button>
    </a-popconfirm>
    <a-popconfirm
      title="Function text"
      description="Function description"
      :class-names="classNames"
      :styles="stylesFn"
      :arrow="false"
      :ok-button-props="okButtonProps"
      :cancel-button-props="cancelButtonProps"
    >
      <a-button type="primary">Function Style</a-button>
    </a-popconfirm>
  </a-flex>
</template>

<script lang="ts" setup>
import type { PopconfirmProps } from 'ant-design-vue';

const classNames: PopconfirmProps['classNames'] = {
  container: 'popconfirm-style-class-container',
};

const stylesObject: PopconfirmProps['styles'] = {
  container: {
    backgroundColor: '#eee',
    boxShadow: 'inset 5px 5px 3px #fff, inset -5px -5px 3px #ddd, 0 0 3px rgba(0,0,0,0.2)',
  },
  title: {
    color: '#262626',
  },
  content: {
    color: '#262626',
  },
};

const stylesFn: PopconfirmProps['styles'] = info => {
  if (!info.props.arrow) {
    return {
      container: {
        backgroundColor: 'rgba(53, 71, 125, 0.8)',
        padding: '12px',
        borderRadius: '4px',
      },
      title: {
        color: '#fff',
      },
      content: {
        color: '#fff',
      },
    };
  }
  return {};
};

const okButtonProps: PopconfirmProps['okButtonProps'] = {
  styles: {
    root: {
      backgroundColor: 'rgba(53, 71, 125, 0.6)',
      color: '#fff',
    },
  },
};

const cancelButtonProps: PopconfirmProps['cancelButtonProps'] = {
  styles: {
    root: {
      borderColor: 'rgba(53, 71, 125, 0.6)',
      backgroundColor: '#fff',
      color: 'rgba(53, 71, 125, 0.8)',
    },
  },
};
</script>

<style scoped>
:global(.popconfirm-style-class-container) {
  padding: 10px;
}
</style>
