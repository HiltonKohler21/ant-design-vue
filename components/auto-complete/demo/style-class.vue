<docs>
---
order: 9
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 AutoComplete 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of AutoComplete by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle" class="autocomplete-style-class-demo">
    <a-auto-complete
      v-model:value="value1"
      :options="options"
      :class-names="autoCompleteClassNames"
      :styles="stylesObject"
      style="width: 200px"
      placeholder="object styles"
    />
    <a-auto-complete
      v-model:value="value2"
      :options="options"
      variant="filled"
      :class-names="autoCompleteClassNames"
      :styles="stylesFn"
      style="width: 200px"
      placeholder="function styles"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { AutoCompleteProps } from 'ant-design-vue';

const value1 = ref('');
const value2 = ref('');

const options: AutoCompleteProps['options'] = [
  { value: 'Burnaby' },
  { value: 'Seattle' },
  { value: 'Los Angeles' },
  { value: 'San Francisco' },
  { value: 'Meet student' },
];

const autoCompleteClassNames: AutoCompleteProps['classNames'] = {
  root: 'custom-autocomplete-root',
};

const stylesObject: AutoCompleteProps['styles'] = {
  root: {
    borderRadius: '6px',
  },
  popup: {
    root: {
      border: '1px solid #1890ff',
      backgroundColor: 'rgba(240, 240, 240, 0.85)',
    },
  },
};

const stylesFn: AutoCompleteProps['styles'] = ({ props }) => {
  if (props.variant === 'filled') {
    return {
      root: {
        borderRadius: '6px',
      },
      popup: {
        root: {
          border: '1px solid #ccc',
          backgroundColor: 'rgba(240, 240, 240, 0.85)',
        },
      },
    };
  }
  return {};
};
</script>

<style scoped>
.autocomplete-style-class-demo :deep(.custom-autocomplete-root) {
  border-radius: 4px;
}
</style>
