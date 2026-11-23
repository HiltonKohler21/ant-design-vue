<docs>
---
order: 10
title:
  zh-CN: 多个按钮组合
  en-US: Multiple Buttons
---

## zh-CN

按钮组合使用时，推荐使用 1 个主操作 + n 个次操作，3 个以上操作时把更多操作放到 [Dropdown](/components/dropdown-cn/#components-dropdown-demo-dropdown-button) 中组合使用。

## en-US

If you need several buttons, we recommend that you use 1 primary button + n secondary buttons. If there are more than three operations, you can group some of them into a [Dropdown](/components/dropdown/#components-dropdown-demo-dropdown-button).
</docs>

<template>
  <a-flex align="flex-start" gap="small" vertical>
    <a-button type="primary">primary</a-button>
    <a-button>secondary</a-button>
    <a-space-compact>
      <a-button>Actions</a-button>
      <a-dropdown placement="bottomRight">
        <template #overlay>
          <a-menu @click="onMenuClick">
            <a-menu-item key="1">1st item</a-menu-item>
            <a-menu-item key="2">2nd item</a-menu-item>
            <a-menu-item key="3">3rd item</a-menu-item>
          </a-menu>
        </template>
        <a-button :icon="h(EllipsisOutlined)" />
      </a-dropdown>
    </a-space-compact>
  </a-flex>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { EllipsisOutlined } from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';

const onMenuClick: MenuProps['onClick'] = e => {
  console.log('click', e);
};
</script>
