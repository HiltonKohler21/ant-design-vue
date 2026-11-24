<docs>
---
order: 7
version: '3.0'
title:
  zh-CN: 基于 Promise 的异步关闭
  en-US: Asynchronously close on Promise
---

## zh-CN

点击确定后异步关闭 Popconfirm，例如提交表单。

## en-US

Asynchronously close a popconfirm when the OK button is pressed. For example, you can use this pattern when you submit a form.

</docs>

<template>
  <a-popconfirm
    title="Title"
    description="Open Popconfirm with Promise"
    @confirm="confirm"
    @openChange="onOpenChange"
  >
    <a-button type="primary">Open Popconfirm with Promise</a-button>
  </a-popconfirm>
</template>
<script lang="ts" setup>
const confirm = () =>
  new Promise(resolve => {
    setTimeout(() => resolve(null), 3000);
  });

const onOpenChange = () => {
  console.log('open change');
};
</script>
