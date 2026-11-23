<docs>
---
order: 9
title:
  zh-CN: Vue 错误处理
  en-US: Vue Error Boundary
---

## zh-CN

使用 `Alert.ErrorBoundary` 捕获子组件渲染过程中的错误并展示错误提示。

## en-US

Use `Alert.ErrorBoundary` to catch errors thrown by descendant components and display an error Alert.

</docs>

<template>
  <a-alert-error-boundary>
    <ThrowError />
  </a-alert-error-boundary>
</template>

<script lang="ts" setup>
import { defineComponent, h, ref } from 'vue';
import { Button } from 'ant-design-vue';

const ThrowError = defineComponent({
  setup() {
    const error = ref<Error | null>(null);
    const onClick = () => {
      error.value = new Error('An Uncaught Error');
    };
    return () => {
      if (error.value) {
        throw error.value;
      }
      return h(Button, { danger: true, onClick }, () => 'Click me to throw an error');
    };
  },
});
</script>
