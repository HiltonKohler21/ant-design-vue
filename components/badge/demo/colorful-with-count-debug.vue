<docs>
---
order: 15
debug: true
title:
  zh-CN: 多彩徽标支持 count 显示 Debug
  en-US: Colorful Badge support count Debug
---

## zh-CN

在使用多彩徽标的同时，支持 `count` 属性显示。

## en-US

Support `count` when using colorful badge.
</docs>

<template>
  <a-space direction="vertical" size="middle" style="width: 100%">
    <a-space wrap :size="['large', 'middle']">
      <a-badge v-for="color in colors" :key="color" :color="color" :count="44">
        <div :style="boxStyle">{{ color }}</div>
      </a-badge>
    </a-space>
    <a-space wrap :size="['large', 'middle']">
      <a-badge
        v-for="color in colors"
        :key="`status-${color}`"
        status="processing"
        :color="color"
        text="loading"
      />
    </a-space>
  </a-space>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue';

const colors = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
];

const boxStyle: CSSProperties = {
  width: '72px',
  height: '72px',
  lineHeight: '72px',
  background: '#ccc',
  textAlign: 'center',
  color: '#000',
};
</script>
