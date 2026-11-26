<docs>
---
order: 13
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Cascader 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Cascader by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex vertical gap="middle" class="cascader-style-class-demo">
    <a-cascader
      v-model:value="value1"
      :options="options"
      placeholder="Object styles"
      :class-names="cascaderClassNames"
      :styles="stylesObject"
      prefix="🏠"
      @change="onChange"
    />
    <a-cascader
      v-model:value="value2"
      :options="options"
      placeholder="Function styles"
      variant="filled"
      :class-names="cascaderClassNames"
      :styles="stylesFn"
      prefix="✅"
      @change="onChange"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { CascaderProps } from '@hiltonkohler21/ant-design-vue';

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

const value1 = ref<string[]>([]);
const value2 = ref<string[]>([]);

const options: Option[] = [
  {
    value: 'meet-student',
    label: 'meet-student',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const cascaderClassNames: CascaderProps['classNames'] = {
  root: 'custom-cascader-root',
};

const stylesObject: CascaderProps['styles'] = {
  prefix: {
    color: '#ccc',
  },
  suffix: {
    color: '#ccc',
  },
};

const stylesFn: CascaderProps['styles'] = info => {
  if (info.props.variant === 'filled') {
    return {
      prefix: {
        color: '#1890ff',
      },
      suffix: {
        color: '#1890ff',
      },
      popup: {
        root: {
          border: '1px solid #1890ff',
        },
      },
    };
  }
  return {};
};

const onChange: CascaderProps['onChange'] = value => {
  console.log(value);
};
</script>

<style scoped>
.cascader-style-class-demo :deep(.custom-cascader-root) {
  border-radius: var(--ant-border-radius-lg, 8px);
}
</style>
