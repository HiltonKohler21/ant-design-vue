<docs>
---
order: 10
title:
  zh-CN: 自定义进度条颜色
  en-US: Customize progress bar color
---

## zh-CN

通过配置组件 token 来自定义进度条颜色。

## en-US

Customize the progress bar color by configuring the component token.

</docs>

<template>
  <div class="notification-progress-color-demo">
    <a-config-provider
      :button="{ className: 'notification-progress-gradient-btn' }"
      :theme="themeConfig"
    >
      <contextHolder />
      <a-button type="primary" @click="openNotification">Show custom progress color</a-button>
    </a-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { notification } from 'ant-design-vue';
import type { ConfigProviderProps } from 'ant-design-vue';

const COLOR_BG = 'linear-gradient(135deg, #6253e1, #04befe)';

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    Notification: {
      progressBg: COLOR_BG,
    },
  },
};

const [api, contextHolder] = notification.useNotification();

const openNotification = () => {
  api.open({
    title: 'Customize progress bar color',
    description: 'You can use component token to customize the progress bar color',
    showProgress: true,
    duration: 20,
  });
};
</script>

<style scoped>
.notification-progress-color-demo
  :deep(
    .notification-progress-gradient-btn.ant-btn-primary:not([disabled]):not(.ant-btn-dangerous)
      > span
  ) {
  position: relative;
}

.notification-progress-color-demo
  :deep(
    .notification-progress-gradient-btn.ant-btn-primary:not([disabled]):not(
        .ant-btn-dangerous
      )::before
  ) {
  content: '';
  background: linear-gradient(135deg, #6253e1, #04befe);
  position: absolute;
  inset: -1px;
  opacity: 1;
  transition: all var(--ant-motion-duration-slow, 0.3s);
  border-radius: inherit;
}

.notification-progress-color-demo
  :deep(
    .notification-progress-gradient-btn.ant-btn-primary:not([disabled]):not(
        .ant-btn-dangerous
      ):hover::before
  ) {
  opacity: 0;
}
</style>
