<docs>
---
order: 19
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
  <div :style="{ display: 'flex', flexDirection: 'column', rowGap: '16px' }">
    <InternalPanel title="Hello World!" :style="{ width: '100%', height: '200px' }">
      Hello World?!
    </InternalPanel>
    <InternalPanel type="success" :style="{ width: '200px', height: '150px' }">
      A good news!
    </InternalPanel>
    <InternalPanel
      title="Confirm This?"
      type="confirm"
      :style="{ width: '300px', height: '200px' }"
    >
      Some descriptions.
    </InternalPanel>
    <InternalPanel
      title="Custom Footer Render"
      :style="{ width: '380px', height: '200px' }"
      :footer="customFooterFn"
    >
      <a-typography-paragraph>
        <a-typography-link href="https://github.com/ant-design/ant-design/pull/44318">
          Feature #44318
        </a-typography-link>
      </a-typography-paragraph>
    </InternalPanel>
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { Button, Modal, Space } from 'ant-design-vue';
import type { ModalFuncProps } from 'ant-design-vue';

/** Test usage. Do not use in your production. */
const InternalPanel = Modal._InternalPanelDoNotUseOrYouWillBeFired;

const customFooterFn: ModalFuncProps['footer'] = (originNode, { OkBtn, CancelBtn }) =>
  h(Space, { vertical: true }, () => [
    h(Space, null, () => [originNode]),
    h(Space, null, () => [
      h(CancelBtn),
      h(Button, { danger: true, type: 'primary' }, () => 'Custom'),
      h(OkBtn),
    ]),
  ]);
</script>
