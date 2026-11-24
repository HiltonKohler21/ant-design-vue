<docs>
---
order: 12
debug: true
title:
  zh-CN: 预设渐变色
  en-US: Preset Line Gradient
---

## zh-CN

设置颜色选择器的预设渐变色。

## en-US

Set the presets gradient color of the color picker.
</docs>

<template>
  <a-color-picker :mode="['single', 'gradient']" :presets="presets" />
</template>

<script lang="ts" setup>
const PRESET_COLORS = [
  ['rgb(42, 188, 191)', 'rgb(56, 54, 221)'],
  ['rgb(34, 73, 254)', 'rgb(199, 74, 168)'],
  ['rgb(255, 111, 4)', 'rgb(243, 48, 171)'],
  ['rgb(244, 170, 6)', 'rgb(229, 70, 49)'],
];

const presets = [
  {
    label: 'Liner',
    colors: PRESET_COLORS.map(colors => [
      {
        color: colors[0],
        percent: 0,
      },
      {
        color: colors[1],
        percent: 100,
      },
    ]),
    defaultOpen: true,
  },
];
</script>
