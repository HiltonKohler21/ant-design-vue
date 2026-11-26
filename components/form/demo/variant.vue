<docs>
---
order: 3
version: 4.3.0
title:
  zh-CN: 表单变体
  en-US: Form variants
---

## zh-CN

通过 `variant` 属性统一设置表单内数据录入类组件的形态变体，支持 `outlined`、`filled`、`borderless`、`underlined` 四种风格。

## en-US

Use `variant` to configure the visual variant of form controls inside `Form`, supporting `outlined`, `filled`, `borderless`, and `underlined`.
</docs>

<template>
  <a-form
    :model="formState"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :variant="formState.variant"
    style="max-width: 600px"
  >
    <a-form-item label="Form variant" name="variant">
      <a-segmented
        v-model:value="formState.variant"
        :options="['outlined', 'filled', 'borderless', 'underlined']"
      />
    </a-form-item>

    <a-form-item label="Input" name="input" :rules="[{ required: true, message: 'Please input!' }]">
      <a-input v-model:value="formState.input" />
    </a-form-item>

    <a-form-item
      label="InputNumber"
      name="inputNumber"
      :rules="[{ required: true, message: 'Please input!' }]"
    >
      <a-input-number v-model:value="formState.inputNumber" style="width: 100%" />
    </a-form-item>

    <a-form-item
      label="TextArea"
      name="textArea"
      :rules="[{ required: true, message: 'Please input!' }]"
    >
      <a-textarea v-model:value="formState.textArea" />
    </a-form-item>

    <a-form-item
      label="Mentions"
      name="mentions"
      :rules="[{ required: true, message: 'Please input!' }]"
    >
      <a-mentions v-model:value="formState.mentions" :options="mentionOptions" />
    </a-form-item>

    <a-form-item
      label="Select"
      name="select"
      :rules="[{ required: true, message: 'Please select!' }]"
    >
      <a-select v-model:value="formState.select" :options="selectOptions" />
    </a-form-item>

    <a-form-item
      label="Cascader"
      name="cascader"
      :rules="[{ required: true, message: 'Please select!' }]"
    >
      <a-cascader v-model:value="formState.cascader" :options="cascaderOptions" />
    </a-form-item>

    <a-form-item
      label="TreeSelect"
      name="treeSelect"
      :rules="[{ required: true, message: 'Please select!' }]"
    >
      <a-tree-select v-model:value="formState.treeSelect" :tree-data="treeData" />
    </a-form-item>

    <a-form-item
      label="DatePicker"
      name="datePicker"
      :rules="[{ required: true, message: 'Please pick!' }]"
    >
      <a-date-picker v-model:value="formState.datePicker" />
    </a-form-item>

    <a-form-item
      label="RangePicker"
      name="rangePicker"
      :rules="[{ required: true, message: 'Please pick!' }]"
    >
      <a-range-picker v-model:value="formState.rangePicker" />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 6, span: 14 }">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import type { FormProps, TreeSelectProps, CascaderProps } from '@hiltonkohler21/ant-design-vue';

const labelCol = { xs: { span: 24 }, sm: { span: 6 } };
const wrapperCol = { xs: { span: 24 }, sm: { span: 14 } };

const formState = reactive<{
  variant: FormProps['variant'];
  input: string;
  inputNumber: number | undefined;
  textArea: string;
  mentions: string;
  select: string | undefined;
  cascader: string[];
  treeSelect: string | undefined;
  datePicker: any;
  rangePicker: any;
}>({
  variant: 'filled',
  input: '',
  inputNumber: undefined,
  textArea: '',
  mentions: '',
  select: undefined,
  cascader: [],
  treeSelect: undefined,
  datePicker: undefined,
  rangePicker: undefined,
});

const mentionOptions = [
  { value: 'afc163', label: 'afc163' },
  { value: 'zombieJ', label: 'zombieJ' },
];

const selectOptions = [
  { value: 'demo', label: 'Demo' },
  { value: 'example', label: 'Example' },
];

const treeData: TreeSelectProps['treeData'] = [
  { title: 'Light', value: 'light', children: [{ title: 'Bamboo', value: 'bamboo' }] },
];

const cascaderOptions: CascaderProps['options'] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{ value: 'hangzhou', label: 'Hangzhou' }],
  },
];
</script>
