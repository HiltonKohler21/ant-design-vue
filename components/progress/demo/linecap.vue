<docs>
---
order: 9
title:
  zh-CN: 边缘形状
  en-US: Stroke Linecap
---

## zh-CN

`strokeLinecap="square|round"` 可以调整进度条边缘的形状。

## en-US

By setting `strokeLinecap="square"`, you can change the linecaps from round to square.

</docs>

<template>
  <div>
    <a-progress stroke-linecap="square" :percent="75" />
    <a-progress stroke-linecap="square" :percent="75" type="circle" />
    <a-progress stroke-linecap="square" :percent="75" type="dashboard" />
  </div>
</template>
