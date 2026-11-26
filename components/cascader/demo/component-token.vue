<docs>
---
order: 15
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

组件 Token

## en-US

Component Token
</docs>

<template>
  <a-config-provider :theme="themeConfig">
    <a-cascader
      v-model:value="value"
      :options="options"
      placeholder="Please select"
      @change="onChange"
    />
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { CascaderProps, ConfigProviderProps } from '@hiltonkohler21/ant-design-vue';

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

const value = ref<string[]>([]);

const options: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
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

const onChange: CascaderProps['onChange'] = val => {
  console.log(val);
};

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    Cascader: {
      optionSelectedColor: 'red',
    } as Record<string, any>,
  },
};
</script>
