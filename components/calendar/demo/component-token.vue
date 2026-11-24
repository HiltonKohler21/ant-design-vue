<docs>
---
order: 5
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
  <a-config-provider :theme="themeConfig">
    <a-calendar v-model:value="value1" @panelChange="onPanelChange" />
    <br />
    <a-calendar v-model:value="value2" :fullscreen="false" @panelChange="onPanelChange" />
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Dayjs } from 'dayjs';
import type { ConfigProviderProps } from 'ant-design-vue';

const value1 = ref<Dayjs>();
const value2 = ref<Dayjs>();

const onPanelChange = (val: Dayjs, mode: string) => {
  console.log(val.format('YYYY-MM-DD'), mode);
};

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    Calendar: {
      fullBg: 'red',
      fullPanelBg: 'green',
      itemActiveBg: 'black',
    } as Record<string, any>,
  },
};
</script>
