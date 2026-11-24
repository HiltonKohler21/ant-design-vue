<docs>
---
order: 7
title:
  zh-CN: 大小
  en-US: Size
---

## zh-CN

可以设置有数字徽标的大小。

## en-US

Set size of numeral Badge.
</docs>

<template>
  <a-space size="middle" wrap>
    <a-badge size="default" :count="5">
      <a-avatar shape="square" size="large" />
    </a-badge>
    <a-badge size="small" :count="5">
      <a-avatar shape="square" size="large" />
    </a-badge>
  </a-space>
</template>
