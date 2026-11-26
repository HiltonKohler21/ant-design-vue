<docs>
---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

设置 `closable` 可显示默认关闭按钮，也可通过对象配置 `closeIcon` 和 `aria-label` 等无障碍属性。顶层 `closeIcon` 是简便配置方式，可设置自定义关闭图标或设为 `true` 显示默认关闭按钮。可关闭标签具有 `close` 事件，可通过 `e.preventDefault()` 阻止关闭。

## en-US

Set `closable` to show the default close button, or use an object to configure `closeIcon` and accessibility attributes such as `aria-label`. The top-level `closeIcon` is a shorthand for setting a custom close icon or showing the default close button with `true`. Closable tags support the `close` event. Use `e.preventDefault()` to prevent closing.

</docs>

<template>
  <a-flex gap="small" align="center" wrap>
    <a-tag>Tag 1</a-tag>
    <a-tag>
      <a
        href="https://github.com/ant-design/ant-design/issues/1862"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ant Design issue"
      >
        Link
      </a>
    </a-tag>
    <a-tag closable @close="preventDefault">Prevent Default</a-tag>
    <a-tag @close="log">
      <template #closeIcon>
        <CloseCircleOutlined />
      </template>
      Tag 2
    </a-tag>
    <a-tag :closable="closableConfig" @close="log">Tag 3</a-tag>
  </a-flex>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import type { TagProps } from '@hiltonkohler21/ant-design-vue';

const preventDefault = (e: MouseEvent) => {
  e.preventDefault();
  console.log('Clicked! But prevent default.');
};

const log = (e: MouseEvent) => {
  console.log(e);
};

const closableConfig: TagProps['closable'] = {
  closeIcon: h(DeleteOutlined),
  'aria-label': 'Close Button',
};
</script>
