<docs>
---
order: 10
debug: true
title:
  zh-CN: 线框风格
  en-US: Wireframe
---

## zh-CN

线框样式。

## en-US

Wireframe style.
</docs>

<template>
  <a-config-provider :theme="{ token: { wireframe: true } }">
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
import { Popover } from '@hiltonkohler21/ant-design-vue';

const InternalPopover = Popover._InternalPanelDoNotUseOrYouWillBeFired;
</script>
