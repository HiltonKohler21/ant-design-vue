<docs>
---
order: 9
title:
  zh-CN: 形态变体
  en-US: Variant
---

## zh-CN

通过 `variant` 设置标签的形态变体：`filled`、`solid`、`outlined`。

## en-US

Use `variant` to switch between `filled`, `solid`, and `outlined` tag styles.

</docs>

<template>
  <a-space direction="vertical" :size="12">
    <a-space wrap>
      <a-tag variant="filled">Filled Default</a-tag>
      <a-tag variant="filled" color="blue">Filled Blue</a-tag>
      <a-tag variant="filled" color="success">Filled Success</a-tag>
      <a-tag variant="filled" color="#f50">Filled Custom</a-tag>
    </a-space>
    <a-space wrap>
      <a-tag variant="solid">Solid Default</a-tag>
      <a-tag variant="solid" color="blue">Solid Blue</a-tag>
      <a-tag variant="solid" color="success">Solid Success</a-tag>
      <a-tag variant="solid" color="#f50">Solid Custom</a-tag>
    </a-space>
    <a-space wrap>
      <a-tag variant="outlined">Outlined Default</a-tag>
      <a-tag variant="outlined" color="blue">Outlined Blue</a-tag>
      <a-tag variant="outlined" color="success">Outlined Success</a-tag>
      <a-tag variant="outlined" color="#f50">Outlined Custom</a-tag>
    </a-space>
  </a-space>
</template>
