<docs>
---
order: 10
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

组件 token debug

## en-US

Component Token debug.
</docs>

<template>
  <a-config-provider :theme="theme">
    <a-space direction="vertical">
      <a-radio :checked="true">Test</a-radio>
      <a-radio :checked="true" disabled>Disabled</a-radio>
      <a-radio-group v-model:value="value1">
        <a-radio-button value="a">Hangzhou</a-radio-button>
        <a-radio-button value="b">Shanghai</a-radio-button>
        <a-radio-button value="c">Beijing</a-radio-button>
        <a-radio-button value="d">Chengdu</a-radio-button>
      </a-radio-group>
      <a-radio-group v-model:value="value2" disabled>
        <a-radio-button value="a">Hangzhou</a-radio-button>
        <a-radio-button value="b">Shanghai</a-radio-button>
        <a-radio-button value="c">Beijing</a-radio-button>
        <a-radio-button value="d">Chengdu</a-radio-button>
      </a-radio-group>
      <a-radio-group v-model:value="value3" button-style="solid">
        <a-radio-button value="a">Hangzhou</a-radio-button>
        <a-radio-button value="b">Shanghai</a-radio-button>
        <a-radio-button value="c">Beijing</a-radio-button>
        <a-radio-button value="d">Chengdu</a-radio-button>
      </a-radio-group>
    </a-space>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ConfigProviderProps } from '@hiltonkohler21/ant-design-vue';

const value1 = ref<string>('a');
const value2 = ref<string>('a');
const value3 = ref<string>('a');

const theme: ConfigProviderProps['theme'] = {
  components: {
    Radio: {
      radioSize: 20,
      dotSize: 10,
      dotColorDisabled: 'grey',
      buttonBg: '#f6ffed',
      buttonCheckedBg: '#d9f7be',
      buttonColor: '#faad14',
      buttonPaddingInline: 20,
      buttonCheckedBgDisabled: '#fffbe6',
      buttonCheckedColorDisabled: '#ffe58f',
      buttonSolidCheckedColor: '#ffa39e',
      wrapperMarginInlineEnd: 20,
    } as Record<string, any>,
  },
};
</script>
