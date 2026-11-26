<docs>
---
order: 9
title:
  zh-CN: 省略中间
  en-US: Ellipsis from middle
---

## zh-CN

使用 `ellipsis={{ suffix: ... }}` 可以封装一个从中间省略内容的组件，适合于需要保留文本末位特征的内容。

## en-US

You can ellipsis content from middle by customize `ellipsis={{ suffix: ... }}`.
</docs>
<template>
  <EllipsisMiddle :suffix-count="12">
    In the process of internal desktop applications development, many different design specs and
    implementations would be involved, which might cause designers and developers difficulties and
    duplication and reduce the efficiency of development.
  </EllipsisMiddle>
</template>
<script lang="ts" setup>
import { h, type FunctionalComponent } from 'vue';
import { Typography } from '@hiltonkohler21/ant-design-vue';

const EllipsisMiddle: FunctionalComponent<{ suffixCount: number }> = (props, { slots }) => {
  const raw = slots.default?.() || [];
  const children = raw
    .map(node => (typeof node.children === 'string' ? node.children : ''))
    .join('')
    .trim();
  const start = children.slice(0, children.length - props.suffixCount);
  const suffix = children.slice(-props.suffixCount).trim();
  return h(
    Typography.Text,
    {
      style: { maxWidth: '100%' },
      ellipsis: { suffix },
    },
    () => start,
  );
};

EllipsisMiddle.props = {
  suffixCount: {
    type: Number,
    required: true,
  },
};
</script>
