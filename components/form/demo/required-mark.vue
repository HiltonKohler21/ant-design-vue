<docs>
---
order: 6
title:
  zh-CN: 必选样式
  en-US: Required style
---

## zh-CN

通过 `requiredMark` 切换必选、可选、隐藏或自定义渲染函数样式。

## en-US

Switch required, optional, hidden, or custom render function mark style via `requiredMark`.
</docs>

<template>
  <a-form
    :model="formState"
    layout="vertical"
    :required-mark="mergedRequiredMark"
    style="max-width: 600px"
  >
    <a-form-item label="Required Mark" name="requiredMarkValue">
      <a-radio-group v-model:value="formState.requiredMarkValue">
        <a-radio-button :value="true">Default</a-radio-button>
        <a-radio-button value="optional">Optional</a-radio-button>
        <a-radio-button :value="false">Hidden</a-radio-button>
        <a-radio-button value="customize">Customize</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Field A" required tooltip="This is a required field">
      <a-input v-model:value="formState.fieldA" placeholder="input placeholder" />
    </a-form-item>
    <a-form-item
      label="Field B"
      :tooltip="{ title: 'Tooltip with customize icon', icon: InfoCircleOutlined }"
    >
      <a-input v-model:value="formState.fieldB" placeholder="input placeholder" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary">Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { computed, h, reactive } from 'vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { Tag } from 'ant-design-vue';
import type { FormProps } from 'ant-design-vue';

type RequiredMarkMode = boolean | 'optional' | 'customize';

const formState = reactive<{
  requiredMarkValue: RequiredMarkMode;
  fieldA: string;
  fieldB: string;
}>({
  requiredMarkValue: 'optional',
  fieldA: '',
  fieldB: '',
});

const customizeRequiredMark: FormProps['requiredMark'] = (label, { required }) => [
  required
    ? h(Tag, { color: 'error' }, () => 'Required')
    : h(Tag, { color: 'warning' }, () => 'optional'),
  label,
];

const mergedRequiredMark = computed<FormProps['requiredMark']>(() =>
  formState.requiredMarkValue === 'customize' ? customizeRequiredMark : formState.requiredMarkValue,
);
</script>
