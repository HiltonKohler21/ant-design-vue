<docs>
---
order: 24
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 DatePicker 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of DatePicker by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle" class="date-picker-style-class-demo">
    <a-date-picker :class-names="pickerClassNames" :styles="stylesObject" placeholder="Object" />
    <a-date-picker
      :class-names="pickerClassNames"
      :styles="stylesFn"
      placeholder="Function"
      size="large"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import type { DatePickerProps } from '@hiltonkohler21/ant-design-vue';

const pickerClassNames: DatePickerProps['classNames'] = {
  root: 'custom-date-picker-root',
};

const stylesObject: DatePickerProps['styles'] = {
  input: { fontStyle: 'italic' },
  suffix: { opacity: 0.85 },
};

const stylesFn: DatePickerProps['styles'] = info => {
  if (info.props.size === 'large') {
    return {
      root: { borderColor: '#722ed1' },
      popup: {
        container: { border: '1px solid #722ed1', borderRadius: '8px' },
      },
    };
  }
  return {};
};
</script>

<style scoped>
.date-picker-style-class-demo :deep(.custom-date-picker-root) {
  border: 1px solid var(--ant-color-primary, #1677ff);
  width: 200px;
  max-width: 100%;
}
</style>
