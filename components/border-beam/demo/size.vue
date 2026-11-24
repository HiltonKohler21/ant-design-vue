<docs>
---
order: 6
version: 4.3.0
title:
  zh-CN: 尺寸
  en-US: Size
---

## zh-CN

通过 `size` 控制流光可见段的尺寸，默认值为 `100px`，数字类型按像素处理。

## en-US

Use `size` to control the size of the visible beam segment. The default is `100px`, and numbers are treated as pixels.
</docs>

<template>
  <div
    :style="{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: '16px',
      maxWidth: '100%',
    }"
  >
    <div
      v-for="item in sizes"
      :key="item.name"
      :style="{ gridColumn: item.spanFull ? '1 / -1' : undefined }"
    >
      <a-border-beam :size="item.size">
        <a-card
          :title="item.name"
          :styles="{
            body: {
              minHeight: `${item.bodyMinHeight}px`,
              display: 'flex',
              alignItems: 'center',
            },
          }"
        >
          <template #extra>
            <a-tag variant="filled">{{ item.size ?? 100 }}px</a-tag>
          </template>
          <a-typography-text type="secondary">{{ item.description }}</a-typography-text>
        </a-card>
      </a-border-beam>
    </div>
  </div>
</template>

<script lang="ts" setup>
const sizes: Array<{
  name: string;
  size?: number | string;
  bodyMinHeight: number;
  description: string;
  spanFull?: boolean;
}> = [
  {
    name: 'Default',
    bodyMinHeight: 112,
    description: 'Uses the default 100px visible beam segment.',
  },
  {
    name: 'Compact',
    size: 56,
    bodyMinHeight: 112,
    description: 'Keeps the highlight shorter for dense card groups.',
  },
  {
    name: 'Extended',
    size: 160,
    bodyMinHeight: 160,
    description: 'Creates a longer highlight for wider feature panels.',
    spanFull: true,
  },
];
</script>
