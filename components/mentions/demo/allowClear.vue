<docs>
---
order: 9
version: 4.3.0
title:
  zh-CN: 带移除图标
  en-US: With clear icon
---

## zh-CN

自定义清除按钮。清除按钮的 `tabIndex` 为 `-1` 时，不参与 Tab 键导航。

## en-US

Customize clear button. A clear button with `tabIndex: -1` is excluded from Tab navigation.
</docs>

<template>
  <a-flex vertical :gap="16">
    <a-mentions v-model:value="value" allow-clear />
    <a-mentions v-model:value="value" :allow-clear="customAllowClear" />
    <a-mentions v-model:value="value" allow-clear :rows="3" />
  </a-flex>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { CloseSquareFilled } from '@ant-design/icons-vue';

const value = ref('hello world');

const customAllowClear = {
  clearIcon: h(CloseSquareFilled),
};
</script>
