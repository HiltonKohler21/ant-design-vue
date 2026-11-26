<docs>
---
order: 13.1
debug: true
title:
  zh-CN: Filled debug
  en-US: Filled debug
---

## zh-CN

可选 `outlined` `filled` `borderless` 三种形态。

## en-US

There are `outlined`, `filled` and `borderless`, totally three variants to choose from.
</docs>

<template>
  <a-flex :gap="12" vertical>
    <a-flex :gap="8">
      <a-select value="lucy" variant="filled" disabled :options="options" :style="sharedStyle" />
      <a-select
        :value="['lucy']"
        variant="filled"
        disabled
        mode="multiple"
        placeholder="Outlined"
        :options="options"
        :style="sharedStyle"
      />
    </a-flex>
    <a-flex :gap="8">
      <a-select
        value="lucy"
        variant="filled"
        status="error"
        :options="options"
        :style="sharedStyle"
      />
      <a-select
        :value="['lucy']"
        variant="filled"
        status="error"
        mode="multiple"
        placeholder="Outlined"
        :options="options"
        :style="sharedStyle"
      />
    </a-flex>
    <a-flex :gap="8">
      <a-select
        value="lucy"
        variant="filled"
        disabled
        status="error"
        :options="options"
        :style="sharedStyle"
      />
      <a-select
        :value="['lucy']"
        variant="filled"
        disabled
        status="error"
        mode="multiple"
        placeholder="Outlined"
        :options="options"
        :style="sharedStyle"
      />
    </a-flex>
  </a-flex>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import type { SelectProps } from '@hiltonkohler21/ant-design-vue';

const sharedStyle: CSSProperties = {
  flex: '1 1 50%',
  minWidth: '0',
  margin: '0',
};

const options: SelectProps['options'] = [
  { value: 'jack', label: 'Jack' },
  { value: 'lucy', label: 'Lucy' },
  { value: 'Yiminghe', label: 'yiminghe' },
];
</script>
