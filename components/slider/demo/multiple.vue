<docs>
---
order: 10
title:
  zh-CN: 多点组合
  en-US: Multiple handles
---

## zh-CN

多点组合滑动输入条，结合 `styles.tracks` 与 `styles.track` 可实现跨多段轨道的渐变色彩。

## en-US

Support multiple handles in `range` mode, combined with `styles.tracks` and `styles.track` for gradient tracks.
</docs>

<template>
  <a-slider v-model:value="value" range :styles="sliderStyles" />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { SliderProps } from 'ant-design-vue';

function getGradientColor(percentage: number) {
  const startColor = [135, 208, 104];
  const endColor = [255, 204, 199];

  const midColor = startColor.map((start, i) => {
    const end = endColor[i];
    const delta = end - start;
    return (start + delta * percentage).toFixed(0);
  });

  return `rgb(${midColor.join(',')})`;
}

const value = ref<number[]>([0, 10, 20]);

const sliderStyles = computed<SliderProps['styles']>(() => {
  const start = (value.value[0] ?? 0) / 100;
  const end = (value.value[value.value.length - 1] ?? 100) / 100;
  return {
    track: {
      background: 'transparent',
    },
    tracks: {
      background: `linear-gradient(to right, ${getGradientColor(start)} 0%, ${getGradientColor(
        end,
      )} 100%)`,
    },
  };
});
</script>
