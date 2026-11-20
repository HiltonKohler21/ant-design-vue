<docs>
---
order: 7
title:
  zh-CN: 回到顶部
  en-US: BackTop
---

## zh-CN

返回页面顶部的操作按钮。

## en-US

`BackTop` makes it easy to go back to the top of the page.

</docs>

<template>
  <div
    id="components-float-button-demo-back-top-scroll"
    :style="{
      height: '240px',
      overflow: 'auto',
      padding: '16px',
      border: '1px solid rgba(0, 0, 0, 0.06)',
      borderRadius: '8px',
    }"
  >
    <a-float-button-back-top
      :target="() => getTarget()"
      :visibility-height="50"
      :style="{ position: 'absolute', right: '24px', bottom: '24px' }"
    />
    <p style="color: #999">向下滚动查看右下角回到顶部按钮</p>
    <div v-for="i in 30" :key="i" style="line-height: 28px">
      滚动内容行 {{ i }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const getTarget = () => document.getElementById('components-float-button-demo-back-top-scroll');
</script>
