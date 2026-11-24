<docs>
---
order: 1
title:
  zh-CN: 多彩标签
  en-US: Colorful Tag
---

## zh-CN

我们添加了多种预设色彩的标签样式，用作不同场景使用。如果预设值不能满足你的需求，可以设置为具体的色值。

## en-US

We preset a series of colorful tag styles for use in different situations. You can also set it to a hex color string for custom color.

</docs>

<template>
  <div v-for="variant in variants" :key="`preset-${variant}`">
    <a-divider title-placement="start">Presets ({{ variant }})</a-divider>
    <a-flex gap="small" align="center" wrap>
      <a-tag v-for="color in presets" :key="color" :color="color" :variant="variant">
        {{ color }}
      </a-tag>
    </a-flex>
  </div>
  <div v-for="variant in variants" :key="`custom-${variant}`">
    <a-divider title-placement="start">Custom ({{ variant }})</a-divider>
    <a-flex gap="small" align="center" wrap>
      <a-tag v-for="color in customs" :key="color" :color="color" :variant="variant">
        {{ color }}
      </a-tag>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
const variants = ['filled', 'solid', 'outlined'] as const;

const presets = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
];

const customs = ['#f50', '#2db7f5', '#87d068', '#108ee9'];
</script>
