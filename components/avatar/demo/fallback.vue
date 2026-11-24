<docs>
---
order: 8
debug: true
title:
  zh-CN: 图片不存在时
  en-US: Fallback
---

## zh-CN

图片不存在时，会尝试回退到 `icon`，最后回退到显示默认插槽内容。

## en-US

When the image fails to load, Avatar falls back to `icon`, and finally to the default slot content.
</docs>

<template>
  <a-space wrap>
    <a-avatar shape="circle" src="data:image/png;base64,AAAA">A</a-avatar>
    <a-avatar shape="circle" src="data:image/png;base64,AAAA">ABC</a-avatar>
  </a-space>
</template>
