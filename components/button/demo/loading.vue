<docs>
---
order: 9
title:
  zh-CN: 加载中状态
  en-US: Loading
---

## zh-CN

添加 `loading` 属性即可让按钮处于加载状态，`loading.icon` 可以自定义加载图标，最后几个按钮演示点击后进入加载状态。

## en-US

A loading indicator can be added to a button by setting the `loading` property on the `Button`. The `loading.icon` can be used to customize the loading icon.
</docs>

<template>
  <a-flex gap="small" vertical>
    <a-flex gap="small" align="center" wrap="wrap">
      <a-button type="primary" loading>Loading</a-button>
      <a-button type="primary" size="small" loading>Loading</a-button>
      <a-button type="primary" :icon="h(PoweroffOutlined)" loading />
      <a-button type="primary" :loading="{ icon: h(SyncOutlined, { spin: true }) }">
        Loading Icon
      </a-button>
    </a-flex>
    <a-flex gap="small" wrap="wrap">
      <a-button type="primary" :loading="loadings[0]" @click="enterLoading(0)">Icon Start</a-button>
      <a-button type="primary" :loading="loadings[2]" icon-placement="end" @click="enterLoading(2)">
        Icon End
      </a-button>
      <a-button
        type="primary"
        :icon="h(PoweroffOutlined)"
        :loading="loadings[1]"
        @click="enterLoading(1)"
      >
        Icon Replace
      </a-button>
      <a-button
        type="primary"
        :icon="h(PoweroffOutlined)"
        :loading="loadings[3]"
        @click="enterLoading(3)"
      />
      <a-button
        type="primary"
        :icon="h(PoweroffOutlined)"
        :loading="loadings[3] ? { icon: h(SyncOutlined, { spin: true }) } : false"
        @click="enterLoading(3)"
      >
        Loading Icon
      </a-button>
    </a-flex>
  </a-flex>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { PoweroffOutlined, SyncOutlined } from '@ant-design/icons-vue';

const loadings = ref<boolean[]>([]);

const enterLoading = (index: number) => {
  console.log('Start loading:', index);
  loadings.value[index] = true;

  setTimeout(() => {
    loadings.value[index] = false;
  }, 3000);
};
</script>
