<docs>
---
order: 12
debug: true
title:
  zh-CN: 封面和操作区不渲染 body
  en-US: Cover and actions without body
---

## zh-CN

仅包含 `cover` 和 `actions` 时，不渲染空的 `.ant-card-body` 容器。

## en-US

When only `cover` and `actions` are provided without children, `.ant-card-body` is not rendered.
</docs>

<template>
  <a-card style="width: 300px; max-width: 100%">
    <template #cover>
      <img alt="example" :src="coverSrc" />
    </template>
    <template #actions>
      <span key="setting">setting</span>
      <span key="edit">edit</span>
    </template>
  </a-card>
</template>

<script lang="ts" setup>
const coverSrc =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20180%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23e6f4ff%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23bae0ff%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22300%22%20height%3D%22180%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22150%22%20cy%3D%2274%22%20r%3D%2232%22%20fill%3D%22%231677ff%22%2F%3E%3Cpath%20d%3D%22M96%20154c8-28%2028-44%2054-44s46%2016%2054%2044%22%20fill%3D%22%231677ff%22%2F%3E%3C%2Fsvg%3E';
</script>
