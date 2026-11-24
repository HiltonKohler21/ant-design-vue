<docs>
---
order: 99
debug: true
title:
  zh-CN: 禁用步进按钮 hover
  en-US: Disabled handler hover
---

## zh-CN

禁用步进按钮 hover 排查。

## en-US

Disabled handler hover debug.
</docs>

<template>
  <a-flex vertical :gap="16">
    <a-typography-text type="secondary">
      Hover the disabled step controls when the value reaches min or max.
    </a-typography-text>

    <a-flex :gap="16" wrap="wrap">
      <a-flex vertical :gap="8">
        <a-typography-text>Input mode at max</a-typography-text>
        <a-input-number :min="0" :max="3" :controls="true" :default-value="3" :style="inputStyle" />
      </a-flex>

      <a-flex vertical :gap="8">
        <a-typography-text>Input mode at min</a-typography-text>
        <a-input-number :min="0" :max="3" :controls="true" :default-value="0" :style="inputStyle" />
      </a-flex>

      <a-flex vertical :gap="8">
        <a-typography-text>Spinner mode at max</a-typography-text>
        <a-input-number
          :min="0"
          :max="3"
          :controls="true"
          :default-value="3"
          mode="spinner"
          :style="inputStyle"
        />
      </a-flex>

      <a-flex vertical :gap="8">
        <a-typography-text>Spinner mode at min</a-typography-text>
        <a-input-number
          :min="0"
          :max="3"
          :controls="true"
          :default-value="0"
          mode="spinner"
          :style="inputStyle"
        />
      </a-flex>

      <a-flex vertical :gap="8">
        <a-typography-text>Spinner mode with prefix and suffix</a-typography-text>
        <a-input-number
          :min="0"
          :max="3"
          :controls="true"
          :default-value="1"
          mode="spinner"
          prefix="$"
          suffix="USD"
          :style="inputStyle"
        />
      </a-flex>
    </a-flex>
  </a-flex>
</template>

<script lang="ts" setup>
const inputStyle = { width: '180px' };
</script>
