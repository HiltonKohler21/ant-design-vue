<docs>
---
order: 4
version: 4.3.0
title:
  zh-CN: 切换箭头
  en-US: Arrows for switching
---

## zh-CN

显示切换箭头。

## en-US

Show the arrows for switching.
</docs>

<template>
  <a-carousel arrows :infinite="false">
    <div>
      <h3 :style="contentStyle">1</h3>
    </div>
    <div>
      <h3 :style="contentStyle">2</h3>
    </div>
    <div>
      <h3 :style="contentStyle">3</h3>
    </div>
    <div>
      <h3 :style="contentStyle">4</h3>
    </div>
  </a-carousel>
  <br />
  <a-carousel arrows dot-placement="start" :infinite="false">
    <div>
      <h3 :style="contentStyle">1</h3>
    </div>
    <div>
      <h3 :style="contentStyle">2</h3>
    </div>
    <div>
      <h3 :style="contentStyle">3</h3>
    </div>
    <div>
      <h3 :style="contentStyle">4</h3>
    </div>
  </a-carousel>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue';

const contentStyle: CSSProperties = {
  margin: '0px',
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};
</script>
