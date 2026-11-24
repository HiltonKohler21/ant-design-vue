<docs>
---
order: 18
debug: true
title:
  zh-CN: Menu 完整样式
  en-US: Menu full styles
---

## zh-CN

此演示需要注意去掉 Reset 样式后查看 Dropdown 内 Menu 的样式是否正常。

## en-US

This demo was created for debugging Menu styles inside Dropdown.
</docs>

<template>
  <a-dropdown
    :menu="{
      items,
      selectedKeys: ['1'],
      openKeys: ['sub1'],
    }"
  >
    <a class="ant-dropdown-link" @click.prevent>
      <a-space>
        Hover to check menu style
        <DownOutlined />
      </a-space>
    </a>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import {
  AppstoreOutlined,
  DownOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue';

function getItem(label: any, key: string, icon?: any, children?: any[], type?: 'group') {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem(
    'Item Group',
    'group',
    null,
    [getItem('Option 0', '01'), getItem('Option 0', '02')],
    'group',
  ),
  getItem('Navigation One', 'sub1', h(MailOutlined), [
    getItem('Item 1', 'g1', null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
    getItem('Item 2', 'g2', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
  ]),
  getItem('Navigation Two', 'sub2', h(AppstoreOutlined), [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
  ]),
  getItem('Navigation Three', 'sub4', h(SettingOutlined), [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Option 11', '11'),
    getItem('Option 12', '12'),
  ]),
  null as any,
];
</script>
