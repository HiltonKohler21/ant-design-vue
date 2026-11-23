<docs>
---
order: 7
title:
  zh-CN: 轮播的公告
  en-US: Loop Banner
---

## zh-CN

利用纯 CSS `@keyframes` 动画配合 `banner` 模式实现平滑的公告跑马灯，鼠标悬停时自动暂停。

## en-US

Build a smooth scrolling marquee banner inside `<a-alert banner>` with pure CSS `@keyframes`, automatically pausing on hover.
</docs>

<template>
  <a-alert banner>
    <template #message>
      <div class="alert-marquee">
        <div class="alert-marquee-track">
          <span class="alert-marquee-item">
            I can be a Vue component, multiple components, or just some scrolling announcement text.
          </span>
          <span class="alert-marquee-item" aria-hidden="true">
            I can be a Vue component, multiple components, or just some scrolling announcement text.
          </span>
        </div>
      </div>
    </template>
  </a-alert>
</template>

<style scoped>
.alert-marquee {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
}

.alert-marquee-track {
  display: inline-flex;
  animation: alert-marquee-scroll 14s linear infinite;
}

.alert-marquee:hover .alert-marquee-track {
  animation-play-state: paused;
}

.alert-marquee-item {
  padding-inline-end: 48px;
}

@keyframes alert-marquee-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
