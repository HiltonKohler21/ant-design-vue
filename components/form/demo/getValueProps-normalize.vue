<docs>
---
order: 38
title:
  zh-CN: getValueProps + normalize
  en-US: getValueProps + normalize
---

## zh-CN

在表单数据存储时间戳字符串，渲染 `DatePicker` 时转换为 `Dayjs` 对象并在变更时标准化回时间戳格式。

## en-US

Store a timestamp string in form state, convert it to a `Dayjs` value for `DatePicker`, and normalize changes back into a timestamp string.
</docs>

<template>
  <a-form
    :model="formState"
    name="getValueProps"
    :label-col="{ xs: { span: 24 }, sm: { span: 8 } }"
    :wrapper-col="{ xs: { span: 24 }, sm: { span: 16 } }"
    style="max-width: 600px"
    autocomplete="off"
    @finish="onFinish"
  >
    <a-form-item label="Date" name="date" :rules="[{ required: true }]">
      <a-date-picker v-model:value="dateModel" />
    </a-form-item>

    <a-form-item label="Timestamp">
      <a-typography-text code>{{ formState.date || '-' }}</a-typography-text>
    </a-form-item>

    <a-form-item :label="null">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const dateTimestamp = String(dayjs('2024-01-01').valueOf());

const formState = reactive<{ date: string | undefined }>({
  date: dateTimestamp,
});

const dateModel = computed<Dayjs | undefined>({
  get: () => (formState.date ? dayjs(Number(formState.date)) : undefined),
  set: val => {
    formState.date = val ? String(dayjs(val).valueOf()) : undefined;
  },
});

const onFinish = (values: Record<string, any>) => {
  console.log('Success:', values);
};
</script>
