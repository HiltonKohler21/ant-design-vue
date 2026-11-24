<docs>
---
order: 12
version: 4.3.0
title:
  zh-CN: 禁用指定滑块
  en-US: Disabled per handle
---

## zh-CN

在范围模式下，可以通过为 `disabled` 传入布尔数组来单独禁用指定的滑块手柄。

## en-US

In range mode, pass a boolean array to `disabled` to disable specific slider handles individually.
</docs>

<template>
  <div>
    <a-slider
      v-model:value="value"
      :range="{ draggableTrack: true, minCount: 2, maxCount: 5 }"
      :disabled="disabled"
    />
    <a-flex
      gap="small"
      wrap="wrap"
      align="center"
      justify="flex-start"
      :style="{ marginTop: '16px' }"
    >
      <a-checkbox
        v-for="(handle, index) in handleOptions"
        :key="`item-${handle.key}`"
        :checked="disabled[index]"
        @change="(e: any) => handleDisabledChange(index, e.target.checked)"
      >
        {{ handle.label }}
      </a-checkbox>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const handleOptions = [
  { key: 'start', label: 'Disabled Handle 1' },
  { key: 'middle', label: 'Disabled Handle 2' },
  { key: 'end', label: 'Disabled Handle 3' },
];

const value = ref<number[]>([20, 50, 80]);
const disabled = ref<boolean[]>([false, false, false]);

const handleDisabledChange = (index: number, checked: boolean) => {
  const next = [...disabled.value];
  next[index] = checked;
  disabled.value = next;
};
</script>
