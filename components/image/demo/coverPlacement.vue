<docs>
---
order: 12
debug: true
title:
  zh-CN: 自定义预览遮罩位置
  en-US: Custom preview cover placement
---

## zh-CN

设置预览遮罩显示的位置。

## en-US

Set the position of the preview mask display.
</docs>

<template>
  <a-space :size="16" wrap>
    <a-image :width="96" alt="basic image" :src="imgSrc" :preview="centerPreview" />
    <a-image :width="96" alt="image" :src="imgSrc" :preview="topPreview" />
    <a-image :width="96" alt="image" :src="imgSrc" :preview="bottomPreview" />
  </a-space>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { ZoomInOutlined } from '@ant-design/icons-vue';
import { Space } from '@hiltonkohler21/ant-design-vue';

const imgSrc =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g2%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%2313c2c2%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%231677ff%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20rx%3D%2212%22%20fill%3D%22url(%23g2)%22%2F%3E%3Ccircle%20cx%3D%22135%22%20cy%3D%2265%22%20r%3D%2222%22%20fill%3D%22%23fff1b8%22%2F%3E%3Cpath%20d%3D%22M16%20172l58-72%2042%2048%2030-34%2038%2058z%22%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.85%22%2F%3E%3C%2Fsvg%3E';

const createCoverPreview = (placement: 'center' | 'top' | 'bottom') => ({
  cover: {
    coverNode: h(Space, { align: 'center' }, () => [h(ZoomInOutlined), placement]),
    placement,
  },
});

const centerPreview = createCoverPreview('center');
const topPreview = createCoverPreview('top');
const bottomPreview = createCoverPreview('bottom');
</script>
