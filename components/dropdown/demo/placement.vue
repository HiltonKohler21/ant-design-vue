<docs>
---
order: 2
title:
  zh-CN: 弹出位置
  en-US: Placement
---

## zh-CN

支持 12 个弹出位置。

## en-US

Support 12 placements.
</docs>

<template>
  <a-space direction="vertical">
    <a-space wrap>
      <a-dropdown :menu="{ items }" placement="bottomLeft">
        <a-button>bottomLeft</a-button>
      </a-dropdown>
      <a-dropdown :menu="{ items }" placement="bottom">
        <a-button>bottom</a-button>
      </a-dropdown>
      <a-dropdown :menu="{ items }" placement="bottomRight">
        <a-button>bottomRight</a-button>
      </a-dropdown>
    </a-space>
    <a-space wrap>
      <a-dropdown :menu="{ items }" placement="topLeft">
        <a-button>topLeft</a-button>
      </a-dropdown>
      <a-dropdown :menu="{ items }" placement="top">
        <a-button>top</a-button>
      </a-dropdown>
      <a-dropdown :menu="{ items }" placement="topRight">
        <a-button>topRight</a-button>
      </a-dropdown>
    </a-space>
    <a-space wrap>
      <a-dropdown :menu="{ items }" placement="leftTop">
        <a-button>leftTop</a-button>
      </a-dropdown>
      <a-dropdown :menu="{ items }" placement="left">
        <a-button>left</a-button>
      </a-dropdown>
      <a-dropdown :menu="{ items }" placement="leftBottom">
        <a-button>leftBottom</a-button>
      </a-dropdown>
    </a-space>
    <a-space wrap>
      <a-dropdown :menu="{ items }" placement="rightTop">
        <a-button>rightTop</a-button>
      </a-dropdown>
      <a-dropdown :menu="{ items }" placement="right">
        <a-button>right</a-button>
      </a-dropdown>
      <a-dropdown :menu="{ items }" placement="rightBottom">
        <a-button>rightBottom</a-button>
      </a-dropdown>
    </a-space>
  </a-space>
</template>

<script lang="ts" setup>
import { h } from 'vue';

const items = [
  {
    key: '1',
    label: h(
      'a',
      { target: '_blank', rel: 'noopener noreferrer', href: 'https://www.antgroup.com' },
      '1st menu item',
    ),
  },
  {
    key: '2',
    label: h(
      'a',
      { target: '_blank', rel: 'noopener noreferrer', href: 'https://www.aliyun.com' },
      '2nd menu item',
    ),
  },
  {
    key: '3',
    label: h(
      'a',
      { target: '_blank', rel: 'noopener noreferrer', href: 'https://www.luohanacademy.com' },
      '3rd menu item',
    ),
  },
];
</script>
