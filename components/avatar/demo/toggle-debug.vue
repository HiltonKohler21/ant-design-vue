<docs>
---
order: 6
debug: true
title:
  zh-CN: 隐藏情况下计算字符对齐
  en-US: Calculate text style when hiding
---

## zh-CN

切换 Avatar 显示的时候，文本样式应该居中并正确调整字体大小。

## en-US

Text inside Avatar should be set a proper font size when toggling its visibility.
</docs>

<template>
  <a-space wrap>
    <a-button @click="toggle">Toggle Avatar visibility</a-button>
    <a-button @click="toggleSize">Toggle Avatar size</a-button>
    <a-button @click="changeScale">Change Avatar scale</a-button>
  </a-space>
  <div :style="{ textAlign: 'center', transform: `scale(${scale})`, marginTop: '24px' }">
    <a-avatar :size="size" :style="{ background: '#7265e6', display: hide ? 'none' : '' }">
      Avatar
    </a-avatar>
    <a-avatar
      :size="size"
      :src="invalidSrc"
      :style="{ background: '#00a2ae', display: hide ? 'none' : '' }"
    >
      Invalid
    </a-avatar>
    <div :style="{ display: hide ? 'none' : '' }">
      <a-avatar :size="size" style="background: #7265e6">Avatar</a-avatar>
      <a-avatar :size="size" :src="invalidSrc" style="background: #00a2ae">Invalid</a-avatar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { AvatarSize } from 'ant-design-vue';

const invalidSrc = 'data:image/png;base64,AAAA';
const sizes: AvatarSize[] = ['small', 'default', 'large'];

const hide = ref(true);
const size = ref<AvatarSize>('large');
const scale = ref(1);

const toggle = () => {
  hide.value = !hide.value;
};

const toggleSize = () => {
  const current = (sizes.indexOf(size.value) + 1) % sizes.length;
  size.value = sizes[current];
};

const changeScale = () => {
  scale.value = scale.value === 1 ? 2 : 1;
};
</script>
