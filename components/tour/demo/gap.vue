<docs>
---
order: 6
title:
  zh-CN: 自定义高亮区域的样式
  en-US: Custom highlighted area style
---

## zh-CN

使用 `gap` 参数来控制高亮区域的边距和圆角。

- 自 `4.3.0` 起支持单独设置两个方向上的边距和数组类型的 `offset` 参数。

## en-US

Using `gap` to control the radius of highlight area and the offset between highlight area and the element.

- Setting offset in two directions individually and `offset` with array type is supported since `4.3.0`.
</docs>

<template>
  <div ref="tourNodeRef">
    <a-button type="primary" @click="open = true">Begin Tour</a-button>
    <a-space direction="vertical" :style="{ display: 'flex', marginTop: '12px' }">
      <a-row>
        <a-col :span="6">
          <a-typography-text>Radius:</a-typography-text>
        </a-col>
        <a-col :span="12">
          <a-slider v-model:value="radius" />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">
          <a-typography-text>Offset:</a-typography-text>
        </a-col>
        <a-col :span="12">
          <a-slider v-model:value="offset" :max="50" @focus="offsetDirection = 'both'" />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">
          <a-typography-text>Horizontal offset:</a-typography-text>
        </a-col>
        <a-col :span="12">
          <a-slider v-model:value="offsetX" :max="50" @focus="offsetDirection = 'individual'" />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">
          <a-typography-text>Vertical offset:</a-typography-text>
        </a-col>
        <a-col :span="12">
          <a-slider v-model:value="offsetY" :max="50" @focus="offsetDirection = 'individual'" />
        </a-col>
      </a-row>
    </a-space>
    <a-tour :open="open" :steps="steps" :gap="mergedGap" @close="open = false" />
  </div>
</template>

<script lang="ts" setup>
import { computed, createVNode, ref } from 'vue';
import type { TourProps } from 'ant-design-vue';

const tourNodeRef = ref<HTMLDivElement | null>(null);
const radius = ref<number>(8);
const offsetX = ref<number>(2);
const offsetY = ref<number>(2);
const offset = ref<number>(2);
const open = ref<boolean>(false);
const offsetDirection = ref<'both' | 'individual'>('individual');

const steps: TourProps['steps'] = [
  {
    title: 'Upload File',
    description: 'Put your files here.',
    cover: createVNode('img', {
      draggable: false,
      alt: 'tour.png',
      src: 'https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png',
    }),
    target: () => tourNodeRef.value,
  },
];

const mergedGap = computed(() => {
  const offsetGap =
    offsetDirection.value === 'both'
      ? { offset: offset.value }
      : { offset: [offsetX.value, offsetY.value] as [number, number] };
  return {
    ...offsetGap,
    radius: radius.value,
  };
});
</script>
