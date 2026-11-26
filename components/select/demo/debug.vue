<docs>
---
order: 20.1
debug: true
title:
  zh-CN: Debug 专用
  en-US: For Debug
---

## zh-CN

调试使用。

## en-US

Debug Usage.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-space :style="boxStyle" wrap>
      <a-input :style="{ width: '100px' }" value="222" />
      <a-select
        :style="{ width: '120px' }"
        show-search
        placeholder="233"
        :options="options"
        @change="handleChange"
      />
      <a-select
        mode="multiple"
        :style="{ width: '120px' }"
        :default-value="['lucy']"
        show-search
        placeholder="233"
        :options="options"
        @change="handleChange"
      />
      <span class="debug-align">AntDesign</span>
      <a-button>222</a-button>
      <a-select
        :style="{ width: '120px' }"
        default-value=" "
        placeholder="Please select"
        :options="options"
      />
    </a-space>
    <div :style="{ width: '200px', maxWidth: '100%' }">
      <a-select
        mode="multiple"
        :style="{ width: '100%', margin: '0' }"
        :default-value="[1]"
        :options="longOptions"
      />
    </div>

    <a-select default-value="" :style="{ width: '120px' }" />
  </a-flex>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import type { SelectProps } from '@hiltonkohler21/ant-design-vue';

const boxStyle: CSSProperties = {
  width: '100%',
  maxWidth: '100%',
  position: 'relative',
  zIndex: 1,
  border: '1px solid red',
  backgroundColor: 'var(--ant-color-bg-container, #fff)',
  padding: '8px',
};

const options: SelectProps['options'] = [
  { value: 'jack', label: 'Jack' },
  { value: 'lucy', label: 'Lucy' },
  { value: 'disabled', disabled: true, label: 'Disabled' },
  { value: 'Yiminghe', label: 'yiminghe' },
  { value: 'long', label: 'I am super super long!' },
];

const longOptions: SelectProps['options'] = [
  {
    value: 1,
    label: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
  },
];

const handleChange = (value: any) => {
  console.log(`selected ${value}`);
};
</script>
