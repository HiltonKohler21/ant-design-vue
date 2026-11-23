<docs>
---
order: 9
title:
  zh-CN: 预览遮罩
  en-US: Preview mask
---

## zh-CN

通过 `preview.mask` 配置预览遮罩的模糊（`blur`）、隐藏（`false`）以及点击遮罩关闭（`closable`）效果，并通过 `preview.cover` 自定义缩略图悬浮层。

## en-US

Configure preview backdrop `mask` (`blur`, `false`, `closable`) and customize thumbnail hover `cover`.

</docs>

<template>
  <a-space :size="16" wrap>
    <a-image
      :width="160"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      :preview="{
        mask: { blur: true },
        cover: 'Blur Mask',
      }"
    />
    <a-image
      :width="160"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      :preview="{
        mask: false,
        cover: { coverNode: 'No Mask', placement: 'bottom' },
      }"
    />
  </a-space>
</template>
