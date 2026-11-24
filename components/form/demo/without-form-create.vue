<docs>
---
order: 30
title:
  zh-CN: 自行处理表单数据
  en-US: Handle Form Data Manually
---

## zh-CN

使用表单提供的 `validateStatus` 和 `help` 属性，不依赖内置规则校验，自行管理表单数据与提示信息。

## en-US

Manage form data and validation feedback manually via `validateStatus` and `help` without built-in rules.
</docs>

<template>
  <a-form style="max-width: 600px">
    <a-form-item
      :label-col="{ xs: { span: 24 }, sm: { span: 7 } }"
      :wrapper-col="{ xs: { span: 24 }, sm: { span: 12 } }"
      label="Prime between 8 & 12"
      :validate-status="numberState.validateStatus"
      :help="numberState.errorMsg || tips"
    >
      <a-input-number :min="8" :max="12" :value="numberState.value" @change="onNumberChange" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { ValidateStatus } from 'ant-design-vue/es/form';

const tips =
  'A prime is a natural number greater than 1 that has no positive divisors other than 1 and itself.';

const validatePrimeNumber = (
  val: number | null,
): {
  validateStatus: ValidateStatus;
  errorMsg: string | null;
} => {
  if (val === 11) {
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }
  return {
    validateStatus: 'error',
    errorMsg: 'The prime between 8 and 12 is 11!',
  };
};

const numberState = reactive<{
  value: number | null;
  validateStatus?: ValidateStatus;
  errorMsg?: string | null;
}>({
  value: 11,
});

const onNumberChange = (value: number | string | null) => {
  const num = typeof value === 'number' ? value : Number(value);
  const res = validatePrimeNumber(Number.isNaN(num) ? null : num);
  numberState.value = Number.isNaN(num) ? null : num;
  numberState.validateStatus = res.validateStatus;
  numberState.errorMsg = res.errorMsg;
};
</script>
