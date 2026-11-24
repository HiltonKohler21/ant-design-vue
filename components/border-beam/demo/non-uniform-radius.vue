<docs>
---
order: 8
debug: true
title:
  zh-CN: 不规则圆角
  en-US: Non-uniform radius
---

## zh-CN

通过 `borderRadius="20px 20px 0 0"` 这类多值圆角字符串，让流光轨迹跟随不规则圆角容器。

## en-US

Use a multi-value radius string such as `borderRadius="20px 20px 0 0"` to align the beam with non-uniform rounded corners.
</docs>

<template>
  <div :style="{ width: '360px', maxWidth: '100%' }">
    <a-border-beam :outset="0">
      <a-card
        title="Activity stream"
        :style="{
          borderRadius: '20px 20px 0 0',
          overflow: 'hidden',
        }"
        :styles="{
          body: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          },
        }"
      >
        <a-typography-text type="secondary">
          Use a multi-value `borderRadius` like `20px 20px 0 0` to keep the beam aligned with
          non-uniform corners.
        </a-typography-text>
        <a-flex align="center" justify="space-between">
          <a-typography-text strong>12 running jobs</a-typography-text>
          <a-button type="primary">View queue</a-button>
        </a-flex>
      </a-card>
    </a-border-beam>
  </div>
</template>
