<docs>
---
order: 101
debug: true
title:
  zh-CN: Style Debug
  en-US: Style Debug
---

## zh-CN

Buggy! 测试一些踩过的样式坑。

## en-US

Buggy!
</docs>

<template>
  <div style="background-color: rgba(0, 0, 128, 0.2); padding: 8px">
    <a-input placeholder="Unbordered" variant="borderless" />
    <a-input placeholder="Unbordered" variant="borderless" size="large" />
    <a-textarea placeholder="Unbordered" variant="borderless" />
    <a-textarea placeholder="Unbordered" variant="borderless" allow-clear />
    <a-input placeholder="Unbordered" variant="borderless" allow-clear />
    <a-input prefix="￥" suffix="RMB" variant="borderless" />
    <a-input prefix="￥" suffix="RMB" disabled variant="borderless" />
    <a-textarea allow-clear style="border: 2px solid #000" />
    <a-input default-value="error" variant="borderless" status="error" />
    <a-input default-value="warning" variant="borderless" status="warning" />
    <a-input prefix="$" default-value="error" variant="borderless" status="error" />
    <a-input prefix="$" default-value="warning" variant="borderless" status="warning" />
  </div>
</template>
