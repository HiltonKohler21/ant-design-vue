<docs>
---
order: 12
title:
  zh-CN: 前后缀
  en-US: Prefix and Suffix
---

## zh-CN

点击 TimePicker，然后可以在浮层中选择或者输入某一时间。

## en-US

Click `TimePicker`, and then we could select or input a time in panel.

</docs>

<template>
  <a-time-picker v-model:value="value" :default-value="dayjs('00:00:00', 'HH:mm:ss')">
    <template #suffixIcon><smile-outlined /></template>
  </a-time-picker>
</template>
<script lang="ts" setup>
import dayjs, { Dayjs } from 'dayjs';
import { SmileOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
const value = ref<Dayjs>();
</script>
