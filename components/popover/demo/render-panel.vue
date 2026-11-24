<docs>
---
order: 9
debug: true
title:
  zh-CN: _InternalPanelDoNotUseOrYouWillBeFired
  en-US: _InternalPanelDoNotUseOrYouWillBeFired
---

## zh-CN

调试用组件，请勿直接使用。

## en-US

Debug usage. Do not use in your production.
</docs>

<template>
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
</template>

<script lang="ts" setup>
import { Popover } from 'ant-design-vue';

const InternalPopover = Popover._InternalPanelDoNotUseOrYouWillBeFired;
</script>
