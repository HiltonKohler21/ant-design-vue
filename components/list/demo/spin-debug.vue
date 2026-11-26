<docs>
---
order: 15
debug: true
title:
  zh-CN: Spin 加载状态调试
  en-US: Spin loading debug
---

## zh-CN

Spin 加载状态下 List 组件样式调试示例。

## en-US

Debug example for List component styles in Spin loading state.
</docs>

<template>
  <a-config-provider
    :theme="{
      components: {
        List: {
          colorText: 'red',
        },
      },
    }"
  >
    <a-list item-layout="horizontal" :data-source="data">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta
            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
          >
            <template #avatar>
              <a-avatar :src="avatarUrl" />
            </template>
            <template #title>
              <a href="https://hiltonkohler21.github.io/ant-design-vue/">{{ item.title }}</a>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </a-config-provider>
</template>

<script lang="ts" setup>
const avatarUrl =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23e6f4ff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%231677ff%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%231677ff%22%2F%3E%3C%2Fsvg%3E';

const data = [{ title: 'Ant Design Title 1' }];
</script>
