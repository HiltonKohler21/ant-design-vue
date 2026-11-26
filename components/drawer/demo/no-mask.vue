<docs>
---
order: 14
debug: true
title:
  zh-CN: 无遮罩
  en-US: No Mask
---

## zh-CN

通过 `:mask="false"` 去掉遮罩。

## en-US

Remove mask.
</docs>

<template>
  <a-button type="primary" @click="open = true">Open</a-button>
  <a-drawer
    v-model:open="open"
    title="Drawer without mask"
    placement="right"
    :mask="false"
    :styles="drawerStyles"
    @close="open = false"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { DrawerProps } from '@hiltonkohler21/ant-design-vue';

const open = ref(false);

const drawerStyles: DrawerProps['styles'] = {
  mask: {
    width: '333px',
    background: 'red',
    borderRadius: '20px',
    boxShadow: '-5px 0 5px green',
    overflow: 'hidden',
  },
};
</script>
