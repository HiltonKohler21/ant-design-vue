<docs>
---
order: 3
title:
  zh-CN: 加载中
  en-US: Loading
---

## zh-CN

设置 `loading` 属性为对话框展示骨架屏加载状态。

## en-US

Set the `loading` prop to display a skeleton loading state inside the Modal.
</docs>

<template>
  <a-button type="primary" @click="showLoading">Open Modal</a-button>
  <a-modal v-model:open="open" title="Loading Modal" :loading="loading">
    <template #footer>
      <a-button type="primary" @click="showLoading">Reload</a-button>
    </template>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-modal>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref } from 'vue';

const open = ref<boolean>(false);
const loading = ref<boolean>(true);
let timer: ReturnType<typeof setTimeout> | undefined;

const showLoading = () => {
  open.value = true;
  loading.value = true;
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    loading.value = false;
  }, 2000);
};

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer);
  }
});
</script>
