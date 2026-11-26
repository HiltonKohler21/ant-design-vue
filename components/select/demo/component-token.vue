<docs>
---
order: 21
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

组件 Token

## en-US

Component Token
</docs>

<template>
  <a-space vertical style="width: 100%">
    <a-config-provider :theme="theme1">
      <a-space style="width: 100%" vertical>
        <a-select
          mode="multiple"
          allow-clear
          style="width: 100%"
          placeholder="Please select"
          :default-value="['a10', 'c12']"
          :options="options"
        />
        <a-select
          mode="multiple"
          disabled
          style="width: 100%"
          placeholder="Please select"
          :default-value="['a10', 'c12']"
          :options="options"
        />
      </a-space>
    </a-config-provider>
    <a-config-provider :theme="theme2">
      <a-space style="width: 100%" vertical>
        <a-select
          mode="multiple"
          allow-clear
          size="small"
          style="width: 100%"
          placeholder="Please select"
          :default-value="['a10', 'c12']"
          :options="options"
        />
        <a-select
          mode="multiple"
          allow-clear
          style="width: 100%"
          placeholder="Please select"
          :default-value="['a10', 'c12']"
          :options="options"
        />
      </a-space>
    </a-config-provider>
    <a-config-provider :theme="theme3">
      <a-space style="width: 100%" vertical>
        <a-select style="width: 100%" default-value="a10" :options="options" />
        <a-select
          mode="multiple"
          style="width: 100%"
          :default-value="['a10', 'c12']"
          :options="options"
        />
      </a-space>
    </a-config-provider>
  </a-space>
</template>

<script lang="ts" setup>
import type { ConfigProviderProps, SelectProps } from '@hiltonkohler21/ant-design-vue';

type Theme = ConfigProviderProps['theme'];

const options: SelectProps['options'] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    label: i.toString(36) + i,
    value: i.toString(36) + i,
  });
}

const theme1: Theme = {
  components: {
    Select: {
      multipleItemBorderColor: 'rgba(0,0,0,0.06)',
      multipleItemBorderColorDisabled: 'rgba(0,0,0,0.06)',
      optionSelectedColor: '#1677ff',
      hoverBorderColor: 'red',
      activeBorderColor: 'green',
      activeOutlineColor: 'pink',
    } as Record<string, any>,
  },
};

const theme2: Theme = {
  token: {
    controlHeightSM: 28,
  },
};

const theme3: Theme = {
  components: {
    Select: {
      paddingXXS: 0,
      controlHeight: 28,
    } as Record<string, any>,
  },
};
</script>
