<docs>
---
order: 4
version: 4.3.0
title:
  zh-CN: 进度条
  en-US: Progress of dots
---

## zh-CN

设置 `autoplay` 为对象并开启 `dotDuration`，在指示点中展示自动切换进度条。

## en-US

Pass an object with `dotDuration: true` to `autoplay` to show a progress bar animation on the active indicator dot.

</docs>

<template>
  <a-carousel :autoplay="{ dotDuration: true }" :autoplay-speed="5000">
    <div><h3>1</h3></div>
    <div><h3>2</h3></div>
    <div><h3>3</h3></div>
    <div><h3>4</h3></div>
  </a-carousel>
</template>

<style scoped>
/* For demo */
:deep(.slick-slide) {
  text-align: center;
  height: 160px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}
:deep(.slick-slide h3) {
  color: #fff;
}
</style>
