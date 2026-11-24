<docs>
---
order: 4
title:
  zh-CN: Modal 与 Drawer
  en-US: Modal or Drawer
---

## zh-CN

在 Modal 与 Drawer 中使用。

## en-US

Use in Modal and Drawer.
</docs>

<template>
  <a-flex gap="middle">
    <a-button type="primary" @click="showModal = true">Show in Modal</a-button>
    <a-button type="primary" @click="showDrawer = true">Show in Drawer</a-button>
    <a-button type="primary" @click="showDrawer2 = true">Not Show in Drawer</a-button>
  </a-flex>
  <a-watermark content="Ant Design">
    <a-modal
      v-model:open="showModal"
      destroy-on-hidden
      title="Modal"
      @cancel="showModal = false"
      @ok="showModal = false"
    >
      <div :style="placeholderStyle">A mock height</div>
    </a-modal>
    <a-drawer
      v-model:open="showDrawer"
      destroy-on-hidden
      title="Drawer"
      @close="showDrawer = false"
    >
      <div :style="placeholderStyle">A mock height</div>
    </a-drawer>
  </a-watermark>
  <a-watermark content="Ant Design" :inherit="false">
    <a-drawer
      v-model:open="showDrawer2"
      destroy-on-hidden
      title="Drawer"
      @close="showDrawer2 = false"
    >
      <div :style="placeholderStyle">A mock height</div>
    </a-drawer>
  </a-watermark>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { CSSProperties } from 'vue';

const showModal = ref(false);
const showDrawer = ref(false);
const showDrawer2 = ref(false);

const placeholderStyle: CSSProperties = {
  height: '300px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(150, 150, 150, 0.2)',
};
</script>
