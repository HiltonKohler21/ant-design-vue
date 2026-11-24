<docs>
---
order: 11
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
  <a-config-provider :theme="theme">
    <div :style="{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start' }">
      <InternalPopover title="Title">
        <template #content>
          <div>
            <p>Content</p>
            <p>Content</p>
          </div>
        </template>
      </InternalPopover>
      <InternalPopover title="Title" placement="bottomLeft" :style="{ width: '250px' }">
        <template #content>
          <div>
            <p>Content</p>
            <p>Content</p>
          </div>
        </template>
      </InternalPopover>
    </div>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { Popover } from 'ant-design-vue';
import type { ConfigProviderProps } from 'ant-design-vue';

const InternalPopover = Popover._InternalPanelDoNotUseOrYouWillBeFired;

const theme: ConfigProviderProps['theme'] = {
  components: {
    Popover: {
      titleMinWidth: 40,
    },
  },
};
</script>
