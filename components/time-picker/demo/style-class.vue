<docs>
---
order: 15
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 TimePicker 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of TimePicker by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle" class="time-picker-style-class-demo">
    <a-time-picker :class-names="pickerClassNames" :styles="stylesObject" placeholder="Object" />
    <a-time-picker
      :class-names="pickerClassNames"
      :styles="stylesFn"
      placeholder="Function"
      size="large"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import type { TimePickerProps } from 'ant-design-vue';

const pickerClassNames: TimePickerProps['classNames'] = {
  root: 'custom-time-picker-root',
};

const stylesObject: TimePickerProps['styles'] = {
  root: {
    borderColor: '#d9d9d9',
  },
};

const stylesFn: TimePickerProps['styles'] = info => {
  if (info.props.size === 'large') {
    return {
      root: {
        borderColor: '#722ed1',
      },
      suffix: {
        color: '#722ed1',
      },
      popup: {
        container: { border: '1px solid #722ed1', borderRadius: '8px' },
      },
    };
  }
  return {};
};
</script>

<style scoped>
.time-picker-style-class-demo :deep(.custom-time-picker-root) {
  border: 1px solid var(--ant-color-primary, #1677ff);
  width: 150px;
  max-width: 100%;
}
</style>
