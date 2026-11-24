<docs>
---
order: 6
title:
  zh-CN: 预设状态的标签
  en-US: Status Tag
---

## zh-CN

预设五种状态颜色，可以通过设置 `color` 为 `success`、`processing`、`error`、`default`、`warning` 来代表不同的状态。

## en-US

We preset five different colors, you can set color property such as `success`, `processing`, `error`, `default` and `warning` to indicate specific status.

</docs>

<template>
  <div v-for="variant in variants" :key="variant">
    <a-divider title-placement="start">Status ({{ variant }})</a-divider>
    <a-flex gap="small" align="center" wrap>
      <a-tag color="success" :variant="variant">
        <template #icon>
          <CheckCircleOutlined />
        </template>
        success
      </a-tag>
      <a-tag color="processing" :variant="variant">
        <template #icon>
          <SyncOutlined :spin="true" />
        </template>
        processing
      </a-tag>
      <a-tag color="warning" :variant="variant">
        <template #icon>
          <ExclamationCircleOutlined />
        </template>
        warning
      </a-tag>
      <a-tag color="error" :variant="variant">
        <template #icon>
          <CloseCircleOutlined />
        </template>
        error
      </a-tag>
      <a-tag color="default" :variant="variant">
        <template #icon>
          <ClockCircleOutlined />
        </template>
        default
      </a-tag>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons-vue';

const variants = ['filled', 'solid', 'outlined'] as const;
</script>
