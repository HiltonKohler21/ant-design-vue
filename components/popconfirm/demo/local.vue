<docs>
---
order: 1
title:
  zh-CN: 国际化
  en-US: Locale text
---

## zh-CN

使用 `okText` 和 `cancelText` 自定义按钮文字。

## en-US

Set `okText` and `cancelText` props to customize the button's labels.

</docs>

<template>
  <a-popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    ok-text="Yes"
    cancel-text="No"
  >
    <a-button danger>Delete</a-button>
  </a-popconfirm>
</template>
