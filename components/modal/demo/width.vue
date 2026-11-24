<docs>
---
order: 13
title:
  zh-CN: 自定义模态的宽度
  en-US: To customize the width of modal
---

## zh-CN

使用 `width` 来设置模态对话框的宽度。

## en-US

Use `width` to set the width of the modal dialog.
</docs>

<template>
  <a-flex vertical gap="middle" align="flex-start">
    <a-button type="primary" @click="open = true">Open Modal of 1000px width</a-button>
    <a-modal
      v-model:open="open"
      title="Modal 1000px width"
      centered
      :width="1000"
      @ok="open = false"
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </a-modal>

    <a-button type="primary" @click="openResponsive = true">
      Open Modal of responsive width
    </a-button>
    <a-modal
      v-model:open="openResponsive"
      title="Modal responsive width"
      centered
      :width="{
        xs: '90%',
        sm: '80%',
        md: '70%',
        lg: '60%',
        xl: '50%',
        xxl: '40%',
      }"
      @ok="openResponsive = false"
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </a-modal>
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const open = ref<boolean>(false);
const openResponsive = ref<boolean>(false);
</script>
