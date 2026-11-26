<docs>
---
order: 11
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Badge 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Badge by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex gap="middle" align="center" class="badge-style-class-demo">
    <a-badge size="small" :count="5" :class-names="badgeClassNames" :styles="badgeStyles">
      <a-avatar shape="square" size="large" />
    </a-badge>
    <a-badge :count="5" :class-names="badgeClassNames" :styles="badgeStylesFn">
      <a-avatar shape="square" size="large" />
    </a-badge>
  </a-flex>
</template>

<script lang="ts" setup>
import type { BadgeProps } from '@hiltonkohler21/ant-design-vue';

const badgeClassNames: BadgeProps['classNames'] = {
  indicator: 'custom-badge-indicator',
};

const badgeStyles: BadgeProps['styles'] = {
  root: {
    borderRadius: '8px',
  },
};

const badgeStylesFn: BadgeProps['styles'] = info => {
  if (info.props.size === 'default') {
    return {
      indicator: {
        fontSize: '14px',
        backgroundColor: '#696FC7',
      },
    };
  }
  return {};
};
</script>

<style scoped>
.badge-style-class-demo :deep(.custom-badge-indicator) {
  font-size: 10px;
}
</style>
