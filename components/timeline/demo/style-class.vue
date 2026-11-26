<docs>
---
order: 12
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Timeline 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Timeline by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-timeline
      orientation="horizontal"
      :items="items"
      :class-names="timelineClassNames"
      :styles="stylesObject"
    />
    <a-timeline
      orientation="vertical"
      :items="items"
      :class-names="timelineClassNames"
      :styles="stylesFn"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import type { TimelineProps } from '@hiltonkohler21/ant-design-vue';

const timelineClassNames: TimelineProps['classNames'] = {
  root: 'demo-timeline-semantic-root',
};

const stylesObject: TimelineProps['styles'] = {
  itemIcon: {
    borderColor: '#1890ff',
  },
};

const stylesFn: TimelineProps['styles'] = info => {
  if (info.props.orientation === 'vertical') {
    return {
      root: {
        padding: '10px 6px',
        border: '1px solid #A294F9',
      },
      itemIcon: {
        borderColor: '#A294F9',
      },
    };
  }
  return {};
};

const items: TimelineProps['items'] = [
  {
    title: '2015-09-01',
    content: 'Create a services site',
  },
  {
    title: '2015-09-01 09:12:11',
    content: 'Solve initial network problems',
  },
  {
    content: 'Technical testing',
  },
];
</script>

<style>
.demo-timeline-semantic-root {
  padding: 8px;
  border-radius: 4px;
}
</style>
