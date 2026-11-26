<docs>
---
order: 20
version: 4.3.0
title:
  zh-CN: 佛历格式
  en-US: Buddhist Era
---

## zh-CN

通过 `locale` 配置支持特殊的年历格式。

## en-US

Use `locale` to support special calendar format.
</docs>

<template>
  <a-space direction="vertical">
    <a-typography-title :level="4">By locale props</a-typography-title>
    <a-date-picker :default-value="defaultValue" :locale="buddhistLocale" @change="onChange" />
    <a-date-picker
      :default-value="defaultValue"
      show-time
      :locale="buddhistLocale"
      @change="onChange"
    />

    <a-typography-title :level="4">By ConfigProvider</a-typography-title>
    <a-config-provider :locale="globalBuddhistLocale">
      <a-space direction="vertical">
        <a-date-picker :default-value="defaultValue" @change="onChange" />
        <a-date-picker :default-value="defaultValue" show-time @change="onChange" />
      </a-space>
    </a-config-provider>
  </a-space>
</template>

<script lang="ts" setup>
import type { DatePickerProps } from '@hiltonkohler21/ant-design-vue';
import en from '@hiltonkohler21/ant-design-vue/es/date-picker/locale/en_US';
import enUS from '@hiltonkohler21/ant-design-vue/es/locale/en_US';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.extend(buddhistEra);

const buddhistLocale: any = {
  ...en,
  lang: {
    ...en.lang,
    fieldDateFormat: 'BBBB-MM-DD',
    fieldDateTimeFormat: 'BBBB-MM-DD HH:mm:ss',
    yearFormat: 'BBBB',
    cellYearFormat: 'BBBB',
  },
};

const globalBuddhistLocale: any = {
  ...enUS,
  DatePicker: {
    ...(enUS.DatePicker || {}),
    lang: buddhistLocale.lang,
  },
};

const defaultValue = dayjs('2024-01-01');

const onChange: DatePickerProps['onChange'] = (_, dateStr) => {
  console.log('onChange:', dateStr);
};
</script>
