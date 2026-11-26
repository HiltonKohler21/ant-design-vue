<docs>
---
order: 2
title:
  zh-CN: 不同的状态
  en-US: other status
---

## zh-CN

可以通过 status 的值控制二维码的状态，提供了 `active`、`expired`、`loading`、`scanned` 四个值。

## en-US
The status can be controlled by the value `status`, four values ​​of `active`, `expired`, `loading`, `scanned` are provided.
</docs>

<template>
  <a-space wrap>
    <a-qrcode value="https://hiltonkohler21.github.io/ant-design-vue" status="loading" />
    <a-qrcode
      value="https://hiltonkohler21.github.io/ant-design-vue"
      status="expired"
      @refresh="() => console.log('refresh')"
    />
    <a-qrcode value="https://hiltonkohler21.github.io/ant-design-vue" status="scanned" />
  </a-space>
</template>
