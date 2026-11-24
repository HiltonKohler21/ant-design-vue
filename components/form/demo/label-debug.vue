<docs>
---
order: 41
debug: true
title:
  zh-CN: 测试 label 省略
  en-US: label ellipsis
---

## zh-CN

测试超长 `label` 配合 `Typography.Text` 的省略展示。

## en-US

Debug long `label` text with `Typography.Text` ellipsis truncation.
</docs>

<template>
  <a-form
    :model="formState"
    name="label-ellipsis"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    style="max-width: 600px"
  >
    <a-form-item name="username">
      <template #label>
        <a-typography-text
          ellipsis
          content="longtextlongtextlongtextlongtextlongtextlongtextlongtext"
        />
      </template>
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item name="password">
      <template #label>
        <a-typography-text
          ellipsis
          content="longtext longtext longtext longtext longtext longtext longtext"
        />
      </template>
      <a-input-password v-model:value="formState.password" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const formState = reactive({
  username: '',
  password: '',
});
</script>
