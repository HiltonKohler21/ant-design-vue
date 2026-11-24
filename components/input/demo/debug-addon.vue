<docs>
---
order: 104
debug: true
title:
  zh-CN: debug 前置/后置标签
  en-US: debug Pre / Post tab
---

## zh-CN

一些特殊的前置后置标签。

## en-US

Some special pre & post tabs example.
</docs>

<template>
  <a-space direction="vertical" style="width: 100%">
    Input addon Button:
    <a-input default-value="mysite">
      <template #addonAfter>
        <a-button type="primary">Submit</a-button>
      </template>
    </a-input>
    <a-input default-value="mysite">
      <template #addonAfter>
        <a-button>Submit</a-button>
      </template>
    </a-input>
    <br />
    Input addon Button icon:
    <a-input default-value="mysite">
      <template #addonAfter>
        <a-button>
          <SettingOutlined />
        </a-button>
      </template>
    </a-input>
  </a-space>
</template>

<script lang="ts" setup>
import { SettingOutlined } from '@ant-design/icons-vue';
</script>
