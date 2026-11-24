<docs>
---
order: 14
debug: true
title:
  zh-CN: 在 Form 中 Debug
  en-US: Debug in Form
---

## zh-CN

在 Form 中与 `Space.Compact` 组合调试。

## en-US

Debug AutoComplete with `Space.Compact` inside Form.
</docs>

<template>
  <a-form :style="{ margin: '0 auto', maxWidth: '100%' }" v-bind="formItemLayout">
    <a-form-item label="单独 AutoComplete">
      <a-auto-complete />
    </a-form-item>
    <a-form-item label="单独 TreeSelect">
      <a-tree-select />
    </a-form-item>
    <a-form-item label="添加 Space.Compact 正常">
      <a-space-compact block>
        <a-tree-select :style="{ width: '30%' }" />
        <a-auto-complete :style="{ flex: 1, minWidth: '0' }" />
      </a-space-compact>
    </a-form-item>
    <a-form-item label="包含 search 图标正常">
      <a-auto-complete>
        <a-input>
          <template #suffix>
            <SearchOutlined />
          </template>
        </a-input>
      </a-auto-complete>
    </a-form-item>
    <a-form-item label="同时有 Space.Compact 和图标">
      <a-space-compact block>
        <a-tree-select :style="{ width: '30%' }" />
        <a-auto-complete :style="{ flex: 1, minWidth: '0' }">
          <a-input>
            <template #suffix>
              <SearchOutlined />
            </template>
          </a-input>
        </a-auto-complete>
      </a-space-compact>
    </a-form-item>
    <a-form-item label="同时有 Space.Compact 和 Search">
      <a-space-compact block>
        <a-tree-select :style="{ width: '30%' }" />
        <a-auto-complete :style="{ flex: 1, minWidth: '0' }">
          <a-input-search />
        </a-auto-complete>
      </a-space-compact>
    </a-form-item>
    <a-form-item label="Space.Compact 和 Button 结合">
      <a-space-compact block>
        <a-tree-select :style="{ width: '25%' }" />
        <a-auto-complete :style="{ flex: 1, minWidth: '0' }">
          <a-input-search />
        </a-auto-complete>
        <a-button type="primary">
          <template #icon>
            <SearchOutlined />
          </template>
          Search
        </a-button>
      </a-space-compact>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { SearchOutlined } from '@ant-design/icons-vue';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
</script>
