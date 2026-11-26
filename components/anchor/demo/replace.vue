<docs>
---
order: 8
title:
  zh-CN: 替换历史中的 href
  en-US: Replace href in history
---

## zh-CN

替换浏览器历史记录中的路径，后退按钮将返回到上一页而不是上一个锚点。

## en-US

Replace path in browser history, so back button returns to previous page instead of previous anchor item.
</docs>

<template>
  <div ref="containerRef" :style="{ height: '200px', overflowY: 'auto' }">
    <a-row>
      <a-col :span="16">
        <div
          id="replace-part-1"
          :style="{ height: '160px', background: 'rgba(255, 0, 0, 0.04)', padding: '8px' }"
        >
          Part 1
        </div>
        <div
          id="replace-part-2"
          :style="{ height: '160px', background: 'rgba(0, 255, 0, 0.04)', padding: '8px' }"
        >
          Part 2
        </div>
        <div
          id="replace-part-3"
          :style="{ height: '160px', background: 'rgba(0, 0, 255, 0.04)', padding: '8px' }"
        >
          Part 3
        </div>
      </a-col>
      <a-col :span="8">
        <div :style="{ position: 'sticky', top: '0px' }">
          <a-anchor replace :affix="false" :get-container="getContainer" :items="items" />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { AnchorProps } from '@hiltonkohler21/ant-design-vue';

const containerRef = ref<HTMLDivElement | null>(null);
const getContainer = () => containerRef.value || window;

const items: AnchorProps['items'] = [
  {
    key: 'part-1',
    href: '#replace-part-1',
    title: 'Part 1',
  },
  {
    key: 'part-2',
    href: '#replace-part-2',
    title: 'Part 2',
  },
  {
    key: 'part-3',
    href: '#replace-part-3',
    title: 'Part 3',
  },
];
</script>
