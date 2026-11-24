<docs>
---
order: 6
title:
  zh-CN: 面板图标
  en-US: Panel with icon
---

## zh-CN

在面板标题中加入图标。第三方图标库（如 lucide）渲染出的裸 `<svg>` 也会与标题文字垂直居中对齐。

## en-US

Add an icon to the panel title. A bare `<svg>` from a third-party icon library (e.g. lucide) stays vertically centred with the title text.
</docs>

<template>
  <a-collapse v-model:active-key="activeKey">
    <a-collapse-panel key="1">
      <template #header>
        <SmileOutlined />
        Panel with an Ant Design icon
      </template>
      <p>{{ text }}</p>
    </a-collapse-panel>
    <a-collapse-panel key="2">
      <template #header>
        <svg
          viewBox="0 0 24 24"
          width="1em"
          height="1em"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M3 3v18h18" />
          <path d="M7 14l4-4 3 3 5-6" />
        </svg>
        Panel with a third-party icon
      </template>
      <p>{{ text }}</p>
    </a-collapse-panel>
  </a-collapse>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { SmileOutlined } from '@ant-design/icons-vue';

const activeKey = ref(['1']);
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
</script>
