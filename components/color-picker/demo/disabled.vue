<docs>
---
order: 7
title:
  zh-CN: 禁用与透明度
  en-US: Disabled & Alpha
---

## zh-CN

支持通过 `disabled` 禁用选择器，或通过 `disabledAlpha` 禁用透明度通道调节。

## en-US

Support disabling color picker via `disabled`, or disabling alpha channel via `disabledAlpha`.

</docs>
<template>
  <a-space :size="16">
    <a-color-picker defaultValue="#1677ff" disabled showText />
    <a-color-picker defaultValue="#1677ff" disabledAlpha showText />
  </a-space>
</template>
