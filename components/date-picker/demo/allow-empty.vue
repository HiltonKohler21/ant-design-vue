<docs>
---
order: 12
title:
  zh-CN: 允许留空
  en-US: Allow Empty
---

## zh-CN

在范围选择时，可以允许留空。这对于需要保留“至今”日期项颇为有用。

## en-US

Allow empty for the RangePicker. It's useful when you need to keep the "to date".
</docs>

<template>
  <a-range-picker
    :placeholder="['Start Date', 'Till Now']"
    :allow-empty="[false, true]"
    @change="onChange"
  />
</template>

<script lang="ts" setup>
import type { Dayjs } from 'dayjs';

const onChange = (date: [Dayjs, Dayjs] | null, dateString: [string, string]) => {
  console.log(date, dateString);
};
</script>
