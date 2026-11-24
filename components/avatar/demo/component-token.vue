<docs>
---
order: 6
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
    <a-space wrap :size="16">
      <a-space>
        <a-avatar shape="circle">A</a-avatar>
      </a-space>
      <a-space>
        <a-avatar-group
          :max-count="2"
          :max-style="{ color: '#f56a00', backgroundColor: '#fde3cf' }"
        >
          <a-avatar :src="avatarUrl" />
          <a-avatar style="background-color: #f56a00">K</a-avatar>
          <a-tooltip title="Ant User" placement="top">
            <a-avatar style="background-color: #87d068">
              <template #icon><UserOutlined /></template>
            </a-avatar>
          </a-tooltip>
          <a-avatar style="background-color: #1890ff">
            <template #icon><AntDesignOutlined /></template>
          </a-avatar>
        </a-avatar-group>
      </a-space>
      <a-space>
        <a-badge :count="1">
          <a-avatar shape="square">
            <template #icon><UserOutlined /></template>
          </a-avatar>
        </a-badge>
        <a-badge dot>
          <a-avatar shape="square">
            <template #icon><UserOutlined /></template>
          </a-avatar>
        </a-badge>
      </a-space>
    </a-space>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons-vue';
import type { ConfigProviderProps } from 'ant-design-vue';

const avatarUrl =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23e6f4ff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%231677ff%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%231677ff%22%2F%3E%3C%2Fsvg%3E';

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    Avatar: {
      containerSize: 60,
      containerSizeLG: 30,
      containerSizeSM: 16,
      textFontSize: 14,
      textFontSizeLG: 14,
      textFontSizeSM: 14,
      iconFontSize: 18,
      iconFontSizeLG: 28,
      iconFontSizeSM: 12,
      borderRadius: 10,
      groupOverlapping: -10,
      groupBorderColor: '#eee',
    } as Record<string, any>,
  },
};
</script>
