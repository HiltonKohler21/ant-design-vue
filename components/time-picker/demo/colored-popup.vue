<docs>
---
order: 10
debug: true
title:
  zh-CN: 彩色弹出层
  en-US: Colored Popup
---

## zh-CN

将自定义 class 传给 `TimePicker` 弹框。

## en-US

Passing custom class to `TimePicker` popup.
</docs>

<template>
  <a-time-picker
    :default-open-value="dayjs('00:00:00', 'HH:mm:ss')"
    :class-names="{ popup: { root: 'myCustomClassName' } }"
    @change="onChange"
  />
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const onChange = (time: Dayjs | string | null, timeString: string) => {
  console.log(time, timeString);
};
</script>

<style>
.myCustomClassName .ant-picker-panel-container {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
}
</style>
