<docs>
---
order: 4
title:
  zh-CN: Block 单选组合
  en-US: Block Radio.Group
---

## zh-CN

`block` 属性将使单选组合适合其父宽度。

## en-US

The `block` property will make the RadioGroup fit to its parent width.
</docs>
<template>
  <a-flex vertical gap="middle">
    <a-radio-group v-model:value="value1" block :options="options" />
    <a-radio-group
      v-model:value="value2"
      block
      :options="options"
      option-type="button"
      button-style="solid"
    />
    <a-radio-group v-model:value="value3" block :options="options" option-type="button" />
  </a-flex>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { RadioGroupProps } from 'ant-design-vue';

const options: RadioGroupProps['options'] = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
];

const value1 = ref<string>('Apple');
const value2 = ref<string>('Apple');
const value3 = ref<string>('Pear');
</script>
