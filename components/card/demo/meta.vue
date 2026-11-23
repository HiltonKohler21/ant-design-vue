<docs>
---
order: 7
title:
  zh-CN: 支持更多内容配置
  en-US: Support more content configuration
---

## zh-CN

一种支持封面、头像、标题和描述信息的卡片。

## en-US

A Card that supports `cover`, `avatar`, `title` and `description`.

</docs>

<template>
  <a-card hoverable style="width: 300px">
    <template #cover>
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    </template>
    <template #actions>
      <setting-outlined key="setting" />
      <edit-outlined key="edit" />
      <ellipsis-outlined key="ellipsis" />
    </template>
    <a-card-meta title="Card title" description="This is the description">
      <template #avatar>
        <a-avatar :src="avatarUrl" />
      </template>
    </a-card-meta>
  </a-card>
</template>

<script lang="ts" setup>
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue';

const avatarUrl =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23e6f4ff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%231677ff%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%231677ff%22%2F%3E%3C%2Fsvg%3E';
</script>
