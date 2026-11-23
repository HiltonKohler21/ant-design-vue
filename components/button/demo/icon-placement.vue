<docs>
---
order: 4
version: 4.3.0
title:
  zh-CN: 按钮图标位置
  en-US: Icon Placement
---

## zh-CN

通过设置 `iconPlacement` 为 `start` 或 `end` 分别设置按钮图标的位置。

## en-US

You can set the position of a button's icon by setting the `iconPlacement` to `start` or `end` respectively.
</docs>

<template>
  <a-space>
    <a-radio-group v-model:value="placement">
      <a-radio-button value="start">start</a-radio-button>
      <a-radio-button value="end">end</a-radio-button>
    </a-radio-group>
  </a-space>
  <a-divider title-placement="start" plain>Preview</a-divider>
  <a-flex gap="small" vertical>
    <a-flex wrap="wrap" gap="small">
      <a-tooltip title="search">
        <a-button type="primary" shape="circle" :icon="h(SearchOutlined)" />
      </a-tooltip>
      <a-button type="primary" shape="circle">A</a-button>
      <a-button type="primary" :icon="h(SearchOutlined)" :icon-placement="placement">
        Search
      </a-button>
      <a-tooltip title="search">
        <a-button shape="circle" :icon="h(SearchOutlined)" />
      </a-tooltip>
      <a-button :icon="h(SearchOutlined)" :icon-placement="placement">Search</a-button>
    </a-flex>
    <a-flex wrap="wrap" gap="small">
      <a-tooltip title="search">
        <a-button shape="circle" :icon="h(SearchOutlined)" />
      </a-tooltip>
      <a-button :icon="h(SearchOutlined)" type="text" :icon-placement="placement">Search</a-button>
      <a-tooltip title="search">
        <a-button type="dashed" shape="circle" :icon="h(SearchOutlined)" />
      </a-tooltip>
      <a-button type="dashed" :icon="h(SearchOutlined)" :icon-placement="placement">
        Search
      </a-button>
      <a-button
        :icon="h(SearchOutlined)"
        href="https://www.google.com"
        target="_blank"
        :icon-placement="placement"
      />
      <a-button type="primary" loading :icon-placement="placement">Loading</a-button>
    </a-flex>
  </a-flex>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';

const placement = ref<'start' | 'end'>('end');
</script>
