<docs>
---
order: 13.2
debug: true
title:
  zh-CN: 清除后缀
  en-US: Clear suffix
---

## zh-CN

展示 `allowClear` 隐藏后缀内容时的边界场景。

## en-US

Show edge cases when `allowClear` hides suffix content.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-flex vertical gap="small">
      <span>Interactive suffix</span>
      <a-select allow-clear default-value="long" :options="options" :style="selectStyle">
        <template #suffix>
          <button type="button" :style="buttonStyle" @mousedown.stop @click="onSuffixClick">
            Suffix
          </button>
        </template>
      </a-select>
    </a-flex>

    <a-flex vertical gap="small">
      <span>No suffix</span>
      <a-select
        allow-clear
        default-value="long"
        :suffix="null"
        :options="options"
        :style="selectStyle"
      />
    </a-flex>
  </a-flex>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import type { SelectProps } from 'ant-design-vue';

const longLabel = 'A very very very very very very very long selected label';

const options: SelectProps['options'] = [
  { value: 'long', label: longLabel },
  { value: 'short', label: 'Short option' },
];

const selectStyle: CSSProperties = {
  width: '280px',
  maxWidth: '100%',
};

const buttonStyle: CSSProperties = {
  border: '1px solid var(--ant-color-border, #d9d9d9)',
  borderRadius: '4px',
  padding: '0 8px',
  color: 'var(--ant-color-text, rgba(0, 0, 0, 0.88))',
  background: 'var(--ant-color-bg-container, #fff)',
  cursor: 'pointer',
  pointerEvents: 'auto',
};

const onSuffixClick = () => {
  console.log('suffix clicked');
};
</script>
