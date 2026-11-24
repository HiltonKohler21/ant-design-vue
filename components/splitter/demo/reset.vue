<docs>
---
order: 10
version: 4.3.0
title:
  zh-CN: 双击重置
  en-US: Double-clicked reset
---

## zh-CN

通过监听 `draggerDoubleClick` 事件，在双击拖拽条时重置面板尺寸。

## en-US

Reset panel sizes by double-clicking the dragger via the `draggerDoubleClick` event.

</docs>
<template>
  <a-splitter
    style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px"
    @resize="handleResize"
    @dragger-double-click="handleDoubleClick"
  >
    <a-splitter-panel :size="sizes[0]">
      <a-flex justify="center" align="center" style="height: 100%">
        <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
          Panel 1
        </a-typography-title>
      </a-flex>
    </a-splitter-panel>
    <a-splitter-panel :size="sizes[1]">
      <a-flex justify="center" align="center" style="height: 100%">
        <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
          Panel 2
        </a-typography-title>
      </a-flex>
    </a-splitter-panel>
    <a-splitter-panel :size="sizes[2]">
      <a-flex justify="center" align="center" style="height: 100%">
        <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
          Panel 3
        </a-typography-title>
      </a-flex>
    </a-splitter-panel>
  </a-splitter>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const defaultSizes: (number | string)[] = ['30%', '40%', '30%'];
const sizes = ref<(number | string)[]>([...defaultSizes]);

const handleResize = (nextSizes: number[]) => {
  sizes.value = nextSizes;
};

const handleDoubleClick = () => {
  sizes.value = [...defaultSizes];
};
</script>
