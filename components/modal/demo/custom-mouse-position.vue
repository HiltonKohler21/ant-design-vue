<docs>
---
order: 20
debug: true
title:
  zh-CN: 控制弹框动画原点
  en-US: Control modal's animation origin position
---

## zh-CN

通过 `mousePosition` 控制弹框动画原点。

## en-US

Pass `mousePosition` to control modal's animation origin position.
</docs>

<template>
  <a-button type="primary" @click="showModal">Open Modal</a-button>
  <a-modal
    v-model:open="isModalOpen"
    title="Basic Modal"
    :mouse-position="{ x: 300, y: 300 }"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const isModalOpen = ref<boolean>(false);

const showModal = () => {
  isModalOpen.value = true;
};

const handleOk = () => {
  isModalOpen.value = false;
};

const handleCancel = () => {
  isModalOpen.value = false;
};
</script>
