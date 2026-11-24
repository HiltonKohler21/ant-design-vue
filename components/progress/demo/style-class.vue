<docs>
---
order: 15
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象或者函数可以自定义 Progress 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Progress by passing objects or functions through `classNames` and `styles`.

</docs>

<template>
  <a-flex vertical gap="large">
    <a-progress :class-names="classNames" :styles="stylesFn" :percent="10" />
    <a-progress :class-names="classNames" :styles="stylesFn" :percent="20" />
    <a-progress :class-names="classNames" :styles="stylesFn" :percent="40" />
    <a-progress :class-names="classNames" :styles="stylesFn" :percent="60" />
    <a-progress :class-names="classNames" :styles="stylesFn" :percent="80" />
    <a-progress :class-names="classNames" :styles="stylesFn" :percent="99" />
  </a-flex>
</template>

<script lang="ts" setup>
import type { ProgressProps } from 'ant-design-vue';

const classNames: ProgressProps['classNames'] = {
  root: 'demo-progress-root',
  rail: 'demo-progress-rail',
  track: 'demo-progress-track',
};

const stylesFn: ProgressProps['styles'] = info => {
  const percent = info?.props?.percent ?? 0;
  const hue = 200 - (200 * percent) / 100;
  return {
    track: {
      backgroundImage: `linear-gradient(to right, hsla(${hue}, 85%, 65%, 1), hsla(${
        hue + 30
      }, 90%, 55%, 0.95))`,
      borderRadius: '8px',
      transition: 'all 0.3s ease',
    },
    rail: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
    },
  };
};
</script>
