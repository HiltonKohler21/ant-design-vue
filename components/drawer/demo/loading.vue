<docs>
---
order: 3
title:
  zh-CN: 加载中
  en-US: Loading
---

## zh-CN

设置 `loading` 属性为抽屉展示骨架屏加载状态。

## en-US

Set the `loading` prop to display a skeleton loading state inside the Drawer.
</docs>

<template>
  <a-button type="primary" @click="showLoading">Open Drawer</a-button>
  <a-drawer
    v-model:open="open"
    closable
    destroy-on-hidden
    title="Loading Drawer"
    placement="right"
    :loading="loading"
  >
    <a-button type="primary" style="margin-bottom: 16px" @click="showLoading">Reload</a-button>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref } from 'vue';

const open = ref(false);
const loading = ref(true);
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
