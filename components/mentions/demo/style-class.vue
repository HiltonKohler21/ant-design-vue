<docs>
---
order: 12
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Mentions 的[语义化结构](#semantic-dom)样式，例如设置文本框可缩放。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Mentions by passing objects/functions through `classNames` and `styles`. For example, set the textarea to be resizable.
</docs>

<template>
  <a-flex vertical gap="middle" class="mentions-style-class-demo">
    <a-mentions
      :options="options"
      :class-names="semanticClassNames"
      :styles="stylesObject"
      placeholder="Object"
      :rows="2"
    />
    <a-mentions
      :options="options"
      :class-names="semanticClassNames"
      :styles="stylesFunction"
      variant="filled"
      placeholder="Function"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import type { MentionsProps } from '@hiltonkohler21/ant-design-vue';

const options: MentionsProps['options'] = [
  { value: 'afc163', label: 'afc163' },
  { value: 'zombieJ', label: 'zombieJ' },
  { value: 'meet-student', label: 'meet-student' },
  { value: 'thinkasany', label: 'thinkasany' },
];

const semanticClassNames: MentionsProps['classNames'] = {
  root: 'custom-mentions-root',
};

const stylesObject: MentionsProps['styles'] = {
  textarea: {
    fontSize: '14px',
    resize: 'vertical',
    fontWeight: 200,
  },
};

const stylesFunction: MentionsProps['styles'] = info => {
  if (info.props.variant === 'filled') {
    return {
      root: {
        border: '1px solid #722ed1',
      },
      popup: {
        border: '1px solid #722ed1',
      },
    };
  }
  return {};
};
</script>

<style scoped>
.mentions-style-class-demo :deep(.custom-mentions-root) {
  border: 1px solid #1677ff;
  border-radius: 8px;
  width: 300px;
  max-width: 100%;
}
</style>
