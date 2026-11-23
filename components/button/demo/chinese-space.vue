<docs>
---
order: 19
version: 4.3.0
title:
  zh-CN: 移除两个汉字之间的空格
  en-US: Remove Space Between 2 Chinese Characters
---

## zh-CN

我们默认在两个汉字之间添加空格，可以通过设置 `autoInsertSpace` 为 `false` 关闭。

## en-US

We add a space between two Chinese characters by default, which can be removed by setting `autoInsertSpace` to `false`.
</docs>

<template>
  <a-flex gap="small" wrap="wrap">
    <a-button type="primary" :auto-insert-space="false">确定</a-button>
    <a-button type="primary" :auto-insert-space="true">确定</a-button>
  </a-flex>
</template>
