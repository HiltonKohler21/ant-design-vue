<docs>
---
order: 8
version: 4.3.0
title:
  zh-CN: 格式对齐
  en-US: Mask Format
---

## zh-CN

输入格式对齐，通过键盘左右切换焦点。失去焦点时会尝试对齐到最后合法的日期。

## en-US

Align the date format. Switch the selection by arrow keys. Will try to align the date to the last valid date when blur.
</docs>

<template>
  <a-space direction="vertical">
    <a-date-picker
      :format="{
        format: 'YYYY-MM-DD',
        type: 'mask',
      }"
      @change="onChange"
    />
    <a-date-picker
      :format="{
        format: 'YYYY-MM-DD HH:mm:ss',
        type: 'mask',
      }"
      @change="onChange"
    />
  </a-space>
</template>

<script lang="ts" setup>
import type { DatePickerProps } from '@hiltonkohler21/ant-design-vue';

const onChange: DatePickerProps['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};
</script>
