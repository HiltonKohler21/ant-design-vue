<docs>
---
order: 25
title:
  zh-CN: 多选
  en-US: Multiple
---

## zh-CN

通过 `multiple` 支持多选日期，并可配合 `maxTagCount` 控制最大展示标签数量。

## en-US

Multiple selection with `multiple`, supporting `maxTagCount` to control visible tags.

</docs>

<template>
  <a-flex vertical gap="small">
    <a-date-picker
      v-model:value="value1"
      multiple
      max-tag-count="responsive"
      size="small"
      @change="onChange"
    />
    <a-date-picker v-model:value="value2" multiple max-tag-count="responsive" @change="onChange" />
    <a-date-picker
      v-model:value="value3"
      multiple
      :max-tag-count="2"
      size="large"
      @change="onChange"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const defaultDates = () => [dayjs('2024-01-01'), dayjs('2024-01-03'), dayjs('2024-01-05')];
const value1 = ref<Dayjs[]>(defaultDates());
const value2 = ref<Dayjs[]>(defaultDates());
const value3 = ref<Dayjs[]>(defaultDates());

const onChange = (dates: Dayjs[], dateStrings: string[]) => {
  console.log(dates, dateStrings);
};
</script>
