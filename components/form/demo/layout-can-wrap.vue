<docs>
---
order: 8
title:
  zh-CN: 表单标签可换行
  en-US: label can wrap
---

## zh-CN

通过 `labelWrap` 可以开启超长 `label` 文本自动换行，并支持 `labelAlign="start"` 左对齐。

## en-US

Turn on `labelWrap` to wrap long `label` text automatically, paired with `labelAlign="start"`.
</docs>

<template>
  <a-form
    :model="formState"
    name="wrap"
    :label-col="{ flex: '110px' }"
    label-align="start"
    label-wrap
    :wrapper-col="{ flex: 1 }"
    :colon="false"
    style="max-width: 600px"
  >
    <a-form-item label="Normal label" name="username" :rules="[{ required: true }]">
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item label="A super long label text" name="password" :rules="[{ required: true }]">
      <a-input v-model:value="formState.password" />
    </a-form-item>

    <a-form-item label="A super long label text" name="password1">
      <a-input v-model:value="formState.password1" />
    </a-form-item>

    <a-form-item label=" ">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const formState = reactive({
  username: '',
  password: '',
  password1: '',
});
</script>
