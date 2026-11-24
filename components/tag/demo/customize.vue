<docs>
---
order: 7
debug: true
title:
  zh-CN: 自定义关闭按钮
  en-US: Customize close
---

## zh-CN

可用 `closeIcon` 自定义关闭按钮。

## en-US

The close icon can be customized using `closeIcon`.
</docs>

<template>
  <a-flex gap="small" align="center" wrap>
    <a-tag closable close-icon="Close">Tag1</a-tag>
    <a-tag closable>
      <template #closeIcon>
        <CloseCircleOutlined />
      </template>
      Tag2
    </a-tag>
  </a-flex>
</template>

<script lang="ts" setup>
import { CloseCircleOutlined } from '@ant-design/icons-vue';
</script>
