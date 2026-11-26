<docs>
---
order: 12
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom Semantic DOM Styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Segmented 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of the Segmented by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle" class="segmented-style-class-demo">
    <a-segmented
      v-model:value="value1"
      :options="options"
      :class-names="classNames"
      :styles="stylesObject"
    />
    <a-segmented
      v-model:value="value2"
      :options="options"
      :class-names="classNames"
      :styles="stylesFn"
      vertical
    />
  </a-flex>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { CloudOutlined, RocketOutlined, ThunderboltOutlined } from '@ant-design/icons-vue';
import type { SegmentedProps } from '@hiltonkohler21/ant-design-vue';

const value1 = ref('boost');
const value2 = ref('boost');

const classNames: SegmentedProps['classNames'] = {
  root: 'custom-segmented-root',
};

const stylesObject: SegmentedProps['styles'] = {
  root: {
    padding: '4px',
    width: '260px',
  },
};

const stylesFn: SegmentedProps['styles'] = info => {
  if (info.props.vertical) {
    return {
      root: {
        border: '1px solid #77BEF0',
        padding: '4px',
        width: '100px',
      },
      icon: {
        color: '#77BEF0',
      },
      item: {
        textAlign: 'start',
      },
    };
  }
  return {};
};

const options: SegmentedProps['options'] = [
  {
    label: 'Boost',
    value: 'boost',
    icon: h(RocketOutlined),
  },
  {
    label: 'Stream',
    value: 'stream',
    icon: h(ThunderboltOutlined),
  },
  {
    label: 'Cloud',
    value: 'cloud',
    icon: h(CloudOutlined),
  },
];
</script>

<style scoped>
.segmented-style-class-demo :deep(.custom-segmented-root) {
  padding: 2px;
}
</style>
