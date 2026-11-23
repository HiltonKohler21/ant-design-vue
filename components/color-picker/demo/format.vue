<docs>
---
order: 8
title:
  zh-CN: 颜色编码
  en-US: Color Format
---

## zh-CN

支持受控的颜色格式（HEX / RGB / HSB）。

## en-US

Controlled color formats (HEX / RGB / HSB).

</docs>
<template>
  <a-space direction="vertical" :size="12">
    <a-space>
      <a-radio-group v-model:value="format" button-style="solid">
        <a-radio-button value="hex">HEX</a-radio-button>
        <a-radio-button value="rgb">RGB</a-radio-button>
        <a-radio-button value="hsb">HSB</a-radio-button>
      </a-radio-group>
    </a-space>
    <a-color-picker
      defaultValue="#1677ff"
      :format="format"
      @formatChange="val => (format = val)"
      showText
    />
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const format = ref<'hex' | 'rgb' | 'hsb'>('hex');
</script>
