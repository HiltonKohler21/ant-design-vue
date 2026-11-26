<docs>
---
order: 4
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

使用全局线宽 Token。

## en-US

Use global line width token.
</docs>

<template>
  <a-flex :gap="24" wrap="wrap">
    <div style="width: 320px; max-width: 100%">
      <a-border-beam>
        <a-card title="Default line width">
          <a-typography-text type="secondary">
            Uses the default global lineWidth token from the current theme.
          </a-typography-text>
        </a-card>
      </a-border-beam>
    </div>
    <a-config-provider :theme="themeConfig">
      <div style="width: 320px; max-width: 100%">
        <a-border-beam>
          <a-card title="Custom line width">
            <a-typography-text type="secondary">
              Override lineWidth from theme.token.
            </a-typography-text>
          </a-card>
        </a-border-beam>
      </div>
    </a-config-provider>
  </a-flex>
</template>

<script lang="ts" setup>
import type { ConfigProviderProps } from '@hiltonkohler21/ant-design-vue';

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    BorderBeam: {
      lineWidth: 3,
    } as Record<string, any>,
  },
};
</script>
