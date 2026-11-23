<docs>
---
order: 2
debug: true
title:
  zh-CN: 调试颜色与变体
  en-US: Debug Color & Variant
---

## zh-CN

调试使用

## en-US

Debug usage
</docs>

<template>
  <a-flex vertical gap="small" class="debug-color-variant-demo">
    <!-- link color -->
    <a-flex gap="small">
      <a-config-provider :theme="{ token: { colorLink: '#FF0000' } }">
        <a-button type="link">Link Button</a-button>
      </a-config-provider>
      <a-button type="link">Link Button</a-button>
    </a-flex>

    <!-- css specificity -->
    <a-flex gap="small" wrap="wrap">
      <a-button type="primary" class="spec-primary">Primary Button</a-button>
      <a-button type="default" class="spec-default">Default Button</a-button>
      <a-button type="dashed" class="spec-dashed">Dashed Button</a-button>
      <a-button type="text" class="spec-text">Text Button</a-button>
      <a-button type="link" class="spec-link">Link Button</a-button>
    </a-flex>

    <!-- Compatibility: legacy type classes -->
    <a-flex gap="small" wrap="wrap" class="original-cls-wrapper">
      <a-button type="primary">Primary Button</a-button>
      <a-button type="default">Default Button</a-button>
      <a-button type="dashed">Dashed Button</a-button>
      <a-button type="text">Text Button</a-button>
      <a-button type="link">Link Button</a-button>
    </a-flex>

    <!-- theme config -->
    <a-flex gap="small" wrap="wrap">
      <a-config-provider :theme="themeConfig">
        <a-button type="primary" variant="solid">Primary</a-button>
        <a-button color="primary" variant="solid">Solid primary</a-button>
        <a-button color="danger" variant="solid">Solid danger</a-button>
        <a-button type="default">Default</a-button>
        <a-button variant="outlined">Outlined</a-button>
        <a-button type="dashed">Dashed</a-button>
      </a-config-provider>
    </a-flex>

    <!-- semantic & preset colors x disabled / ghost / danger -->
    <a-flex gap="small" wrap="wrap">
      <a-button color="primary" variant="solid" disabled>Primary Disabled</a-button>
      <a-button color="danger" variant="filled">Danger Filled</a-button>
      <a-button color="danger" variant="outlined" disabled>Danger Disabled</a-button>
      <a-button color="purple" variant="solid">Purple Solid</a-button>
      <a-button color="cyan" variant="dashed" disabled>Cyan Disabled</a-button>
    </a-flex>
    <a-flex gap="small" wrap="wrap" class="debug-ghost-wrapper">
      <a-button color="primary" variant="solid" ghost>Primary Ghost</a-button>
      <a-button color="danger" variant="solid" ghost>Danger Ghost</a-button>
      <a-button color="pink" variant="outlined" ghost>Pink Ghost</a-button>
      <a-button color="purple" variant="solid" ghost disabled>Ghost Disabled</a-button>
    </a-flex>
  </a-flex>
</template>

<script lang="ts" setup>
import type { ConfigProviderProps } from 'ant-design-vue';

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    Button: {
      defaultHoverBg: 'orange',
      defaultActiveBg: 'blue',
      primaryColor: 'pink',
      dangerColor: 'green',
    } as Record<string, any>,
  },
};
</script>

<style scoped>
.debug-color-variant-demo :deep(.spec-primary) {
  background: #5794f7;
  border-color: blue;
  color: wheat;
}
.debug-color-variant-demo :deep(.spec-default),
.debug-color-variant-demo :deep(.spec-dashed) {
  border-color: gray;
  background: #f5f5f5;
  color: #313030;
}
.debug-color-variant-demo :deep(.spec-text) {
  color: gray;
}
.debug-color-variant-demo :deep(.spec-link) {
  color: blue;
}

.original-cls-wrapper :deep(.ant-btn-primary) {
  color: #ec5b56;
}
.original-cls-wrapper :deep(.ant-btn-default) {
  color: orange;
}
.original-cls-wrapper :deep(.ant-btn-dashed) {
  color: #3976f6;
}
.original-cls-wrapper :deep(.ant-btn-text) {
  color: green;
}
.original-cls-wrapper :deep(.ant-btn-link) {
  color: #0e98aa;
}

.debug-ghost-wrapper {
  padding: 12px;
  background: rgb(190, 200, 200);
  border-radius: var(--ant-border-radius, 6px);
}
</style>
