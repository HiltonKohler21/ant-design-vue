<docs>
---
order: 8
title:
  zh-CN: 静态方法（不推荐）
  en-US: Static method (deprecated)
---

## zh-CN

信息提醒反馈。

## en-US

Normal message for information.

</docs>

<template>
  <a-button type="primary" @click="info">Display normal message</a-button>
</template>
<script lang="ts" setup>
import { message } from '@hiltonkohler21/ant-design-vue';
const info = () => {
  message.info('This is a normal message');
};
</script>
