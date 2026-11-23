<docs>
---
order: 1
title:
  zh-CN: 多色图标
  en-US: Two-tone icon and colorful icon
---

## zh-CN

双色图标可以通过 `two-tone-color` 属性设置主题色。

## en-US

You can set the `two-tone-color` prop to a specific primary color for two-tone icons.

</docs>

<template>
  <a-space>
    <smile-two-tone />
    <heart-two-tone two-tone-color="#eb2f96" />
    <check-circle-two-tone two-tone-color="#52c41a" />
  </a-space>
</template>
<script lang="ts" setup>
import { SmileTwoTone, HeartTwoTone, CheckCircleTwoTone } from '@ant-design/icons-vue';
</script>
