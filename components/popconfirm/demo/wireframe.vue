<docs>
---
order: 10
debug: true
title:
  zh-CN: 线框风格
  en-US: Wireframe
---

## zh-CN

线框风格。

## en-US

Wireframe style.

</docs>

<template>
  <a-config-provider :theme="{ token: { wireframe: true } }">
    <InternalPopconfirm title="Are you OK?" />
    <InternalPopconfirm title="Are you OK?" placement="bottomRight" :style="{ width: '250px' }" />
  </a-config-provider>
</template>
<script lang="ts" setup>
import { Popconfirm } from '@hiltonkohler21/ant-design-vue';

const { _InternalPanelDoNotUseOrYouWillBeFired: InternalPopconfirm } = Popconfirm;
</script>
