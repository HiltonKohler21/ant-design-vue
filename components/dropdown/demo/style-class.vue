<docs>
---
order: 17
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Dropdown 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of the Dropdown by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex gap="middle" wrap="wrap">
    <a-space direction="vertical" size="large">
      <a-dropdown
        :menu="{ items }"
        placement="bottomLeft"
        :class-names="classNames"
        :styles="objectStyles"
      >
        <a-button>
          <a-space>
            Object Style
            <DownOutlined />
          </a-space>
        </a-button>
      </a-dropdown>

      <a-dropdown
        :menu="{ items }"
        placement="bottomLeft"
        :class-names="classNames"
        :styles="functionStyles"
        :trigger="['click']"
      >
        <a-button type="primary">
          <a-space>
            Function Style
            <DownOutlined />
          </a-space>
        </a-button>
      </a-dropdown>
    </a-space>
  </a-flex>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { DownOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons-vue';
import type { DropdownProps } from 'ant-design-vue';

const items = [
  {
    key: '1',
    label: 'Profile',
  },
  {
    key: '2',
    label: 'Settings',
    icon: h(SettingOutlined),
  },
  {
    type: 'divider',
  },
  {
    key: '3',
    label: 'Logout',
    icon: h(LogoutOutlined),
    danger: true,
  },
];

const classNames: DropdownProps['classNames'] = {
  root: 'dropdown-style-class-root',
};

const objectStyles: DropdownProps['styles'] = {
  root: {
    backgroundColor: '#fff',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
  },
  item: {
    padding: '8px 12px',
    fontSize: '14px',
  },
  itemTitle: {
    fontWeight: '500',
  },
  itemIcon: {
    color: '#1890ff',
    marginInlineEnd: '8px',
  },
  itemContent: {
    backgroundColor: 'transparent',
  },
};

const functionStyles: DropdownProps['styles'] = info => {
  const { props } = info;
  const trigger = props.trigger;
  const isClick = Array.isArray(trigger) ? trigger.includes('click') : trigger === 'click';
  if (isClick) {
    return {
      root: {
        borderColor: '#1890ff',
        borderRadius: '8px',
      },
    };
  }
  return {};
};
</script>

<style scoped>
:global(.dropdown-style-class-root) {
  border: 1px solid var(--ant-color-border, #d9d9d9);
  border-radius: 6px;
}
</style>
