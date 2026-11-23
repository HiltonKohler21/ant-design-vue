<docs>
---
order: 8
title:
  zh-CN: 自定义预览内容
  en-US: Custom preview render
---

## zh-CN

通过 `preview.imageRender` 自定义预览展示内容。

## en-US

Customize the preview content via `preview.imageRender`.

</docs>

<template>
  <a-image
    :width="200"
    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    :preview="{
      imageRender,
    }"
  />
</template>

<script lang="ts" setup>
import { h } from 'vue';

const imageRender = (originalNode: any, { transform }: any) =>
  h(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        pointerEvents: 'auto',
      },
    },
    [
      originalNode,
      h(
        'div',
        {
          style: {
            color: '#fff',
            background: 'rgba(0, 0, 0, 0.45)',
            padding: '4px 12px',
            borderRadius: '4px',
          },
        },
        `Scale: ${Math.round(transform.scale * 100)}% | Rotate: ${transform.rotate}°`,
      ),
    ],
  );
</script>
