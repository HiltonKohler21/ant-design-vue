<docs>
---
order: 5
version: 4.3.0
title:
  zh-CN: 自定义页脚渲染函数
  en-US: Customized Footer render function
---

## zh-CN

自定义页脚渲染函数，支持在原有基础上进行扩展。

## en-US

Customize the footer rendering function to support extensions on top of the original.
</docs>

<template>
  <a-space>
    <a-button type="primary" @click="showModal">Open Modal</a-button>
    <a-button type="primary" @click="showConfirm">Open Modal Confirm</a-button>
  </a-space>
  <a-modal v-model:open="open" title="Title" @ok="handleOk" @cancel="handleCancel">
    <template #footer="{ OkBtn, CancelBtn }">
      <a-button>Custom Button</a-button>
      <component :is="CancelBtn" />
      <component :is="OkBtn" />
    </template>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-modal>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { Button, Modal } from '@hiltonkohler21/ant-design-vue';

const open = ref<boolean>(false);

const showModal = () => {
  open.value = true;
};

const handleOk = () => {
  open.value = false;
};

const handleCancel = () => {
  open.value = false;
};

const showConfirm = () => {
  Modal.confirm({
    title: 'Confirm',
    content: 'Bla bla ...',
    footer: (_, { OkBtn, CancelBtn }) => [
      h(Button, null, () => 'Custom Button'),
      h(CancelBtn),
      h(OkBtn),
    ],
  });
};
</script>
