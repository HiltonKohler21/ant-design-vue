<docs>
---
order: 13
title:
  zh-CN: 指示条
  en-US: Indicator
---

## zh-CN

通过 `indicator` 配置指示条的长度（`size`）与对齐方式（`align`）。

## en-US

Customize the indicator `size` and `align` via the `indicator` prop.

</docs>

<template>
  <div>
    <a-segmented
      v-model:value="alignValue"
      :options="['start', 'center', 'end']"
      style="margin-bottom: 8px"
    />
    <a-tabs
      default-active-key="1"
      :items="items"
      :indicator="{ size: (origin: number) => origin - 20, align: alignValue }"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { TabsProps } from 'ant-design-vue';

type Align = 'start' | 'center' | 'end';

const alignValue = ref<Align>('center');

const items: TabsProps['items'] = [
  { key: '1', label: 'Tab 1', children: 'Content of Tab Pane 1' },
  { key: '2', label: 'Tab 2', children: 'Content of Tab Pane 2' },
  { key: '3', label: 'Tab 3', children: 'Content of Tab Pane 3' },
];
</script>
