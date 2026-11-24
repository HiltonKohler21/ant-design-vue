<docs>
---
order: 33
title:
  zh-CN: 校验与更新依赖
  en-US: Dependencies
---

## zh-CN

通过 `dependencies` 设置字段依赖，当依赖字段更新时自动触发关联校验，并演示仅在指定字段变化时更新视图快照。

## en-US

Set field dependencies via `dependencies` to automatically re-validate when upstream fields change, and update a view snapshot only when the watched field changes.
</docs>

<template>
  <a-form
    :model="formState"
    name="dependenciesDemo"
    autocomplete="off"
    style="max-width: 600px"
    layout="vertical"
  >
    <a-alert
      message="Try modify `Password2` and then modify `Password`"
      type="info"
      show-icon
      style="margin-bottom: 16px"
    />

    <a-form-item label="Password" name="password" :rules="[{ required: true }]">
      <a-input v-model:value="formState.password" />
    </a-form-item>

    <a-form-item
      label="Confirm Password"
      name="password2"
      :dependencies="['password']"
      :rules="[{ required: true }, { validator: validateConfirm }]"
    >
      <a-input v-model:value="formState.password2" />
    </a-form-item>

    <a-typography>
      <p>
        Only Update when
        <code>password2</code>
        updated:
      </p>
      <pre class="deps-pre">{{ JSON.stringify(snapshot, null, 2) }}</pre>
    </a-typography>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';

const formState = reactive({
  password: '',
  password2: '',
});

const snapshot = ref<Record<string, string>>({
  password: '',
  password2: '',
});

watch(
  () => formState.password2,
  () => {
    snapshot.value = { ...formState };
  },
);

const validateConfirm = (_: any, value: string) => {
  if (!value || formState.password === value) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('The new password that you entered do not match!'));
};
</script>

<style scoped>
.deps-pre {
  max-width: 100%;
  overflow-x: auto;
}
</style>
