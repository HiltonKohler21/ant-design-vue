<docs>
---
order: 11
debug: true
title:
  zh-CN: 自定义组件 Token
  en-US: Custom component token
---

## zh-CN

自定义组件 Token。

## en-US

Custom component token.
</docs>

<template>
  <a-config-provider :theme="themeConfig">
    <a-image-preview-group :preview="previewConfig">
      <a-space wrap>
        <a-image
          :width="150"
          alt="svg image"
          src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
        />
        <a-image
          :width="150"
          alt="basic image"
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      </a-space>
    </a-image-preview-group>
  </a-config-provider>
</template>

<script lang="ts" setup>
import type { ConfigProviderProps } from 'ant-design-vue';

const previewConfig = {
  countRender: (current: number, total: number) => `Current ${current} / Total ${total}`,
};

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    Image: {
      previewOperationSize: 20,
      previewOperationColor: '#222',
      previewOperationColorDisabled: '#b20000',
    } as Record<string, any>,
  },
};
</script>
