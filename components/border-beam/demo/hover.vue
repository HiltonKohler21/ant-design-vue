<docs>
---
order: 1
title:
  zh-CN: 鼠标悬浮时显示
  en-US: Show on hover
---

## zh-CN

默认隐藏边框流光，在鼠标 hover 到容器上时显示。

## en-US

Hide the border beam by default, and reveal it when hovering over the container.
</docs>

<template>
  <a-border-beam>
    <a-card class="border-beam-hover-card" title="Hover over the card">
      The border beam appears when the pointer moves over this card.
    </a-card>
  </a-border-beam>
</template>

<style scoped>
.border-beam-hover-card {
  width: 360px;
  max-width: 100%;
}

.border-beam-hover-card :deep(.ant-border-beam) {
  opacity: 0;
  transition: opacity var(--ant-motion-duration-mid, 0.2s);
}

.border-beam-hover-card :deep(.ant-border-beam::before) {
  animation-play-state: paused;
}

.border-beam-hover-card:hover :deep(.ant-border-beam) {
  opacity: 1;
}

.border-beam-hover-card:hover :deep(.ant-border-beam::before) {
  animation-play-state: running;
}
</style>
