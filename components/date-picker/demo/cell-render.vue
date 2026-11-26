<docs>
---
order: 17
title:
  zh-CN: 定制单元格
  en-US: Customized Cell Rendering
---

## zh-CN

使用 `cellRender` 可以自定义单元格的内容和样式。

## en-US

We can customize the rendering of the cells in the calendar by providing a `cellRender` function to `DatePicker`.
</docs>

<template>
  <a-space :size="12" direction="vertical" style="max-width: 100%">
    <a-date-picker :cell-render="cellRender" />
    <a-range-picker :cell-render="cellRender" />
  </a-space>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import type { CSSProperties } from 'vue';
import { theme } from '@hiltonkohler21/ant-design-vue';
import type { DatePickerProps } from '@hiltonkohler21/ant-design-vue';
import type { Dayjs } from 'dayjs';

const { token } = theme.useToken();

const cellRender: DatePickerProps['cellRender'] = (current, info) => {
  if (info.type !== 'date') {
    return info.originNode;
  }
  if (typeof current === 'number' || typeof current === 'string') {
    return h('div', { class: 'ant-picker-cell-inner' }, current);
  }
  const dateObj = current as Dayjs;
  const style: CSSProperties =
    dateObj.date() === 1
      ? {
          border: `${token.value.lineWidth}px ${token.value.lineType} ${token.value.colorPrimary}`,
          borderRadius: '50%',
        }
      : {};
  return h('div', { class: 'ant-picker-cell-inner', style }, dateObj.date());
};
</script>
