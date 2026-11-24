<docs>
---
order: 9
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

Component Token Debug.

## en-US

Component Token Debug.
</docs>

<template>
  <a-config-provider :theme="theme">
    <a-pagination
      v-model:current="current"
      show-size-changer
      :total="500"
      show-quick-jumper
      :show-total="total => `Total ${total} items`"
    >
      <template #itemRender="{ type, originalElement }">
        <a v-if="type === 'prev'">Previous</a>
        <a v-else-if="type === 'next'">Next</a>
        <component :is="originalElement" v-else />
      </template>
    </a-pagination>
    <br />
    <a-pagination v-model:current="disabledCurrent" show-size-changer :total="500" disabled />
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ConfigProviderProps } from 'ant-design-vue';

const current = ref<number>(3);
const disabledCurrent = ref<number>(3);

const theme: ConfigProviderProps['theme'] = {
  components: {
    Pagination: {
      itemSize: 20,
      itemSizeSM: 12,
      itemActiveBg: '#e7cc87',
      itemActiveColor: '#eee',
      itemActiveColorHover: '#fff',
      itemLinkBg: '#344324',
      itemActiveBgDisabled: '#9c1515',
      itemInputBg: '#9c1515',
      miniOptionsSizeChangerTop: 0,
      itemBg: '#b5f5ec',
    } as Record<string, any>,
  },
};
</script>
