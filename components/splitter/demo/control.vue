<docs>
---
order: 5
title:
  zh-CN: 受控尺寸
  en-US: Controlled Size
---

## zh-CN

通过 `size` 与事件受控更新尺寸。

## en-US

Controlled size through `size` property and resize events.

</docs>
<template>
  <a-space direction="vertical" style="width: 100%">
    <a-space>
      <a-button @click="sizes = [100]">Set 100px</a-button>
      <a-button @click="sizes = [200]">Set 200px</a-button>
      <a-button @click="sizes = ['50%', '50%']">Reset 50%</a-button>
    </a-space>
    <a-splitter
      style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px"
      @resize="s => (sizes = s)"
    >
      <a-splitter-panel :size="sizes[0]">
        <div style="padding: 16px">
          Size: {{ typeof sizes[0] === 'number' ? `${Math.round(sizes[0])}px` : sizes[0] }}
        </div>
      </a-splitter-panel>
      <a-splitter-panel :size="sizes[1]">
        <div style="padding: 16px">Flexible Panel</div>
      </a-splitter-panel>
    </a-splitter>
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const sizes = ref<(number | string)[]>([150]);
</script>
