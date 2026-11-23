<docs>
---
order: 15
debug: true
title:
  zh-CN: 加载中状态 bug 还原
  en-US: Chinese Chars Loading
---

## zh-CN

https://github.com/ant-design/ant-design/issues/36165

## en-US

https://github.com/ant-design/ant-design/issues/36165
</docs>

<template>
  <a-flex wrap="wrap" gap="small">
    <a-button>
      <span>
        <span>部署</span>
      </span>
    </a-button>
    <a-button loading>部署</a-button>
    <a-button loading>
      <Text1 />
    </a-button>
    <a-button loading>
      <Text2 />
    </a-button>
    <a-button loading>
      <Text3 />
    </a-button>
    <a-button loading :icon="h(PoweroffOutlined)">
      <Text1 />
    </a-button>
    <a-button loading>按钮</a-button>
  </a-flex>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { PoweroffOutlined } from '@ant-design/icons-vue';

const Text1 = () => '部署';
const Text2 = () => h('span', '部署');
const Text3 = () => 'Submit';
</script>
