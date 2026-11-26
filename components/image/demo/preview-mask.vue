<docs>
---
order: 11
debug: true
title:
  zh-CN: 自定义预览文本
  en-US: Custom preview mask
---

## zh-CN

自定义预览文本。

## en-US

Custom preview mask.
</docs>

<template>
  <a-image
    :width="96"
    alt="basic image"
    :src="imgSrc"
    :class-names="imageClassNames"
    :preview="previewConfig"
  />
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { ZoomInOutlined } from '@ant-design/icons-vue';
import { Space } from '@hiltonkohler21/ant-design-vue';
import type { ImageProps } from '@hiltonkohler21/ant-design-vue';

const imgSrc =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g1%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%231677ff%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23722ed1%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20rx%3D%2212%22%20fill%3D%22url(%23g1)%22%2F%3E%3Ccircle%20cx%3D%2270%22%20cy%3D%2270%22%20r%3D%2224%22%20fill%3D%22%23ffd666%22%2F%3E%3Cpath%20d%3D%22M20%20170l52-62%2038%2042%2028-30%2042%2050z%22%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.85%22%2F%3E%3C%2Fsvg%3E';

const imageClassNames: ImageProps['classNames'] = {
  popup: {
    mask: 'image-preview-mask-debug-backdrop',
  },
};

const previewConfig = {
  cover: h(Space, { direction: 'vertical', align: 'center' }, () => [h(ZoomInOutlined), 'Preview']),
};
</script>

<style>
.image-preview-mask-debug-backdrop {
  opacity: 1;
  font-size: 20px;
}
</style>
