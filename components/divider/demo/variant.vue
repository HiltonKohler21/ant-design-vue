<docs>
---
order: 5
title:
  zh-CN: 变体
  en-US: Variant
---

## zh-CN

分割线默认为 `solid`（实线）变体，可以通过 `variant` 切换为 `dashed`（虚线）或 `dotted`（点线），支持水平、带文字及垂直分割线。

## en-US

Divider uses the `solid` variant by default. You can change `variant` to `dashed` or `dotted` for horizontal, with-text, and vertical dividers.
</docs>

<template>
  <p>Plain horizontal dividers:</p>
  <a-divider variant="solid" style="border-color: #7cb305" />
  <a-divider variant="dashed" style="border-color: #7cb305" />
  <a-divider variant="dotted" style="border-color: #7cb305" />

  <p>Horizontal dividers with text:</p>
  <a-divider variant="solid" style="border-color: #7cb305">Solid</a-divider>
  <a-divider variant="dashed" style="border-color: #7cb305">Dashed</a-divider>
  <a-divider variant="dotted" style="border-color: #7cb305">Dotted</a-divider>

  <p>Vertical dividers:</p>
  <div>
    Solid
    <a-divider type="vertical" variant="solid" style="border-color: #7cb305" />
    Dashed
    <a-divider type="vertical" variant="dashed" style="border-color: #7cb305" />
    Dotted
    <a-divider type="vertical" variant="dotted" style="border-color: #7cb305" />
    End
  </div>
</template>
