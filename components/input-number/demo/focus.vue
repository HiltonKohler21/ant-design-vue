<docs>
---
order: 15
version: 4.3.0
title:
  zh-CN: 聚焦
  en-US: Focus
---

## zh-CN

聚焦额外配置属性。

## en-US

Focus with additional option.
</docs>

<template>
  <a-space direction="vertical" style="width: 100%">
    <a-space wrap>
      <a-button @click="focusInput({ cursor: 'start' })">Focus at first</a-button>
      <a-button @click="focusInput({ cursor: 'end' })">Focus at last</a-button>
      <a-button @click="focusInput({ cursor: 'all' })">Focus to select all</a-button>
      <a-button @click="focusInput({ preventScroll: true })">Focus prevent scroll</a-button>
    </a-space>
    <a-input-number ref="inputRef" :default-value="999" style="width: 100%" />
  </a-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const inputRef = ref<any>(null);

const focusInput = (option: { cursor?: 'start' | 'end' | 'all'; preventScroll?: boolean }) => {
  inputRef.value?.focus(option);
};
</script>
