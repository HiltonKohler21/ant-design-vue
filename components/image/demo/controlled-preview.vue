<docs>
---
order: 4
title:
  zh-CN: 受控的预览
  en-US: Controlled Preview
---

## zh-CN

可以使用 `open` 与 `onOpenChange` 使预览受控（同时兼容旧版 `visible` / `onVisibleChange`）。

## en-US

You can make preview controlled via `open` and `onOpenChange` (backwards-compatible with `visible` / `onVisibleChange`).

</docs>

<template>
  <div>
    <a-button type="primary" @click="() => setOpen(true)">show image preview</a-button>
    <a-image
      :width="200"
      :style="{ display: 'none' }"
      :preview="{
        open,
        onOpenChange: setOpen,
      }"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const open = ref<boolean>(false);
const setOpen = (value: boolean): void => {
  open.value = value;
};
</script>
