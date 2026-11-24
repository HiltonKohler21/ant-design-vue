<docs>
---
order: 16
debug: true
title:
  zh-CN: 在渲染函数中获取图片信息
  en-US: Gets image info in the render function
---

## zh-CN

在渲染函数中获取图片的信息。

## en-US

Gets image info in the render function.
</docs>

<template>
  <a-image :src="imgSrc" width="200px" height="200px" alt="test" :preview="previewConfig" />
</template>

<script lang="ts" setup>
import { h } from 'vue';

const imgSrc =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g3%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23722ed1%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23eb2f96%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20rx%3D%2212%22%20fill%3D%22url(%23g3)%22%2F%3E%3Ctext%20x%3D%22100%22%20y%3D%22108%22%20text-anchor%3D%22middle%22%20fill%3D%22%23fff%22%20font-size%3D%2224%22%20font-family%3D%22sans-serif%22%3EImgInfo%3C%2Ftext%3E%3C%2Fsvg%3E';

const infoStyle = {
  color: '#fff',
  background: 'rgba(0, 0, 0, 0.65)',
  padding: '8px 12px',
  borderRadius: '4px',
  maxWidth: '90vw',
  wordBreak: 'break-all' as const,
};

const previewConfig = {
  imageRender: (_: any, { image }: any) => h('div', { style: infoStyle }, JSON.stringify(image)),
  actionsRender: (_: any, { image }: any) => h('div', { style: infoStyle }, JSON.stringify(image)),
};
</script>
