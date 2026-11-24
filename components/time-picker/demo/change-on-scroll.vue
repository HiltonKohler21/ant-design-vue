<docs>
---
order: 9
version: 4.3.0
title:
  zh-CN: 滚动即改变
  en-US: Change on scroll
---

## zh-CN

通过 `changeOnScroll` 与 `needConfirm` 使其滚动时改变数值。

## en-US

Use `changeOnScroll` and `needConfirm` to change the value when scrolling.
</docs>

<template>
  <a-time-picker change-on-scroll :need-confirm="false" @change="onChange" />
</template>

<script lang="ts" setup>
import type { Dayjs } from 'dayjs';

const onChange = (time: Dayjs | string | null, timeString: string) => {
  console.log(time, timeString);
};
</script>
