<docs>
---
order: 10
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Anchor 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Anchor by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <div ref="containerRef" :style="{ height: '200px', overflowY: 'auto' }">
    <a-row>
      <a-col :span="16">
        <div
          id="semantic-part-1"
          :style="{ height: '160px', background: 'rgba(255, 0, 0, 0.08)', padding: '8px' }"
        >
          Part 1
        </div>
        <div
          id="semantic-part-2"
          :style="{ height: '160px', background: 'rgba(0, 255, 0, 0.08)', padding: '8px' }"
        >
          Part 2
        </div>
        <div
          id="semantic-part-3"
          :style="{ height: '160px', background: 'rgba(0, 0, 255, 0.08)', padding: '8px' }"
        >
          Part 3
        </div>
      </a-col>
      <a-col :span="8">
        <div :style="{ position: 'sticky', top: '0px' }">
          <a-anchor
            replace
            :affix="false"
            :get-container="getContainer"
            :items="items"
            :styles="stylesFn"
            :class-names="classNamesObject"
          />
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

const classNamesObject: AnchorProps['classNames'] = {
  root: 'demo-anchor-root',
  item: 'demo-anchor-item',
  itemTitle: 'demo-anchor-title',
  indicator: 'demo-anchor-indicator',
};

const stylesFn: AnchorProps['styles'] = info => {
  if (info.props.direction === 'vertical') {
    return {
      root: {
        backgroundColor: 'rgba(255, 251, 230, 0.5)',
        padding: '8px',
        borderRadius: '6px',
      },
      itemTitle: {
        fontWeight: '500',
      },
    };
  }
  return {};
};

const items: AnchorProps['items'] = [
  {
    key: 'part-1',
    href: '#semantic-part-1',
    title: 'Part 1',
  },
  {
    key: 'part-2',
    href: '#semantic-part-2',
    title: 'Part 2',
  },
  {
    key: 'part-3',
    href: '#semantic-part-3',
    title: 'Part 3',
  },
];
</script>
