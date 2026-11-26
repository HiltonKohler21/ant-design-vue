<docs>
---
order: 14
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 ColorPicker 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of ColorPicker by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-space :size="[8, 16]" wrap class="color-picker-style-class-demo">
    <a-flex gap="small">
      <a-color-picker
        default-value="#1677ff"
        :arrow="false"
        :styles="stylesObject"
        :class-names="pickerClassNames"
      />
    </a-flex>
    <a-flex gap="small">
      <a-color-picker
        default-value="#722ed1"
        size="large"
        :styles="stylesFn"
        :arrow="false"
        :class-names="pickerClassNames"
      />
    </a-flex>
  </a-space>
</template>

<script lang="ts" setup>
import type { ColorPickerProps } from '@hiltonkohler21/ant-design-vue';

const pickerClassNames: ColorPickerProps['classNames'] = {
  root: 'custom-color-picker-root',
};

const stylesObject: ColorPickerProps['styles'] = {
  popup: {
    root: {
      border: '1px solid var(--ant-color-primary, #1677ff)',
    },
  },
};

const stylesFn: ColorPickerProps['styles'] = info => {
  if (info.props.size === 'large') {
    return {
      popup: {
        root: {
          border: '1px solid #722ed1',
        },
      },
    };
  }
  return {};
};
</script>

<style scoped>
.color-picker-style-class-demo :deep(.custom-color-picker-root) {
  border-radius: var(--ant-border-radius, 6px);
}
</style>
