<docs>
---
order: 104
debug: true
title:
  zh-CN: 覆盖组件样式
  en-US: Override Component Style
---

## zh-CN

使用组件 Token 覆盖 InputNumber 样式。

## en-US

Override InputNumber style via component tokens.
</docs>

<template>
  <a-config-provider :theme="themeOuter">
    <a-space wrap>
      <a-input-number />
      <a-config-provider :theme="themeInnerHandle">
        <a-input-number />
      </a-config-provider>

      <a-config-provider :theme="themePadding">
        <a-space wrap>
          <a-input-number size="large" />
          <a-input-number size="large" prefix="$" />
        </a-space>
      </a-config-provider>

      <a-config-provider :theme="themeFontSize">
        <a-space wrap>
          <a-input-number :default-value="11111" size="small" />
          <a-input-number :default-value="11111" />
          <a-input-number :default-value="11111" size="large" />
        </a-space>
      </a-config-provider>
    </a-space>
  </a-config-provider>
</template>

<script lang="ts" setup>
import type { ConfigProviderProps } from '@hiltonkohler21/ant-design-vue';

const themeOuter: ConfigProviderProps['theme'] = {
  components: {
    InputNumber: {
      handleWidth: 50,
    },
  },
};

const themeInnerHandle: ConfigProviderProps['theme'] = {
  components: {
    InputNumber: {
      handleWidth: 25,
    },
  },
};

const themePadding: ConfigProviderProps['theme'] = {
  components: {
    InputNumber: {
      paddingBlockLG: 12,
      paddingInlineLG: 16,
    } as Record<string, any>,
  },
};

const themeFontSize: ConfigProviderProps['theme'] = {
  components: {
    InputNumber: {
      inputFontSize: 30,
      inputFontSizeSM: 20,
      inputFontSizeLG: 40,
    } as Record<string, any>,
  },
};
</script>
