<docs>
---
order: 11
title:
  zh-CN: 校验时机
  en-US: Validate Trigger
---

## zh-CN

通过 `validateTrigger`、`validateDebounce`、`validateFirst` 灵活控制字段的校验触发时机与防抖策略。

## en-US

Control validation timing and debouncing with `validateTrigger`, `validateDebounce`, and `validateFirst`.
</docs>

<template>
  <a-form
    :model="formState"
    name="trigger"
    style="max-width: 600px"
    layout="vertical"
    autocomplete="off"
  >
    <a-alert
      message="Use 'max' rule, continue typing chars to see it"
      type="info"
      style="margin-bottom: 16px"
    />

    <a-form-item
      has-feedback
      label="Field A"
      name="field_a"
      validate-trigger="blur"
      :rules="[{ max: 3 }]"
    >
      <a-input v-model:value="formState.field_a" placeholder="Validate required onBlur" />
    </a-form-item>

    <a-form-item
      has-feedback
      label="Field B"
      name="field_b"
      :validate-debounce="1000"
      :rules="[{ max: 3 }]"
    >
      <a-input
        v-model:value="formState.field_b"
        placeholder="Validate required debounce after 1s"
      />
    </a-form-item>

    <a-form-item
      has-feedback
      label="Field C"
      name="field_c"
      validate-first
      :rules="[{ max: 6 }, { max: 3, message: 'Continue input to exceed 6 chars' }]"
    >
      <a-input v-model:value="formState.field_c" placeholder="Validate one by one" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const formState = reactive({
  field_a: '',
  field_b: '',
  field_c: '',
});
</script>
