<docs>
---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

最简单的用法，支持确认标题和描述。

## en-US

The basic example supports the title and description props of confirmation.

</docs>

<template>
  <a-popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    ok-text="Yes"
    cancel-text="No"
    @confirm="confirm"
    @cancel="cancel"
  >
    <a-button danger>Delete</a-button>
  </a-popconfirm>
</template>
<script lang="ts" setup>
import { message } from 'ant-design-vue';

const confirm = (e: MouseEvent) => {
  console.log(e);
  message.success('Click on Yes');
};

const cancel = (e: MouseEvent) => {
  console.log(e);
  message.error('Click on No');
};
</script>
