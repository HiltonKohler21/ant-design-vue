<docs>
---
order: 7
title:
  zh-CN: 表单尺寸
  en-US: Form size
---

## zh-CN

设置表单组件尺寸，仅对 antdv 组件有效。

## en-US

Set component size, only works for antdv components.
</docs>

<template>
  <a-form
    :model="formState"
    :label-col="{ xs: { span: 24 }, sm: { span: 6 } }"
    :wrapper-col="{ xs: { span: 24 }, sm: { span: 14 } }"
    layout="horizontal"
    :size="formState.size"
    style="max-width: 600px"
  >
    <a-form-item label="Form Size" name="size">
      <a-radio-group v-model:value="formState.size">
        <a-radio-button value="small">Small</a-radio-button>
        <a-radio-button value="middle">Default</a-radio-button>
        <a-radio-button value="large">Large</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Input">
      <a-input v-model:value="formState.input" />
    </a-form-item>
    <a-form-item label="Select">
      <a-select v-model:value="formState.select" :options="[{ label: 'Demo', value: 'demo' }]" />
    </a-form-item>
    <a-form-item label="TreeSelect">
      <a-tree-select v-model:value="formState.treeSelect" :tree-data="treeData" />
    </a-form-item>
    <a-form-item label="Cascader">
      <a-cascader v-model:value="formState.cascader" :options="cascaderOptions" />
    </a-form-item>
    <a-form-item label="DatePicker">
      <a-date-picker v-model:value="formState.datePicker" />
    </a-form-item>
    <a-form-item label="InputNumber">
      <a-input-number v-model:value="formState.inputNumber" />
    </a-form-item>
    <a-form-item label="Switch">
      <a-switch v-model:checked="formState.switchVal" />
    </a-form-item>
    <a-form-item label="Button">
      <a-button>Button</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { CascaderProps, FormProps, TreeSelectProps } from 'ant-design-vue';

const formState = reactive<{
  size: FormProps['size'];
  input: string;
  select: string | undefined;
  treeSelect: string | undefined;
  cascader: string[];
  datePicker: any;
  inputNumber: number | undefined;
  switchVal: boolean;
}>({
  size: 'middle',
  input: '',
  select: undefined,
  treeSelect: undefined,
  cascader: [],
  datePicker: undefined,
  inputNumber: undefined,
  switchVal: false,
});

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
