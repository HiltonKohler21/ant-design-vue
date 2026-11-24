<docs>
---
order: 7
title:
  zh-CN: 受控模式
  en-US: Controlled mode
---

## zh-CN

通过 `open` 设置组件为受控模式，需要配合 `trigger` 一起使用。

## en-US

Set the component to controlled mode through `open`, which need to be used together with `trigger`.
</docs>

<template>
  <div
    :style="{
      position: 'relative',
      height: '260px',
      overflow: 'hidden',
      padding: '16px',
      border: '1px solid var(--ant-color-border-secondary, rgba(0, 0, 0, 0.06))',
      borderRadius: '8px',
    }"
  >
    <a-switch v-model:checked="open" />
    <a-float-button-group
      :open="open"
      trigger="click"
      :style="{ position: 'absolute', insetInlineEnd: '24px', bottom: '24px' }"
    >
      <template #icon>
        <CustomerServiceOutlined />
      </template>
      <a-float-button />
      <a-float-button />
      <a-float-button>
        <template #icon>
          <CommentOutlined />
        </template>
      </a-float-button>
    </a-float-button-group>
    <a-float-button-group
      :open="open"
      shape="square"
      trigger="click"
      :style="{ position: 'absolute', insetInlineEnd: '88px', bottom: '24px' }"
    >
      <template #icon>
        <CustomerServiceOutlined />
      </template>
      <a-float-button />
      <a-float-button />
      <a-float-button>
        <template #icon>
          <CommentOutlined />
        </template>
      </a-float-button>
    </a-float-button-group>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { CommentOutlined, CustomerServiceOutlined } from '@ant-design/icons-vue';

const open = ref(true);
</script>
