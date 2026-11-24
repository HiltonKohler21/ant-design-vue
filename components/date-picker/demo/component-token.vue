<docs>
---
order: 22
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

Component Token Debug.

## en-US

Component Token Debug.
</docs>

<template>
  <a-config-provider :theme="pickerTheme">
    <a-space direction="vertical">
      <a-date-picker :presets="presets" />
      <a-range-picker />
      <a-time-picker />
      <a-date-picker picker="month" />
    </a-space>
  </a-config-provider>

  <a-divider />

  <a-config-provider :theme="multipleTheme">
    <a-flex vertical :gap="8">
      <a-date-picker multiple size="small" />
      <a-date-picker multiple />
      <a-date-picker multiple size="large" />
    </a-flex>
  </a-config-provider>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import type { ConfigProviderProps } from 'ant-design-vue';

const presets = [
  { label: 'Yesterday', value: dayjs().add(-1, 'd') },
  { label: 'Last Week', value: dayjs().add(-7, 'd') },
  { label: 'Last Month', value: dayjs().add(-1, 'month') },
];

const pickerTheme: ConfigProviderProps['theme'] = {
  components: {
    DatePicker: {
      presetsWidth: 160,
      zIndexPopup: 888,
      cellHoverWithRangeBg: '#f0f0f0',
      cellActiveWithRangeBg: '#e6bbff',
      cellRangeBorderColor: 'green',
      timeColumnWidth: 80,
      timeColumnHeight: 250,
      timeCellHeight: 30,
      cellWidth: 64,
      cellHeight: 40,
      textHeight: 45,
      withoutTimeCellHeight: 70,
    } as Record<string, any>,
  },
};

const multipleTheme: ConfigProviderProps['theme'] = {
  components: {
    DatePicker: {
      controlHeightSM: 32,
      controlHeight: 40,
    } as Record<string, any>,
  },
};
</script>
