<docs>
---
order: 6
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Checkbox 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Checkbox by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle" class="checkbox-style-class-demo">
    <a-checkbox v-model:checked="checked1" :styles="stylesObject">Object styles</a-checkbox>
    <a-checkbox v-model:checked="checked2" :class-names="classNamesFn">Function styles</a-checkbox>
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { CheckboxProps } from 'ant-design-vue';

const checked1 = ref(false);
const checked2 = ref(true);

const stylesObject: CheckboxProps['styles'] = {
  icon: {
    borderRadius: '6px',
  },
  label: {
    color: 'var(--ant-color-primary, #1677ff)',
  },
};

const classNamesFn: CheckboxProps['classNames'] = info => {
  if (info.props.checked) {
    return {
      root: 'custom-checkbox-root',
      icon: 'custom-checkbox-icon custom-checkbox-icon-checked',
      label: 'custom-checkbox-label custom-checkbox-label-checked',
    };
  }
  return {
    root: 'custom-checkbox-root',
    icon: 'custom-checkbox-icon',
    label: 'custom-checkbox-label',
  };
};
</script>

<style scoped>
.checkbox-style-class-demo :deep(.custom-checkbox-root) {
  border-radius: var(--ant-border-radius, 6px);
  background-color: var(--ant-color-bg-container, transparent);
}

.checkbox-style-class-demo :deep(.custom-checkbox-icon .ant-checkbox-inner) {
  border-color: var(--ant-color-warning, #faad14);
}

.checkbox-style-class-demo :deep(.custom-checkbox-icon-checked .ant-checkbox-inner) {
  background-color: var(--ant-color-warning, #faad14);
  border-color: var(--ant-color-warning, #faad14);
}

.checkbox-style-class-demo :deep(.custom-checkbox-label) {
  color: var(--ant-color-text-disabled, rgba(0, 0, 0, 0.25));
  font-weight: bold;
}

.checkbox-style-class-demo :deep(.custom-checkbox-label-checked) {
  color: var(--ant-color-warning, #faad14);
}
</style>
