<docs>
---
order: 5
debug: true
title:
  zh-CN: 调试专用
  en-US: Debug
---

## zh-CN

调试专用。

## en-US

Use for debug.

</docs>

<template>
  <div>
    <a-flex vertical>
      <div
        v-for="i in 4"
        :key="`v-${i}`"
        :style="{
          height: '60px',
          backgroundColor: (i - 1) % 2 ? '#1677ff' : '#1677ffbf',
        }"
      />
    </a-flex>
    <a-flex style="margin-top: 20px">
      <div
        v-for="i in 4"
        :key="`h-${i}`"
        :style="{
          width: '25%',
          height: (i - 1) % 2 ? '60px' : '40px',
          backgroundColor: (i - 1) % 2 ? '#1677ff' : '#1677ffbf',
        }"
      />
    </a-flex>
  </div>
</template>
