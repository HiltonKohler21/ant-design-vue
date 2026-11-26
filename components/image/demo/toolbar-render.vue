<docs>
---
order: 7
title:
  zh-CN: 自定义工具栏
  en-US: Custom toolbar render
---

## zh-CN

通过 `preview.actionsRender`（兼容 `toolbarRender`）自定义预览工具栏，并可结合 `actions` 执行翻转、旋转、缩放、重置等操作。

## en-US

Customize the preview toolbar using `preview.actionsRender` (compatible with `toolbarRender`) and invoke built-in `actions` such as flip, rotate, zoom, and reset.

</docs>

<template>
  <a-image
    :width="200"
    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    :preview="{
      actionsRender,
    }"
  />
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { Space } from '@hiltonkohler21/ant-design-vue';
import {
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons-vue';

const actionsRender = (_: any, { transform: { scale }, actions }: any) =>
  h(
    Space,
    {
      size: 12,
      style: {
        padding: '8px 24px',
        color: '#fff',
        fontSize: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        borderRadius: '100px',
        pointerEvents: 'auto',
      },
    },
    () => [
      h(SwapOutlined, { rotate: 90, onClick: actions.onFlipY }),
      h(SwapOutlined, { onClick: actions.onFlipX }),
      h(RotateLeftOutlined, { onClick: actions.onRotateLeft }),
      h(RotateRightOutlined, { onClick: actions.onRotateRight }),
      h(ZoomOutOutlined, {
        style: { opacity: scale <= 1 ? 0.3 : 1 },
        onClick: actions.onZoomOut,
      }),
      h(ZoomInOutlined, {
        style: { opacity: scale >= 50 ? 0.3 : 1 },
        onClick: actions.onZoomIn,
      }),
      h(UndoOutlined, { onClick: actions.onReset }),
    ],
  );
</script>
