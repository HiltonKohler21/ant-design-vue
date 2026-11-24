<docs>
---
order: 9
version: 4.3.0
title:
  zh-CN: Flex 响应式布局
  en-US: Flex Responsive
---

## zh-CN

支持更灵活的响应式下的任意 flex 比例，该功能需要浏览器支持 CSS Variables。

## en-US

Support much more flexible responsive flex ratio, which requires CSS Variables supported by browser.

</docs>

<template>
  <a-row>
    <a-col
      v-for="index in 10"
      :key="`col-${index}`"
      :xs="{ flex: '100%' }"
      :sm="{ flex: '50%' }"
      :md="{ flex: '40%' }"
      :lg="{ flex: '20%' }"
      :xl="{ flex: '10%' }"
    >
      Col
    </a-col>
  </a-row>
</template>
