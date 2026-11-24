<docs>
---
order: 10
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 QRCode 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of QRCode by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <div class="demo-qrcode-style-class">
    <a-flex wrap="wrap" :gap="16">
      <a-qrcode
        value="https://www.antdv.com/"
        :size="160"
        :class-names="classNames"
        :styles="stylesObject"
      />
      <a-qrcode
        value="https://www.antdv.com/"
        :size="160"
        type="canvas"
        :icon="logoDataUri"
        :class-names="classNames"
        :styles="stylesFunction"
      />
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import type { QRCodeProps } from 'ant-design-vue';

const logoDataUri =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='12' fill='%231677ff'/><path d='M18 46L32 16l14 30h-8l-6-13-6 13h-8z' fill='%23fff'/></svg>";

const classNames: QRCodeProps['classNames'] = {
  root: 'demo-qrcode-semantic-root',
};

const stylesObject: QRCodeProps['styles'] = {
  root: {
    border: '2px solid #1890ff',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: 'rgba(24, 144, 255, 0.1)',
  },
};

const stylesFunction: QRCodeProps['styles'] = info => {
  if (info.props.type === 'canvas') {
    return {
      root: {
        border: '2px solid #ff4d4f',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: 'rgba(255, 77, 79, 0.1)',
      },
    };
  }
  return {};
};
</script>

<style scoped>
.demo-qrcode-style-class :deep(.demo-qrcode-semantic-root) {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
}
</style>
