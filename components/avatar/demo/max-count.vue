<docs>
---
order: 5
title:
  zh-CN: maxCount 包含溢出元素
  en-US: maxCount includes overflow
---

## zh-CN

使用封装逻辑为 `Avatar.Group` 添加 `overflowInFinal` 模式。开启后 `max.count` 表示总共显示的元素数量，会预留 1 个位置给溢出指示器。

## en-US

Wrap `Avatar.Group` with `overflowInFinal` mode. When enabled, `max.count` represents the total number of elements to display and reserves 1 slot for the overflow indicator.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-flex :gap="24" align="center" wrap="wrap">
      <span>Avatar count:</span>
      <a-input-number
        v-model:value="avatarCount"
        style="width: 120px"
        :min="2"
        :max="10"
        aria-label="Avatar count"
      />
    </a-flex>
    <a-flex :gap="8" align="center">
      <span>overflowInFinal:</span>
      <a-switch v-model:checked="overflowInFinal" aria-label="overflowInFinal" />
    </a-flex>
    <a-avatar-group :max="mergedMax">
      <a-avatar v-for="i in avatarCount" :key="i" style="background-color: #f56a00">
        {{ String.fromCharCode(64 + i) }}
      </a-avatar>
    </a-avatar-group>
  </a-flex>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { AvatarGroupProps } from 'ant-design-vue';

const avatarCount = ref(4);
const overflowInFinal = ref(true);
const maxTotal = 3;

const mergedMax = computed<AvatarGroupProps['max']>(() => {
  const count =
    overflowInFinal.value && maxTotal < avatarCount.value ? Math.max(1, maxTotal - 1) : maxTotal;
  return {
    count,
    style: { backgroundColor: '#52c41a', color: '#fff' },
  };
});
</script>
