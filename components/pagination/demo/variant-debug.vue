<docs>
---
order: 15
debug: true
title:
  zh-CN: 变体 Debug
  en-US: Variant Debug
---

## zh-CN

调试 `ConfigProvider` 的 `variant` 对快速跳转输入框的影响。

## en-US

Debug how `ConfigProvider` `variant` affects quick jumper inputs.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-config-provider v-for="variant in variants" :key="variant" :variant="variant">
      <a-flex vertical gap="small">
        <a-typography-text code>{{ variant }}</a-typography-text>
        <a-pagination :default-current="2" :total="50" show-quick-jumper />
        <a-pagination :default-current="2" :total="50" simple />
      </a-flex>
    </a-config-provider>
  </a-flex>
</template>

<script lang="ts" setup>
const variants = ['outlined', 'filled', 'borderless', 'underlined'] as const;
</script>
