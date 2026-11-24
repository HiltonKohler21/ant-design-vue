<docs>
---
order: 0
title:
  zh-CN: 基本用法
  en-US: Basic
---

## zh-CN

初始化面板大小，面板大小限制。

## en-US

Initialize panel size, panel size limit.

</docs>

<template>
  <a-splitter style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)">
    <a-splitter-panel default-size="40%" min="20%" max="70%">
      <a-flex justify="center" align="center" style="height: 100%">
        <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
          First
        </a-typography-title>
      </a-flex>
    </a-splitter-panel>
    <a-splitter-panel>
      <a-flex justify="center" align="center" style="height: 100%">
        <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
          Second
        </a-typography-title>
      </a-flex>
    </a-splitter-panel>
  </a-splitter>
</template>
