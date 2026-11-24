<docs>
---
order: 3
version: 5.20.0
title:
  zh-CN: 自定义状态渲染器
  en-US: Custom Status Render
---

## zh-CN

可以通过 `statusRender` 属性或 `#statusRender` 插槽自定义不同状态下的渲染内容。

## en-US

Customize the status overlay via the `statusRender` prop or `#statusRender` slot.

</docs>

<template>
  <a-flex gap="middle" wrap="wrap">
    <a-qrcode :value="value" status="loading" :status-render="customStatusRender" />
    <a-qrcode
      :value="value"
      status="expired"
      :status-render="customStatusRender"
      @refresh="handleRefresh"
    />
    <a-qrcode :value="value" status="scanned">
      <template #statusRender="{ locale }">
        <div>
          <CheckCircleFilled style="color: #52c41a" />
          {{ locale?.scanned }}
        </div>
      </template>
    </a-qrcode>
  </a-flex>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { CheckCircleFilled, CloseCircleFilled, ReloadOutlined } from '@ant-design/icons-vue';
import { Button, Space, Spin, message } from 'ant-design-vue';
import type { QRCodeProps } from 'ant-design-vue';

const value = 'https://www.antdv.com';

const handleRefresh = () => {
  message.info('QRCode refreshed');
};

const customStatusRender: QRCodeProps['statusRender'] = info => {
  switch (info.status) {
    case 'expired':
      return h('div', [
        h(CloseCircleFilled, { style: { color: '#ff4d4f' } }),
        ` ${info.locale?.expired ?? 'QR code expired'}`,
        h('p', [
          h(Button, { type: 'link', onClick: info.onRefresh }, () => [
            h(ReloadOutlined),
            ` ${info.locale?.refresh ?? 'Refresh'}`,
          ]),
        ]),
      ]);
    case 'loading':
      return h(Space, { direction: 'vertical' }, () => [h(Spin), h('p', 'Loading...')]);
    case 'scanned':
      return h('div', [
        h(CheckCircleFilled, { style: { color: '#52c41a' } }),
        ` ${info.locale?.scanned ?? 'Scanned'}`,
      ]);
    default:
      return null;
  }
};
</script>
