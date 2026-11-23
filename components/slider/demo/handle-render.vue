<docs>
---
order: 9
title:
  zh-CN: 自定义滑块渲染与完成回调
  en-US: Custom Handle Render & Change Complete
---

## zh-CN

通过 `handleRender` 自定义滑块与提示渲染，并通过 `@change-complete`（`onChangeComplete`）监听拖拽完成后的最终值。

## en-US

Customize handle rendering with `handleRender` and listen for committed values via `@change-complete` (`onChangeComplete`).

</docs>

<template>
  <a-space direction="vertical" style="width: 100%">
    <a-slider
      v-model:value="singleValue"
      :handle-render="handleRender"
      @change-complete="onSingleComplete"
    />
    <a-slider
      v-model:value="rangeValue"
      range
      :handle-render="handleRender"
      @change-complete="onRangeComplete"
    />
    <a-typography-text type="secondary">
      Last committed — Single: {{ lastSingle }}, Range: [{{ lastRange[0] }}, {{ lastRange[1] }}]
    </a-typography-text>
  </a-space>
</template>

<script lang="ts" setup>
import { cloneVNode, ref } from 'vue';
import type { SliderProps } from 'ant-design-vue';

const singleValue = ref<number>(30);
const rangeValue = ref<[number, number]>([20, 60]);
const lastSingle = ref<number>(30);
const lastRange = ref<[number, number]>([20, 60]);

const handleRender: SliderProps['handleRender'] = (node, info) => {
  return cloneVNode(node, {
    color: info.dragging ? '#1677ff' : '#52c41a',
    title: `#${info.index + 1}: ${info.value}%`,
  });
};

const onSingleComplete = (val: number | [number, number]) => {
  if (typeof val === 'number') {
    lastSingle.value = val;
  }
};

const onRangeComplete = (val: number | [number, number]) => {
  if (Array.isArray(val)) {
    lastRange.value = val;
  }
};
</script>
