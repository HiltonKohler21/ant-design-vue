<docs>
---
order: 8
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Result 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Result by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-result
    status="info"
    title="classNames Object"
    sub-title="This is a subtitle"
    :styles="stylesObject"
    :class-names="classNamesObject"
  >
    <template #extra>
      <a-button type="primary">Action</a-button>
    </template>
    <div>Content area</div>
  </a-result>
  <a-result
    status="success"
    title="classNames Function"
    sub-title="Dynamic class names"
    :styles="stylesFn"
    :class-names="classNamesFn"
  >
    <template #extra>
      <a-button>Action</a-button>
    </template>
  </a-result>
</template>

<script lang="ts" setup>
import type { ResultProps } from 'ant-design-vue';

const classNamesObject: ResultProps['classNames'] = {
  root: 'demo-result-root',
  title: 'demo-result-title',
  subTitle: 'demo-result-subtitle',
  icon: 'demo-result-icon',
  extra: 'demo-result-extra',
  body: 'demo-result-body',
};

const classNamesFn: ResultProps['classNames'] = info => {
  if (info.props.status === 'success') {
    return {
      root: 'demo-result-root--success',
    };
  }
  return {
    root: 'demo-result-root--default',
  };
};

const stylesObject: ResultProps['styles'] = {
  root: { borderWidth: '2px', borderStyle: 'dashed', padding: '16px' },
  title: { fontStyle: 'italic', color: '#1890ff' },
  subTitle: { fontWeight: 700 },
  icon: { opacity: 0.8 },
  extra: { backgroundColor: '#f0f0f0', padding: '8px' },
  body: { backgroundColor: '#fafafa', padding: '12px' },
};

const stylesFn: ResultProps['styles'] = info => {
  if (info.props.status === 'error') {
    return {
      root: { backgroundColor: '#fff2f0', borderColor: '#ff4d4f' },
      title: { color: '#ff4d4f' },
    };
  }
  return {
    root: { backgroundColor: '#f6ffed', borderColor: '#52c41a' },
    title: { color: '#52c41a' },
  };
};
</script>
