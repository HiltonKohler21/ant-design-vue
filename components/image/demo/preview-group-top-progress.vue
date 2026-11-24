<docs>
---
order: 14
debug: true
title:
  zh-CN: 多图预览时顶部进度自定义
  en-US: Top progress customization when previewing multiple images
---

## zh-CN

多图预览时顶部展示进度，支持自定义。

## en-US

The progress is displayed at the top of the multi-image preview, and customization is supported.
</docs>

<template>
  <a-image-preview-group :preview="previewConfig">
    <a-space :size="12" wrap>
      <a-image alt="svg image 1" :width="116" :src="img1" />
      <a-image alt="svg image 2" :width="116" :src="img2" />
      <a-image alt="svg image 3" :width="116" :src="img3" />
    </a-space>
  </a-image-preview-group>
</template>

<script lang="ts" setup>
const previewConfig = {
  countRender: (current: number, total: number) => `Current ${current} / Total ${total}`,
};

const img1 =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20150%20150%22%3E%3Crect%20width%3D%22150%22%20height%3D%22150%22%20rx%3D%2212%22%20fill%3D%22%23e6f4ff%22%2F%3E%3Ccircle%20cx%3D%2275%22%20cy%3D%2275%22%20r%3D%2242%22%20fill%3D%22%231677ff%22%2F%3E%3Ctext%20x%3D%2275%22%20y%3D%2283%22%20text-anchor%3D%22middle%22%20fill%3D%22%23fff%22%20font-size%3D%2224%22%20font-family%3D%22sans-serif%22%3E1%3C%2Ftext%3E%3C%2Fsvg%3E';
const img2 =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20150%20150%22%3E%3Crect%20width%3D%22150%22%20height%3D%22150%22%20rx%3D%2212%22%20fill%3D%22%23f6ffed%22%2F%3E%3Cpolygon%20points%3D%2275%2C28%20122%2C116%2028%2C116%22%20fill%3D%22%2352c41a%22%2F%3E%3Ctext%20x%3D%2275%22%20y%3D%22104%22%20text-anchor%3D%22middle%22%20fill%3D%22%23fff%22%20font-size%3D%2224%22%20font-family%3D%22sans-serif%22%3E2%3C%2Ftext%3E%3C%2Fsvg%3E';
const img3 =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20150%20150%22%3E%3Crect%20width%3D%22150%22%20height%3D%22150%22%20rx%3D%2212%22%20fill%3D%22%23fff2e8%22%2F%3E%3Crect%20x%3D%2235%22%20y%3D%2235%22%20width%3D%2280%22%20height%3D%2280%22%20rx%3D%2214%22%20fill%3D%22%23fa541c%22%2F%3E%3Ctext%20x%3D%2275%22%20y%3D%2283%22%20text-anchor%3D%22middle%22%20fill%3D%22%23fff%22%20font-size%3D%2224%22%20font-family%3D%22sans-serif%22%3E3%3C%2Ftext%3E%3C%2Fsvg%3E';
</script>
