<docs>
---
order: 6
version: 4.3.0
debug: true
title:
  zh-CN: 每个链接单独的滚动偏移量
  en-US: Set scroll offset per link
---

## zh-CN

通过为每个 Anchor.Link 设置 `targetOffset` 属性，可以为每个链接单独设置滚动偏移量。链接级别的 `targetOffset` 优先级高于全局的 `targetOffset`。

## en-US

You can set different `targetOffset` for each Anchor.Link. The link-level `targetOffset` takes precedence over the global `targetOffset` prop of the Anchor component.
</docs>

<template>
  <div ref="containerRef" :style="{ height: '200px', overflowY: 'auto', position: 'relative' }">
    <div :style="fixedHeaderStyle">Fixed Top Block</div>
    <a-row>
      <a-col :span="14">
        <div
          id="per-link-part-1"
          :style="{ height: '160px', background: 'rgba(255, 0, 0, 0.2)', padding: '8px' }"
        >
          Part 1
        </div>
        <div
          id="per-link-part-2"
          :style="{ height: '160px', background: 'rgba(0, 255, 0, 0.2)', padding: '8px' }"
        >
          Part 2
        </div>
        <div
          id="per-link-part-3"
          :style="{ height: '160px', background: 'rgba(0, 0, 255, 0.2)', padding: '8px' }"
        >
          Part 3
        </div>
        <div
          id="per-link-part-4"
          :style="{ height: '160px', background: 'rgba(0, 255, 229, 0.2)', padding: '8px' }"
        >
          Part 4
        </div>
      </a-col>
      <a-col :span="10">
        <div :style="{ position: 'sticky', top: '24px' }">
          <a-anchor
            :affix="false"
            :target-offset="20"
            :get-container="getContainer"
            :items="items"
          />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { CSSProperties } from 'vue';
import type { AnchorProps } from 'ant-design-vue';

const containerRef = ref<HTMLDivElement | null>(null);
const getContainer = () => containerRef.value || window;

const fixedHeaderStyle: CSSProperties = {
  height: '20px',
  lineHeight: '20px',
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  position: 'sticky',
  top: '0px',
  zIndex: 1,
  width: '100%',
  color: '#fff',
  paddingInline: '8px',
  fontSize: '12px',
};

const items: AnchorProps['items'] = [
  {
    key: 'part-1',
    href: '#per-link-part-1',
    title: 'Part 1',
  },
  {
    key: 'part-2',
    href: '#per-link-part-2',
    title: 'Part 2 (targetOffset: 50)',
    targetOffset: 50,
  },
  {
    key: 'part-3',
    href: '#per-link-part-3',
    title: 'Part 3 (targetOffset: 50)',
    targetOffset: 50,
  },
  {
    key: 'part-4',
    href: '#per-link-part-4',
    title: 'Part 4 (global: 20)',
  },
];
</script>
