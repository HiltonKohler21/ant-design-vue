<docs>
---
order: 4
title:
  zh-CN: Avatar.Group
  en-US: Avatar.Group
---

## zh-CN

头像组合展现。

## en-US

Avatar group display.
</docs>

<template>
  <a-avatar-group>
    <a-avatar :src="avatar1" />
    <a href="https://hiltonkohler21.github.io/ant-design-vue">
      <a-avatar style="background-color: #f56a00">K</a-avatar>
    </a>
    <a-tooltip title="Ant User" placement="top">
      <a-avatar style="background-color: #87d068">
        <template #icon><UserOutlined /></template>
      </a-avatar>
    </a-tooltip>
    <a-avatar style="background-color: #1890ff">
      <template #icon><AntDesignOutlined /></template>
    </a-avatar>
  </a-avatar-group>
  <a-divider />
  <a-avatar-group :max-count="2" :max-style="{ color: '#f56a00', backgroundColor: '#fde3cf' }">
    <a-avatar :src="avatar2" />
    <a-avatar style="background-color: #1890ff">K</a-avatar>
    <a-tooltip title="Ant User" placement="top">
      <a-avatar style="background-color: #87d068">
        <template #icon><UserOutlined /></template>
      </a-avatar>
    </a-tooltip>
    <a-avatar style="background-color: #1890ff">
      <template #icon><AntDesignOutlined /></template>
    </a-avatar>
  </a-avatar-group>
  <a-divider />
  <a-avatar-group
    :max-count="2"
    size="large"
    :max-style="{
      color: '#f56a00',
      backgroundColor: '#fde3cf',
    }"
  >
    <a-avatar :src="avatar3" />
    <a-avatar style="background-color: #1890ff">K</a-avatar>
    <a-tooltip title="Ant User" placement="top">
      <a-avatar style="background-color: #87d068">
        <template #icon><UserOutlined /></template>
      </a-avatar>
    </a-tooltip>
    <a-avatar style="background-color: #1890ff">
      <template #icon><AntDesignOutlined /></template>
    </a-avatar>
  </a-avatar-group>
  <a-divider />
  <a-avatar-group
    :max-count="2"
    max-popover-trigger="click"
    size="large"
    :max-style="{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }"
  >
    <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
    <a-avatar style="background-color: #f56a00">K</a-avatar>
    <a-tooltip title="Ant User" placement="top">
      <a-avatar style="background-color: #87d068">
        <template #icon><UserOutlined /></template>
      </a-avatar>
    </a-tooltip>
    <a-avatar style="background-color: #1890ff">
      <template #icon><AntDesignOutlined /></template>
    </a-avatar>
  </a-avatar-group>
  <a-divider />
  <a-avatar-group shape="square">
    <a-avatar style="background-color: #fde3cf">A</a-avatar>
    <a-avatar style="background-color: #f56a00">K</a-avatar>
    <a-tooltip title="Ant User" placement="top">
      <a-avatar style="background-color: #87d068">
        <template #icon><UserOutlined /></template>
      </a-avatar>
    </a-tooltip>
    <a-avatar style="background-color: #1890ff">
      <template #icon><AntDesignOutlined /></template>
    </a-avatar>
  </a-avatar-group>
</template>

<script lang="ts" setup>
import { UserOutlined, AntDesignOutlined } from '@ant-design/icons-vue';

const avatar1 =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23e6f4ff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%231677ff%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%231677ff%22%2F%3E%3C%2Fsvg%3E';
const avatar2 =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23f9f0ff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%23722ed1%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%23722ed1%22%2F%3E%3C%2Fsvg%3E';
const avatar3 =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23e6fffb%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%2313c2c2%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%2313c2c2%22%2F%3E%3C%2Fsvg%3E';
</script>
