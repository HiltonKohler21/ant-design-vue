<docs>
---
order: 17.5
debug: true
title:
  zh-CN: 动态高度
  en-US: Dynamic Height
---

## zh-CN

可以通过 `placement` 手动指定弹出的位置。

## en-US

You can manually specify the position of the popup via `placement`.
</docs>

<template>
  <div
    :style="{
      minHeight: '320px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      width: '100%',
    }"
  >
    <a-space
      wrap
      :style="{
        position: 'absolute',
        top: '0',
        insetInlineStart: '0',
        insetInlineEnd: '0',
        justifyContent: 'center',
      }"
    >
      <a-radio-group v-model:value="placement">
        <a-radio-button value="topLeft">TL</a-radio-button>
        <a-radio-button value="topRight">TR</a-radio-button>
        <a-radio-button value="bottomLeft">BL</a-radio-button>
        <a-radio-button value="bottomRight">BR</a-radio-button>
      </a-radio-group>

      <a-switch v-model:checked="open" />
      <a-button @click="randomize">Random</a-button>
    </a-space>
    <a-select
      :open="open"
      :style="{ width: '120px' }"
      :placement="placement"
      :options="options"
      :popup-match-select-width="200"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { SelectProps } from 'ant-design-vue';

const randomOptions = (count?: number) => {
  const length = count ?? Math.floor(Math.random() * 5) + 1;
  return Array.from({ length }).map((_, index) => ({
    value: index,
    label: `Option ${index}`,
  }));
};

const placement = ref<SelectProps['placement']>('topLeft');
const open = ref(false);
const options = ref(randomOptions(3));

const randomize = () => {
  options.value = randomOptions();
};
</script>
