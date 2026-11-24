<docs>
---
order: 8
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
  <div
    :style="{
      display: 'flex',
      flexDirection: 'column',
      rowGap: '16px',
      background: 'rgba(50, 0, 0, 0.65)',
      padding: '8px',
    }"
  >
    <InternalPanel title="Hello World!" description="Hello World?!" />
    <InternalPanel
      title="Hello World!"
      description="Hello World?!"
      :cover="coverNode"
      :current="5"
      :total="7"
    />
    <InternalPanel
      title="Hello World!"
      description="Hello World?!"
      type="primary"
      :current="4"
      :total="5"
    />
  </div>
</template>

<script lang="ts" setup>
import { createVNode } from 'vue';
import { Tour } from 'ant-design-vue';

const InternalPanel = Tour._InternalPanelDoNotUseOrYouWillBeFired;

const coverNode = createVNode('img', {
  draggable: false,
  alt: 'tour.png',
  src: 'https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png',
});
</script>
