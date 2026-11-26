<docs>
---
order: 6
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象或者函数可以自定义 Skeleton 组件的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Skeleton by passing objects or functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex gap="middle" class="skeleton-style-class-demo">
    <a-skeleton :class-names="baseClassNames" :styles="stylesObject" avatar :paragraph="false" />
    <a-skeleton :class-names="activeClassNames" :styles="stylesFn" active />
  </a-flex>
</template>

<script lang="ts" setup>
import type { SkeletonProps } from '@hiltonkohler21/ant-design-vue';

const baseClassNames: SkeletonProps['classNames'] = {
  root: 'demo-skeleton-root',
  header: 'demo-skeleton-header',
};

const activeClassNames: SkeletonProps['classNames'] = {
  root: 'demo-skeleton-root',
  header: 'demo-skeleton-header',
  paragraph: 'demo-skeleton-paragraph',
};

const stylesObject: SkeletonProps['styles'] = {
  avatar: {
    border: '1px solid #aaa',
  },
  title: {
    border: '1px solid #aaa',
  },
};

const stylesFn: SkeletonProps['styles'] = info => {
  if (info.props.active) {
    return {
      root: {
        border: '1px solid rgba(229, 243, 254, 0.3)',
      },
      title: {
        backgroundColor: 'rgba(229, 243, 254, 0.5)',
        height: '20px',
        borderRadius: '20px',
      },
    };
  }
  return {};
};
</script>

<style scoped>
.skeleton-style-class-demo :deep(.demo-skeleton-root) {
  border-radius: 10px;
  padding: 12px;
}

.skeleton-style-class-demo :deep(.demo-skeleton-header) {
  margin-bottom: 12px;
}

.skeleton-style-class-demo :deep(.demo-skeleton-paragraph > li) {
  background-color: rgba(229, 243, 254, 0.5);
}
</style>
