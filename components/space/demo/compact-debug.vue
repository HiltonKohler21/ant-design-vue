<docs>
---
order: 10
debug: true
title:
  zh-CN: 调试 Input 前置/后置标签
  en-US: Input addon debug
---

## zh-CN

调试 Input 前置/后置标签。

## en-US

Input addon debug.

</docs>

<template>
  <div style="max-width: 100%; overflow-x: auto">
    <a-space orientation="vertical" style="max-width: 100%">
      <a-space-compact block>
        <a-button>default Button</a-button>
        <a-button danger>danger Button</a-button>
        <a-button type="dashed">dashed Button</a-button>
        <a-button type="text">text Button</a-button>
        <a-button type="link">Link Button</a-button>
        <a-tooltip title="Tooltip">
          <a-button disabled>
            <template #icon><download-outlined /></template>
          </a-button>
        </a-tooltip>
      </a-space-compact>
      <br />
      <a-space-compact>
        <a-button>Prefix</a-button>
        <a-input addon-before="http://" addon-after=".com" default-value="mysite" />
        <a-button type="primary">Submit</a-button>
      </a-space-compact>
      <a-space-compact>
        <a-input placeholder="prefix" />
        <a-input default-value="mysite">
          <template #addonBefore>
            <a-select default-value="http" style="width: 90px" :options="httpOptions" />
          </template>
          <template #addonAfter>
            <a-select default-value=".com" style="width: 90px" :options="domainOptions" />
          </template>
        </a-input>
        <a-button>
          <template #icon><copy-outlined /></template>
        </a-button>
      </a-space-compact>
      <a-space-compact>
        <a-input-search />
        <a-input-search />
        <a-button>
          <template #icon><copy-outlined /></template>
        </a-button>
      </a-space-compact>
      <a-space-compact>
        <a-input default-value="mysite">
          <template #addonAfter><setting-outlined /></template>
        </a-input>
        <a-button type="primary">Submit</a-button>
        <a-input placeholder="suffix">
          <template #addonAfter><setting-outlined /></template>
        </a-input>
      </a-space-compact>
      <a-space-compact>
        <a-input addon-before="http://" suffix=".com" default-value="mysite" />
        <a-button type="primary">Submit</a-button>
      </a-space-compact>
      <a-space-compact>
        <a-button>Prefix</a-button>
        <a-input default-value="mysite">
          <template #addonBefore>
            <a-cascader placeholder="cascader" style="width: 150px" />
          </template>
        </a-input>
        <a-button type="primary">Submit</a-button>
      </a-space-compact>
      <a-space-compact>
        <a-input addon-before="Prefix" default-value="mysite" show-count />
        <a-button type="primary">Submit</a-button>
        <a-input addon-before="Prefix" default-value="mysite" show-count>
          <template #addonAfter><setting-outlined /></template>
        </a-input>
        <a-input addon-before="Prefix" default-value="mysite" show-count />
      </a-space-compact>
      <br />
      <a-space-compact>
        <a-button @click="showModal = true">debug Modal context</a-button>
        <a-modal v-if="showModal" v-model:open="showModal" title="Basic Modal">
          <a-button>normal button A</a-button>
          <a-button>normal button B</a-button>
          <br />
          <br />
          <a-input />
          <br />
          <br />
          <a-space-compact>
            <a-button>compact button A</a-button>
            <a-button>compact button B</a-button>
          </a-space-compact>
        </a-modal>
      </a-space-compact>
      <a-space-compact>
        <a-dropdown-button>
          debug Dropdown.Button context
          <template #overlay>
            <a-menu>
              <a-menu-item key="1">
                <a-button>menu button</a-button>
              </a-menu-item>
              <a-menu-item key="2">normal menu item</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown-button>
      </a-space-compact>
      <a-space-compact>
        <a-button @click="showDrawer = true">debug Drawer context</a-button>
        <a-drawer
          v-if="showDrawer"
          v-model:open="showDrawer"
          title="Basic Drawer"
          placement="right"
        >
          <a-button>normal button A</a-button>
          <a-button>normal button B</a-button>
          <br />
          <br />
          <a-space-compact>
            <a-button>compact button A</a-button>
            <a-button>compact button B</a-button>
          </a-space-compact>
        </a-drawer>
      </a-space-compact>
      <a-space-compact>
        <a-input placeholder="Debug Popover context" />
        <a-popover trigger="click" placement="bottom">
          <template #content>
            <a-input placeholder="Left Border" />
            <a-divider />
            <a-date-picker />
            <a-divider />
            <a-input-number />
            <a-divider />
            <a-select style="width: 120px" />
          </template>
          <a-button>Settings</a-button>
        </a-popover>
      </a-space-compact>
      <a-space-compact>
        <a-input-number addon-before="+" addon-after="$" :default-value="100" />
      </a-space-compact>
      <a-space-compact>
        <a-select default-value="Sign Up" :options="signOptions" />
      </a-space-compact>
      <a-space-compact>
        <a-range-picker style="width: 70%" />
      </a-space-compact>
      <a-space-compact>
        <a-input-number :default-value="12" />
      </a-space-compact>
      <a-space-compact>
        <a-cascader style="width: 70%" :options="addressOptions" placeholder="Select Address" />
      </a-space-compact>
      <a-space-compact orientation="vertical">
        <a-button>vertical compact button A</a-button>
      </a-space-compact>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { CopyOutlined, DownloadOutlined, SettingOutlined } from '@ant-design/icons-vue';

const showModal = ref(false);
const showDrawer = ref(false);

const httpOptions = [
  { label: 'http://', value: 'http' },
  { label: 'https://', value: 'https' },
];

const domainOptions = [
  { label: '.com', value: '.com' },
  { label: '.jp', value: '.jp' },
  { label: '.cn', value: '.cn' },
  { label: '.org', value: '.org' },
];

const signOptions = [
  { label: 'Sign Up', value: 'Sign Up' },
  { label: 'Sign In', value: 'Sign In' },
];

const addressOptions = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [{ value: 'xihu', label: 'West Lake' }],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [{ value: 'zhonghuamen', label: 'Zhong Hua Men' }],
      },
    ],
  },
];
</script>
