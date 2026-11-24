<docs>
---
order: 13.5
title:
  zh-CN: 自定义选择标签
  en-US: Custom Tag Render
---

## zh-CN

允许自定义选择标签的样式。

## en-US

Allows for custom rendering of tags.
</docs>

<template>
  <a-select
    v-model:value="value"
    mode="multiple"
    :tag-render="tagRender"
    style="width: 100%"
    :options="options"
  />
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { Tag } from 'ant-design-vue';
import type { SelectProps } from 'ant-design-vue';

const value = ref<string[]>(['gold', 'cyan']);

const options: SelectProps['options'] = [
  { value: 'gold', label: 'gold' },
  { value: 'lime', label: 'lime' },
  { value: 'green', label: 'green' },
  { value: 'cyan', label: 'cyan' },
];

const tagRender: SelectProps['tagRender'] = props => {
  const { label, value: tagValue, closable, onClose } = props;
  const onPreventMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return h(
    Tag,
    {
      color: tagValue,
      onMousedown: onPreventMouseDown,
      closable,
      onClose,
      style: { marginInlineEnd: '4px' },
    },
    () => label,
  );
};
</script>
