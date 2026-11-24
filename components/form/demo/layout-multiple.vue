<docs>
---
order: 3
title:
  zh-CN: 表单混合布局
  en-US: Form mix layout
---

## zh-CN

`Form` 与 `Form.Item` 均可独立设置 `layout` 属性，支持水平与垂直布局混合排布。

## en-US

Both `Form` and `Form.Item` can configure `layout` independently, enabling mixed horizontal and vertical layouts.
</docs>

<template>
  <a-form
    :model="horizontalFormState"
    name="layout-multiple-horizontal"
    layout="horizontal"
    style="max-width: 600px"
  >
    <a-form-item
      label="horizontal"
      name="horizontal"
      :rules="[{ required: true }]"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-input v-model:value="horizontalFormState.horizontal" />
    </a-form-item>
    <a-form-item layout="vertical" label="vertical" name="vertical" :rules="[{ required: true }]">
      <a-input v-model:value="horizontalFormState.vertical" />
    </a-form-item>
    <a-form-item layout="vertical" label="vertical2" name="vertical2" :rules="[{ required: true }]">
      <a-input v-model:value="horizontalFormState.vertical2" />
    </a-form-item>
  </a-form>

  <a-divider />

  <a-form
    :model="verticalFormState"
    name="layout-multiple-vertical"
    layout="vertical"
    style="max-width: 600px"
  >
    <a-form-item label="vertical" name="vertical" :rules="[{ required: true }]">
      <a-input v-model:value="verticalFormState.vertical" />
    </a-form-item>
    <a-form-item label="vertical2" name="vertical2" :rules="[{ required: true }]">
      <a-input v-model:value="verticalFormState.vertical2" />
    </a-form-item>
    <a-form-item
      layout="horizontal"
      label="horizontal"
      name="horizontal"
      :rules="[{ required: true }]"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-input v-model:value="verticalFormState.horizontal" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const horizontalFormState = reactive({
  horizontal: '',
  vertical: '',
  vertical2: '',
});

const verticalFormState = reactive({
  vertical: '',
  vertical2: '',
  horizontal: '',
});
</script>
