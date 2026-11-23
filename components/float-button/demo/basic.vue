<docs>
---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

最简单的用法。

## en-US

The most basic usage.

</docs>

<template>
  <a-float-button @click="handleClick" />
</template>

<script lang="ts" setup>
const handleClick = () => console.log('click');
</script>
