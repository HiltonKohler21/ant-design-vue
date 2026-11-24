<docs>
---
order: 10
title:
  zh-CN: 遮罩
  en-US: Mask
---

## zh-CN

遮罩效果。

## en-US

Mask effect.
</docs>

<template>
  <a-space wrap>
    <template v-for="item in drawerList" :key="item.type">
      <a-button @click="showDrawer(item.type)">{{ item.title }}</a-button>
      <a-drawer
        :title="item.title"
        placement="right"
        :mask="item.mask"
        :open="open === item.type"
        @close="onClose"
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </a-drawer>
    </template>
  </a-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { DrawerProps } from 'ant-design-vue';

type MaskKey = 'blur' | 'dimmed' | 'none';
interface DrawerConfig {
  type: MaskKey;
  mask: DrawerProps['mask'];
  title: string;
}

const drawerList: DrawerConfig[] = [
  { type: 'blur', mask: { blur: true }, title: 'blur' },
  { type: 'dimmed', mask: true, title: 'Dimmed mask' },
  { type: 'none', mask: false, title: 'No mask' },
];

const open = ref<false | MaskKey>(false);

const showDrawer = (type: MaskKey) => {
  open.value = type;
};

const onClose = () => {
  open.value = false;
};
</script>
