<docs>
---
order: 6
title:
  zh-CN: 从浮层内关闭
  en-US: Controlling the close of the dialog
---

## zh-CN

使用 `open` 属性控制浮层显示。

## en-US

Use `open` prop to control the display of the card.

</docs>
<template>
  <a-popover v-model:open="open" title="Title" trigger="click">
    <template #content>
      <a @click="hide">Close</a>
    </template>
    <a-button type="primary">Click me</a-button>
  </a-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const open = ref<boolean>(false);

const hide = () => {
  open.value = false;
};
</script>
