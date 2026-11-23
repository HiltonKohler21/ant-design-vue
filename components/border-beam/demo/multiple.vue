<docs>
---
order: 2
title:
  zh-CN: 多光束与独立配置
  en-US: Multiple Beams
---

## zh-CN

通过 `count` 设置均匀分布的多条光束，或通过 `items` 为每条光束单独指定颜色、宽度与长度。

## en-US

Use `count` for evenly spaced beams, or `items` to configure each beam independently.

</docs>
<template>
  <a-space :size="20" wrap>
    <a-border-beam :count="2" :duration="5">
      <a-card size="small" title="count = 2" style="width: 240px">
        <p style="margin: 0; color: var(--ant-color-text-secondary)">两条光束以负延迟对称启动。</p>
      </a-card>
    </a-border-beam>

    <a-border-beam
      :duration="5"
      :items="[
        { color: ['#1677ff', '#13c2c2'], lineWidth: 2, size: 120 },
        { color: ['#eb2f96', '#fa8c16'], lineWidth: 2, size: 120 },
      ]"
    >
      <a-card size="small" title="Custom items" style="width: 240px">
        <p style="margin: 0; color: var(--ant-color-text-secondary)">两条独立配色的双向流光。</p>
      </a-card>
    </a-border-beam>
  </a-space>
</template>
