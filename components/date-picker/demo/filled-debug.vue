<docs>
---
order: 25
debug: true
title:
  zh-CN: Filled Debug
  en-US: Filled Debug
---

## zh-CN

Filled Debug

## en-US

Filled Debug
</docs>

<template>
  <a-space direction="vertical" :size="12" style="width: 100%">
    <a-date-picker variant="filled" :default-value="dayjs('2015-06-06', dateFormat)" disabled />
    <a-date-picker
      variant="filled"
      picker="month"
      :default-value="dayjs('2015-06', 'YYYY-MM')"
      disabled
    />
    <a-range-picker
      variant="filled"
      :default-value="[dayjs('2015-06-06', dateFormat), dayjs('2015-06-06', dateFormat)]"
      disabled
    />
    <a-range-picker
      variant="filled"
      :default-value="[dayjs('2019-09-03', dateFormat), dayjs('2019-11-22', dateFormat)]"
      :disabled="[false, true]"
    />
    <a-date-picker
      :default-value="dayjs('2023-12-25')"
      variant="filled"
      status="error"
      :style="{ width: '100%' }"
      :preview-value="false"
    />
    <a-date-picker variant="filled" status="warning" :style="{ width: '100%' }" />
    <a-range-picker variant="filled" status="error" :style="{ width: '100%' }" />
    <a-range-picker variant="filled" status="warning" :style="{ width: '100%' }" />
  </a-space>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const dateFormat = 'YYYY-MM-DD';
</script>
