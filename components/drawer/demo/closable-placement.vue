<docs>
---
order: 11
version: 4.3.0
title:
  zh-CN: 关闭按钮位置
  en-US: Closable Placement
---

## zh-CN

自定义抽屉的关闭按钮位置，放到右侧，默认为左侧。

## en-US

Drawer with closable placement, customize the close placement to the `end`, defaults to `start`.
</docs>

<template>
  <a-button type="primary" @click="showDrawer">Open</a-button>
  <a-drawer
    v-model:open="open"
    title="Drawer Closable Placement"
    :closable="{ placement: 'end' }"
    @close="onClose"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Take a look at the top-right corner...</p>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const open = ref(false);

const showDrawer = () => {
  open.value = true;
};

const onClose = () => {
  open.value = false;
};
</script>
