<docs>
---
order: 17
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
      <a-switch v-model:checked="isInput" checked-children="Input" un-checked-children="TextArea" />
    </a-space>
    <a-input v-if="isInput" ref="inputRef" v-model:value="value" style="width: 100%" />
    <a-textarea v-else ref="inputRef" v-model:value="value" style="width: 100%" />
  </a-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const inputRef = ref<any>(null);
const isInput = ref(true);
const value = ref('Ant Design love you!');

const focusInput = (option: { cursor?: 'start' | 'end' | 'all'; preventScroll?: boolean }) => {
  inputRef.value?.focus(option);
};
</script>
