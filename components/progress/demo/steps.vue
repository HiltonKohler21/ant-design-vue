<docs>
---
order: 11
title:
  zh-CN: 步骤进度条
  en-US: Progress bar with steps
---

## zh-CN

带步骤的进度条。

## en-US

A progress bar with steps.

</docs>

<template>
  <a-flex gap="small" vertical>
    <a-progress :percent="50" :steps="3" />
    <a-progress :percent="30" :steps="5" />
    <a-progress :percent="100" :steps="5" size="small" :stroke-color="green[6]" />
    <a-progress :percent="60" :steps="5" :stroke-color="[green[6], green[6], red[5]]" />
  </a-flex>
</template>
<script lang="ts" setup>
import { green, red } from '@ant-design/colors';
</script>
