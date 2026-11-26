<docs>
---
order: 10
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Radio 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Radio by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle" class="radio-style-class-demo">
    <a-radio
      name="style-class"
      :styles="stylesObject"
      :checked="value === 'styles'"
      @change="value = 'styles'"
    >
      Object styles
    </a-radio>
    <a-radio
      name="style-class"
      :class-names="classNamesFn"
      :checked="value === 'classNames'"
      @change="value = 'classNames'"
    >
      Function classNames
    </a-radio>
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { RadioProps } from '@hiltonkohler21/ant-design-vue';

const value = ref<'styles' | 'classNames'>('styles');

const stylesObject: RadioProps['styles'] = {
  icon: {
    borderRadius: '6px',
  },
  label: {
    color: 'var(--ant-color-primary, #1677ff)',
  },
};

const classNamesFn: RadioProps['classNames'] = info => {
  if (info.props.checked) {
    return {
      root: 'custom-radio-root',
      icon: 'custom-radio-icon custom-radio-icon-checked',
      label: 'custom-radio-label custom-radio-label-checked',
    };
  }
  return {
    root: 'custom-radio-root',
    icon: 'custom-radio-icon',
    label: 'custom-radio-label',
  };
};
</script>

<style scoped>
.radio-style-class-demo :deep(.custom-radio-root) {
  border-radius: var(--ant-border-radius, 6px);
  background-color: var(--ant-color-bg-container, transparent);
}

.radio-style-class-demo :deep(.custom-radio-icon .ant-radio-inner) {
  border-color: var(--ant-color-warning, #faad14);
}

.radio-style-class-demo :deep(.custom-radio-icon-checked .ant-radio-inner) {
  background-color: var(--ant-color-warning, #faad14);
  border-color: var(--ant-color-warning, #faad14);
}

.radio-style-class-demo :deep(.custom-radio-label) {
  color: var(--ant-color-text-disabled, rgba(0, 0, 0, 0.25));
  font-weight: bold;
}

.radio-style-class-demo :deep(.custom-radio-label-checked) {
  color: var(--ant-color-warning, #faad14);
}
</style>
