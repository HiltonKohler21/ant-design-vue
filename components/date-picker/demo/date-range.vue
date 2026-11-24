<docs>
---
order: 9
version: 4.3.0
title:
  zh-CN: 日期限定范围
  en-US: Limit Date Range
---

## zh-CN

通过 `minDate` 和 `maxDate` 限定日期范围。

## en-US

Limit the range of available dates by using `minDate` and `maxDate`.
</docs>

<template>
  <a-date-picker
    :default-value="dayjs('2019-09-03', dateFormat)"
    :min-date="dayjs('2019-08-01', dateFormat)"
    :max-date="dayjs('2020-10-31', dateFormat)"
  />
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const dateFormat = 'YYYY-MM-DD';
</script>
