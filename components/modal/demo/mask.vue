<docs>
---
order: 3
title:
  zh-CN: 遮罩
  en-US: mask
---

## zh-CN

遮罩效果。

## en-US

mask effect.
</docs>

<template>
  <a-space>
    <a-button @click="showBlur">blur</a-button>
    <a-button @click="showDimmed">Dimmed mask</a-button>
    <a-button @click="showNoMask">No mask</a-button>
  </a-space>
  <contextHolder />
</template>

<script lang="ts" setup>
import { Modal } from '@hiltonkohler21/ant-design-vue';

const modalConfig = {
  title: 'Title',
  content: 'Some contents...',
};

const [modal, contextHolder] = Modal.useModal();

const showBlur = () => {
  modal.confirm({ ...modalConfig, mask: { blur: true } });
};

const showDimmed = () => {
  modal.confirm(modalConfig);
};

const showNoMask = () => {
  modal.confirm({ ...modalConfig, mask: false });
};
</script>
