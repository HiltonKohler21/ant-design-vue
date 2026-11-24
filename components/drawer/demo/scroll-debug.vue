<docs>
---
order: 16
debug: true
title:
  zh-CN: 滚动锁定调试
  en-US: Scroll Lock Debug
---

## zh-CN

当 Modal 和 Drawer 共同作用时的滚动锁定调试。

## en-US

Scroll lock debug with Modal & Drawer.
</docs>

<template>
  <div :style="{ position: 'relative', zIndex: 999999 }">
    <a-space>
      <a-switch v-model:checked="drawer" checked-children="Drawer" un-checked-children="Drawer" />
      <a-switch
        v-model:checked="drawer2"
        checked-children="Drawer2"
        un-checked-children="Drawer2"
      />
      <a-switch v-model:checked="modal" checked-children="Modal" un-checked-children="Modal" />
      <a-switch v-model:checked="modal2" checked-children="Modal2" un-checked-children="Modal2" />
    </a-space>
    <a-drawer v-model:open="drawer" title="Drawer">
      Some contents...
      <a-drawer v-model:open="drawer" title="Drawer Sub">Sub contents...</a-drawer>
    </a-drawer>
    <a-drawer v-model:open="drawer2" title="Drawer2">Some contents...</a-drawer>
    <a-modal v-model:open="modal" title="Modal">Some contents...</a-modal>
    <a-modal v-model:open="modal2" title="Modal2">Some contents...</a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const drawer = ref(false);
const drawer2 = ref(false);
const modal = ref(false);
const modal2 = ref(false);
</script>
