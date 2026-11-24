<docs>
---
order: 20
debug: true
title:
  zh-CN: Icon debug
  en-US: Icon debug
---

## zh-CN

特殊处理 Down icon。

## en-US

Specially handle Down icon.
</docs>

<template>
  <a-space wrap>
    <a-dropdown-button :menu="{ items: [] }">
      Submit
      <template #icon><DownOutlined /></template>
    </a-dropdown-button>
    <a-dropdown-button placement="top" :menu="{ items: [] }">
      Submit
      <template #icon><DownOutlined /></template>
    </a-dropdown-button>
    <a-space-compact>
      <a-button type="primary">Submit</a-button>
      <a-dropdown :menu="{ items: [] }">
        <a-button type="primary">
          <template #icon><DownOutlined /></template>
        </a-button>
      </a-dropdown>
    </a-space-compact>
    <a-space-compact>
      <a-button>Submit</a-button>
      <a-dropdown :menu="{ items: [] }" placement="top">
        <a-button>
          <template #icon><DownOutlined /></template>
        </a-button>
      </a-dropdown>
    </a-space-compact>
  </a-space>
</template>

<script lang="ts" setup>
import { DownOutlined } from '@ant-design/icons-vue';
</script>
