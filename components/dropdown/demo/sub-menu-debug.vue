<docs>
---
order: 11
debug: true
title:
  zh-CN: 多级菜单
  en-US: Cascading menu
---

## zh-CN

传入的菜单里有多个层级。

## en-US

The menu has multiple levels.
</docs>

<template>
  <div ref="containerRef" :style="{ height: '200px', position: 'relative' }">
    <a-dropdown
      :menu="{ items, openKeys: ['2'] }"
      open
      :auto-adjust-overflow="false"
      :get-popup-container="getPopupContainer"
    >
      <a class="ant-dropdown-link" @click.prevent>
        <a-space>
          Cascading menu
          <DownOutlined />
        </a-space>
      </a>
    </a-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';

const containerRef = ref<HTMLDivElement>();
const getPopupContainer = () => containerRef.value || document.body;

const items = [
  {
    key: '1',
    type: 'group',
    label: 'Group title',
    children: [
      {
        key: '1-1',
        label: '1st menu item',
      },
      {
        key: '1-2',
        label: '2nd menu item',
      },
    ],
  },
  {
    key: '2',
    label: 'sub menu',
    children: [
      {
        key: '2-1',
        label: '3rd menu item',
      },
      {
        key: '2-2',
        label: '4th menu item',
      },
    ],
  },
  {
    key: '3',
    label: 'disabled sub menu',
    disabled: true,
    children: [
      {
        key: '3-1',
        label: '5d menu item',
      },
      {
        key: '3-2',
        label: '6th menu item',
      },
    ],
  },
];
</script>
