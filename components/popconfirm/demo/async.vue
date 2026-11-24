<docs>
---
order: 6
title:
  zh-CN: 异步关闭
  en-US: Asynchronously close
---

## zh-CN

点击确定后异步关闭气泡确认框，例如提交表单。

## en-US

Asynchronously close a popconfirm when the OK button is pressed. For example, you can use this pattern when you submit a form.

</docs>

<template>
  <a-popconfirm
    title="Title"
    description="Open Popconfirm with async logic"
    :open="open"
    :ok-button-props="{ loading: confirmLoading }"
    @confirm="handleOk"
    @cancel="handleCancel"
  >
    <a-button type="primary" @click="showPopconfirm">Open Popconfirm with async logic</a-button>
  </a-popconfirm>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const open = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);

const showPopconfirm = () => {
  open.value = true;
};

const handleOk = () => {
  confirmLoading.value = true;

  setTimeout(() => {
    open.value = false;
    confirmLoading.value = false;
  }, 2000);
};

const handleCancel = () => {
  console.log('Clicked cancel button');
  open.value = false;
};
</script>
