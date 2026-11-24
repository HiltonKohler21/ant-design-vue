<docs>
---
order: 13
debug: true
title:
  zh-CN: Flex gap 样式
  en-US: Flex gap style
---

## zh-CN

Debug usage

## en-US

Debug usage

</docs>

<template>
  <div style="max-width: 100%; overflow-x: auto">
    <a-switch v-model:checked="singleCol" />
    <div style="box-shadow: 0 0 5px green; margin-top: 8px; max-width: 100%">
      <a-space
        :style="{ width: singleCol ? '307px' : '310px', maxWidth: '100%', background: 'blue' }"
        :size="[8, 8]"
        wrap
      >
        <div :style="blockStyle" />
        <div :style="blockStyle" />
        <div :style="blockStyle" />
        <div :style="blockStyle" />
      </a-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { CSSProperties } from 'vue';

const singleCol = ref(false);

const blockStyle: CSSProperties = {
  width: '150px',
  height: '100px',
  background: 'red',
};
</script>
