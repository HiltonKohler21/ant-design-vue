<docs>
---
order: 10
title:
  zh-CN: 字段监听
  en-US: Watch Fields
---

## zh-CN

在 Vue 中可以通过 `watch` / `computed` 直接精准监听响应式表单对象中的指定字段，未监听的字段变更不会触发副作用。

## en-US

In Vue, use `watch` / `computed` to reactively observe specific fields on the form model without reacting to unwatched fields.
</docs>

<template>
  <a-form :model="formState" layout="vertical" autocomplete="off" style="max-width: 600px">
    <a-form-item name="name" label="Name (Watch to update)">
      <a-input v-model:value="formState.name" />
    </a-form-item>
    <a-form-item name="age" label="Age (Not Watch)">
      <a-input-number v-model:value="formState.age" />
    </a-form-item>
  </a-form>

  <a-typography style="max-width: 600px">
    <pre class="watch-pre">Name Value: {{ nameValue }}</pre>
    <pre class="watch-pre">Custom Value: {{ customValue }}</pre>
  </a-typography>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';

interface FormState {
  name: string;
  age: number | undefined;
}

const formState = reactive<FormState>({
  name: '',
  age: undefined,
});

const nameValue = ref<string>('');
const customValue = ref<string>('name: ');

watch(
  () => formState.name,
  val => {
    nameValue.value = val;
    customValue.value = `name: ${val || ''}`;
  },
);
</script>

<style scoped>
.watch-pre {
  max-width: 100%;
  overflow-x: auto;
}
</style>
