<docs>
---
order: 101
debug: true
title:
  zh-CN: Borderless 高度对齐
  en-US: Borderless height alignment
---

## zh-CN

Borderless 形态下与 Input、Select 的高度对齐验证。

## en-US

Verify borderless height alignment with Input and Select.
</docs>

<template>
  <a-flex vertical :gap="16">
    <a-flex :gap="8" align="center" wrap="wrap">
      <a-input-number :style="boxStyle" variant="borderless" size="large" />
      <a-input :style="boxStyle" variant="borderless" size="large" />
      <a-select :style="boxStyle" variant="borderless" size="large" />
    </a-flex>
    <a-flex :gap="8" align="center" wrap="wrap">
      <a-input-number :style="boxStyle" variant="borderless" />
      <a-input :style="boxStyle" variant="borderless" />
      <a-select :style="boxStyle" variant="borderless" />
    </a-flex>
    <a-flex :gap="8" align="center" wrap="wrap">
      <a-input-number :style="boxStyle" variant="borderless" size="small" />
      <a-input :style="boxStyle" variant="borderless" size="small" />
      <a-select :style="boxStyle" variant="borderless" size="small" />
    </a-flex>
  </a-flex>
</template>

<script lang="ts" setup>
const boxStyle = { width: '100px', background: 'lightpink' };
</script>
