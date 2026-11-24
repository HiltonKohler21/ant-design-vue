<docs>
---
order: 1
version: 4.3.0
title:
  zh-CN: 方向
  en-US: Align
---

## zh-CN

通过 `align` 设置分页器的对齐方式。

## en-US

Set alignment of Pagination via `align`.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-pagination align="start" :default-current="1" :total="50" />
    <a-pagination align="center" :default-current="1" :total="50" />
    <a-pagination align="end" :default-current="1" :total="50" />
  </a-flex>
</template>
