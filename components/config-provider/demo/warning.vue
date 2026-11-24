<docs>
---
order: 9
version: 4.3.0
debug: true
title:
  zh-CN: 警告
  en-US: warning
---

## zh-CN

调整 warning 策略。

## en-US

Adjust warning strategy.
</docs>

<template>
  <a-typography-title :level="4">Open single page to check the console</a-typography-title>
  <a-config-provider :warning="{ strict: false }">
    <a-alert title="Warning Strategy" close-text="deprecated" />
  </a-config-provider>
</template>
