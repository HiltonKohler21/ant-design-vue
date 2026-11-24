<docs>
---
order: 11
debug: true
title:
  zh-CN: 紧凑布局嵌套
  en-US: Nested Space Compact
---

## zh-CN

嵌套使用的紧凑布局。

## en-US

Nested Space.Compact.

</docs>

<template>
  <div style="max-width: 100%; overflow-x: auto">
    <a-flex vertical gap="middle">
      <a-space-compact block>
        <a-space-compact>
          <a-space-compact>
            <a-input style="width: 90px" placeholder="Typing..." />
            <a-button>
              <template #icon><search-outlined /></template>
            </a-button>
          </a-space-compact>
          <a-space-compact>
            <a-input-number :default-value="12" />
            <a-select default-value="Option1" :options="selectOptions" />
          </a-space-compact>
        </a-space-compact>
        <a-button type="primary">Separator</a-button>
        <a-space-compact>
          <a-space-compact>
            <a-input-search style="width: 110px" placeholder="Search" />
            <a-button type="primary">Submit</a-button>
          </a-space-compact>
          <a-space-compact>
            <a-input default-value="mysite" />
            <a-button>
              <template #icon><copy-outlined /></template>
            </a-button>
          </a-space-compact>
        </a-space-compact>
      </a-space-compact>

      <a-space-compact block>
        <a-space-compact>
          <a-time-picker />
          <a-button type="primary">Submit</a-button>
        </a-space-compact>
        <a-button type="primary">~</a-button>
        <a-button type="primary">~</a-button>
        <a-space-compact>
          <a-cascader :options="addressOptions" placeholder="Select Address" />
          <a-button type="primary">Submit</a-button>
        </a-space-compact>
      </a-space-compact>

      <a-space-compact>
        <a-button color="default" variant="solid">Button 1</a-button>
        <a-button color="default" variant="solid">Button 2</a-button>
        <a-button color="danger" variant="solid">Button 3</a-button>
        <a-button color="danger" variant="solid">Button 4</a-button>
      </a-space-compact>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { CopyOutlined, SearchOutlined } from '@ant-design/icons-vue';

const selectOptions = [
  { label: 'Opt1', value: 'Option1' },
  { label: 'Opt2', value: 'Option2' },
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
