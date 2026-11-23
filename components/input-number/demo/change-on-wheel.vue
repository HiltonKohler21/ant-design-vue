<docs>
---
order: 8.5
title:
  zh-CN: 鼠标滚轮
  en-US: Wheel
---

## zh-CN

使用 `changeOnWheel` 控制鼠标滚轮改变数值。

## en-US

Use `changeOnWheel` to control changing value by mouse wheel.

</docs>

<template>
  <a-input-number
    v-model:value="value"
    :min="1"
    :max="10"
    change-on-wheel
    @change="onChange"
    @step="onStep"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const value = ref<number>(3);
const onChange = (val: number | string) => {
  console.log('changed', val);
};
const onStep = (val: number | string, info: { offset: number | string; type: 'up' | 'down' }) => {
  console.log('onStep', val, info);
};
</script>
