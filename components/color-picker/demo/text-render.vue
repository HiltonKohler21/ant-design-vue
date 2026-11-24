<docs>
---
order: 4
title:
  zh-CN: 渲染触发器文本
  en-US: Rendering Trigger Text
---

## zh-CN

渲染触发器的默认文本，`showText` 为 `true` 时生效。自定义文本时，可以使用 `showText` 为函数的方式，返回自定义的文本。

## en-US

Renders the default text of the trigger, effective when `showText` is `true`. When customizing text, you can use `showText` as a function to return custom text.
</docs>

<template>
  <a-space direction="vertical">
    <a-color-picker default-value="#1677ff" show-text allow-clear />
    <a-color-picker default-value="#1677ff" :show-text="customText" />
    <a-color-picker v-model:open="open" default-value="#1677ff" :show-text="renderArrow" />
  </a-space>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';
import type { AggregationColor } from '../index';

const open = ref(false);

const customText = (color: AggregationColor) =>
  h('span', null, `Custom Text (${color.toHexString()})`);

const renderArrow = () =>
  h(DownOutlined, {
    rotate: open.value ? 180 : 0,
    style: {
      color: 'rgba(0, 0, 0, 0.25)',
    },
  });
</script>
