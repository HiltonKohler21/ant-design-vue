<docs>
---
order: 1
title:
  zh-CN: 表单方法调用
  en-US: Form methods
---

## zh-CN

通过 `ref` 获取表单实例对表单数据域进行交互。

## en-US

Call form method via `ref` to interact with form data.
</docs>

<template>
  <a-form
    ref="formRef"
    :model="formState"
    name="control-hooks"
    :label-col="layout.labelCol"
    :wrapper-col="layout.wrapperCol"
    style="max-width: 600px"
    @finish="onFinish"
  >
    <a-form-item name="note" label="Note" :rules="[{ required: true }]">
      <a-input v-model:value="formState.note" />
    </a-form-item>
    <a-form-item name="gender" label="Gender" :rules="[{ required: true }]">
      <a-select
        v-model:value="formState.gender"
        allow-clear
        placeholder="Select an option and change input text above"
        :options="genderOptions"
        @change="onGenderChange"
      />
    </a-form-item>
    <a-form-item
      v-if="formState.gender === 'other'"
      name="customizeGender"
      label="Customize Gender"
      :rules="[{ required: true }]"
    >
      <a-input v-model:value="formState.customizeGender" />
    </a-form-item>
    <a-form-item :wrapper-col="tailLayout.wrapperCol">
      <a-space wrap>
        <a-button type="primary" html-type="submit">Submit</a-button>
        <a-button html-type="button" @click="onReset">Reset</a-button>
        <a-button type="link" html-type="button" @click="onFill">Fill form</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormInstance } from '@hiltonkohler21/ant-design-vue';

interface FormState {
  note: string;
  gender: string | undefined;
  customizeGender: string;
}

const formRef = ref<FormInstance>();

const formState = reactive<FormState>({
  note: '',
  gender: undefined,
  customizeGender: '',
});

const layout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
};

const tailLayout = {
  wrapperCol: { xs: { offset: 0, span: 24 }, sm: { offset: 8, span: 16 } },
};

const genderOptions = [
  { label: 'male', value: 'male' },
  { label: 'female', value: 'female' },
  { label: 'other', value: 'other' },
];

const onGenderChange = (value: string) => {
  switch (value) {
    case 'male':
      formState.note = 'Hi, man!';
      break;
    case 'female':
      formState.note = 'Hi, lady!';
      break;
    case 'other':
      formState.note = 'Hi there!';
      break;
    default:
  }
};

const onFinish = (values: any) => {
  console.log(values);
};

const onReset = () => {
  formRef.value?.resetFields();
};

const onFill = () => {
  formState.note = 'Hello world!';
  formState.gender = 'male';
};
</script>
