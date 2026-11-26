<docs>
---
order: 10
title:
  zh-CN: 自定义进度条渐变色
  en-US: Custom line gradient
---

## zh-CN

渐变色封装，`circle` 与 `dashboard` 设置渐变时 `strokeLinecap` 会被忽略。

## en-US

Gradient encapsulation, `circle` and `dashboard` will ignore `strokeLinecap` when setting gradient.

</docs>

<template>
  <a-flex vertical gap="middle">
    <a-progress :percent="99.9" :stroke-color="twoColors" />
    <a-progress :percent="50" status="active" :stroke-color="{ from: '#108ee9', to: '#87d068' }" />
    <a-flex gap="small" wrap="wrap">
      <a-progress type="circle" :percent="90" :stroke-color="twoColors" />
      <a-progress type="circle" :percent="100" :stroke-color="twoColors" />
      <a-progress type="circle" :percent="93" :stroke-color="conicColors" />
    </a-flex>
    <a-flex gap="small" wrap="wrap">
      <a-progress type="dashboard" :percent="90" :stroke-color="twoColors" />
      <a-progress type="dashboard" :percent="100" :stroke-color="twoColors" />
      <a-progress type="dashboard" :percent="93" :stroke-color="conicColors" />
    </a-flex>
  </a-flex>
</template>
<script lang="ts" setup>
import type { ProgressProps } from '@hiltonkohler21/ant-design-vue';

const twoColors: ProgressProps['strokeColor'] = {
  '0%': '#108ee9',
  '100%': '#87d068',
};

const conicColors: ProgressProps['strokeColor'] = {
  '0%': '#87d068',
  '50%': '#ffe58f',
  '100%': '#ffccc7',
};
</script>
