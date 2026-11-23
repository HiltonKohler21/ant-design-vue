<docs>
---
order: 9
title:
  zh-CN: 预设颜色
  en-US: Preset Colors
---

## zh-CN

通过 `presets` 属性为颜色选择器预设常用快捷选项。

## en-US

Preset colors for color picker via `presets` property.

</docs>
<template>
  <a-color-picker defaultValue="#1677ff" :presets="presets" showText />
</template>
<script lang="ts" setup>
const presets = [
  {
    label: '推荐色',
    colors: [
      '#000000',
      '#000000E0',
      '#000000A6',
      '#00000073',
      '#00000040',
      '#00000026',
      '#00000014',
      '#0000000A',
    ],
  },
  {
    label: '常用主题',
    colors: [
      '#F5222D',
      '#FA541C',
      '#FA8C16',
      '#FAAD14',
      '#FADB14',
      '#A0D911',
      '#52C41A',
      '#13C2C2',
      '#1677FF',
      '#2F54EB',
      '#722ED1',
      '#EB2F96',
    ],
  },
];
</script>
