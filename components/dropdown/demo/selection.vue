<docs>
---
order: 16
title:
  zh-CN: 划词操作
  en-US: Selection actions
---

## zh-CN

通过 `Dropdown` 和浏览器 Selection API 组合，实现划词后的自定义操作菜单。

## en-US

Use `Dropdown` with the browser Selection API to show custom actions after selecting text.
</docs>

<template>
  <context-holder />
  <a-dropdown
    :menu="{ items, onClick: handleMenuClick }"
    :open="Boolean(selection)"
    placement="bottom"
    :trigger="[]"
    @open-change="handleOpenChange"
  >
    <span
      aria-hidden="true"
      class="dropdown-selection-trigger"
      :style="{
        left: `${selection?.x ?? -9999}px`,
        top: `${selection?.y ?? -9999}px`,
      }"
    />
  </a-dropdown>
  <div
    ref="wrapperRef"
    class="dropdown-selection-wrapper"
    :style="{
      padding: `${token.paddingLG}px`,
      color: token.colorText,
      backgroundColor: token.colorBgLayout,
      borderRadius: `${token.borderRadiusLG}px`,
    }"
    @mousedown="selection = null"
    @mouseup="handleMouseUp"
  >
    Select any text in this paragraph to open a Dropdown menu near the selection. This is useful for
    actions such as masking sensitive words, marking entities, or searching the selected keyword.
    Example data: Alice, phone 13800138000, ID 110101199001011234.
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { message, theme } from 'ant-design-vue';
import type { MenuProps } from 'ant-design-vue';

interface SelectionInfo {
  text: string;
  x: number;
  y: number;
}

const labels: Record<string, string> = {
  mask: 'Mask keyword',
  mark: 'Mark keyword',
  search: 'Search keyword',
};

const items = Object.entries(labels).map(([key, label]) => ({ key, label }));

const [messageApi, contextHolder] = message.useMessage();
const { token } = theme.useToken();

const wrapperRef = ref<HTMLDivElement | null>(null);
const selection = ref<SelectionInfo | null>(null);

const handleSelect = () => {
  const selectionInstance = window.getSelection();
  const selectedText = selectionInstance?.toString().trim();

  if (!selectionInstance || !selectedText || selectionInstance.rangeCount === 0) {
    selection.value = null;
    return;
  }

  const range = selectionInstance.getRangeAt(0);
  if (!wrapperRef.value?.contains(range.commonAncestorContainer)) {
    selection.value = null;
    return;
  }

  const rect = range.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    selection.value = null;
    return;
  }

  selection.value = {
    text: selectedText,
    x: rect.left + rect.width / 2,
    y: rect.bottom + 4,
  };
};

const handleMouseUp = () => {
  setTimeout(handleSelect);
};

const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
  if (!selection.value) {
    return;
  }
  messageApi.info(`${labels[String(key)]}: ${selection.value.text}`);
  window.getSelection()?.removeAllRanges();
  selection.value = null;
};

const handleOpenChange = (nextOpen: boolean) => {
  if (!nextOpen) {
    selection.value = null;
  }
};
</script>

<style scoped>
.dropdown-selection-wrapper {
  user-select: text;
}
.dropdown-selection-trigger {
  position: fixed;
  display: block;
  width: 1px;
  height: 1px;
  margin: 0;
  padding: 0;
  pointer-events: none;
}
</style>
