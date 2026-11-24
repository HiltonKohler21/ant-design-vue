<docs>
---
order: 10
debug: true
title:
  zh-CN: Debug
  en-US: Debug
---

## zh-CN

Debug 用例。

## en-US

Debug use.
</docs>

<template>
  <div ref="containerRef" :style="{ position: 'relative' }">
    <a-flex vertical :gap="72" align="flex-start">
      <span />
      <a-tooltip
        open
        title="Thanks for using antd. Have a nice day !"
        :arrow="{ pointAtCenter: true }"
        placement="topLeft"
        :get-popup-container="getPopupContainer"
      >
        <a-button>Point at center</a-button>
      </a-tooltip>
      <a-tooltip open placement="topLeft" :get-popup-container="getPopupContainer">
        <template #title>
          <div />
        </template>
        <a-button>Min Width</a-button>
      </a-tooltip>
      <a-tooltip open placement="top" :get-popup-container="getPopupContainer">
        <template #title>
          <div />
        </template>
        <a-button>Min Width</a-button>
      </a-tooltip>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const containerRef = ref<HTMLDivElement>();
const getPopupContainer = () => containerRef.value || document.body;
</script>
