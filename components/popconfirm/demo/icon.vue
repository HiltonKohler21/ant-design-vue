<docs>
---
order: 5
title:
  zh-CN: 自定义 Icon 图标
  en-US: Customize icon
---

## zh-CN

自定义提示 `icon`。

## en-US

Set `icon` props to customize the icon.

</docs>

<template>
  <a-popconfirm title="Delete the task" description="Are you sure to delete this task?">
    <template #icon><question-circle-outlined style="color: red" /></template>
    <a-button danger>Delete</a-button>
  </a-popconfirm>
</template>
<script lang="ts" setup>
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
</script>
