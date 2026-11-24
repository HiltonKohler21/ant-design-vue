<docs>
---
order: 12
title:
  zh-CN: 仅校验
  en-US: Validate Only
---

## zh-CN

通过 `validateFields({ validateOnly: true })` 可以在不展示校验错误信息的前提下静默检查表单是否可提交。

## en-US

Use `validateFields({ validateOnly: true })` to silently validate form values without displaying error messages on the UI.
</docs>

<template>
  <a-form
    ref="formRef"
    :model="formState"
    name="validateOnly"
    layout="vertical"
    autocomplete="off"
    style="max-width: 600px"
  >
    <a-form-item name="name" label="Name" :rules="[{ required: true }]">
      <a-input v-model:value="formState.name" />
    </a-form-item>
    <a-form-item name="age" label="Age" :rules="[{ required: true }]">
      <a-input v-model:value="formState.age" />
    </a-form-item>
    <a-form-item>
      <a-space wrap>
        <a-button type="primary" html-type="submit" :disabled="!submittable">Submit</a-button>
        <a-button html-type="button" @click="onReset">Reset</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import type { FormInstance } from 'ant-design-vue';

const formRef = ref<FormInstance>();
const submittable = ref(false);

const formState = reactive({
  name: '',
  age: '',
});

const checkSubmittable = () => {
  formRef.value
    ?.validateFields({ validateOnly: true })
    .then(() => {
      submittable.value = true;
    })
    .catch(() => {
      submittable.value = false;
    });
};

watch(formState, checkSubmittable, { deep: true });

onMounted(() => {
  checkSubmittable();
});

const onReset = () => {
  formRef.value?.resetFields();
};
</script>
