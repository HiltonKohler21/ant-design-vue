<docs>
---
order: 14
title:
  zh-CN: 改变进度数值位置
  en-US: Custom Percent Position
---

## zh-CN

通过 `percentPosition` 控制进度条数值的对齐方式（`align`）和内外位置（`type`）。

## en-US

Customize the alignment (`align`) and placement (`type`) of the percentage info via `percentPosition`.

</docs>

<template>
  <a-flex gap="small" vertical>
    <a-progress
      :percent="0"
      :percent-position="{ align: 'center', type: 'inner' }"
      :size="[200, 20]"
      stroke-color="#E6F4FF"
    />
    <a-progress
      :percent="10"
      :percent-position="{ align: 'center', type: 'inner' }"
      :size="[300, 20]"
    />
    <a-progress
      :percent="50"
      :percent-position="{ align: 'start', type: 'inner' }"
      :size="[300, 20]"
      stroke-color="#B7EB8F"
    />
    <a-progress
      :percent="60"
      :percent-position="{ align: 'end', type: 'inner' }"
      :size="[300, 20]"
      stroke-color="#001342"
    />
    <a-progress
      :percent="100"
      :percent-position="{ align: 'center', type: 'inner' }"
      :size="[400, 20]"
    />
    <a-progress :percent="60" :percent-position="{ align: 'start', type: 'outer' }" />
    <a-progress :percent="100" :percent-position="{ align: 'start', type: 'outer' }" />
    <a-progress :percent="60" :percent-position="{ align: 'center', type: 'outer' }" size="small" />
    <a-progress :percent="100" :percent-position="{ align: 'center', type: 'outer' }" />
  </a-flex>
</template>
