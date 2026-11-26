<docs>
---
order: 20.3
debug: true
title:
  zh-CN: 选项文本居中
  en-US: Options label Centered
---

## zh-CN

选项文本应该居中。

## en-US

Options label Centered.
</docs>

<template>
  <div>
    <a-space wrap>
      <a-select
        default-value="long, long, long piece of text"
        :style="{ width: '120px' }"
        allow-clear
        :options="options"
      />

      <a-select
        placeholder="Select a option"
        :style="{ width: '120px', height: '60px' }"
        allow-clear
        :options="options"
      />

      <a-select
        default-value="normal"
        placeholder="Select a option"
        :style="{ width: '120px' }"
        allow-clear
        :options="options"
      />

      <a-select
        :default-value="['normal']"
        mode="multiple"
        placeholder="Select a option"
        :style="{ width: '120px' }"
        allow-clear
        :options="options"
      />

      <a-select
        mode="multiple"
        placeholder="Select a option"
        :style="{ width: '120px', height: '60px' }"
        allow-clear
        :options="options"
      />

      <a-cascader
        placeholder="Select a option"
        :style="{ width: '120px', height: '60px' }"
        allow-clear
        :options="options"
      />

      <a-tree-select
        show-search
        :style="{ width: '120px', height: '60px' }"
        placeholder="Please select"
        allow-clear
        :popup-match-select-width="false"
        tree-default-expand-all
        :tree-data="treeData"
      />

      <a-select
        prefix="Hello World"
        mode="multiple"
        allow-clear
        placeholder="Select"
        :style="{ minWidth: '200px', maxWidth: '100%', height: '80px' }"
        :default-value="['long']"
        :options="options"
      />

      <a-select
        mode="multiple"
        :style="{ width: '200px', maxWidth: '100%' }"
        placeholder="请选择"
        max-tag-count="responsive"
        prefix="城市"
        :options="options"
      />

      <a-select
        :style="{ width: '200px', maxWidth: '100%' }"
        placeholder="请选择"
        prefix="城市"
        :options="options"
        show-search
        allow-clear
        status="error"
      />

      <a-select
        :style="{ width: '100px' }"
        prefix="Hi"
        :options="options"
        show-search
        allow-clear
        status="warning"
        variant="filled"
        default-value="Bamboo"
      />

      <a-select
        :style="{ width: '100px' }"
        prefix="Hi"
        :options="options"
        show-search
        allow-clear
        status="error"
        variant="borderless"
        default-value="Bamboo"
      />

      <a-form :model="formState" :style="{ width: '200px', maxWidth: '100%' }" layout="vertical">
        <a-form-item label="Label" name="selectVal" :style="{ boxShadow: '0 0 0 1px red' }">
          <a-select
            v-model:value="formState.selectVal"
            :options="options"
            allow-clear
            placeholder="bamboo"
          />
        </a-form-item>
        <a-form-item label="Label" name="acVal" :style="{ boxShadow: '0 0 0 1px red' }">
          <a-auto-complete
            v-model:value="formState.acVal"
            :options="options"
            allow-clear
            placeholder="bamboo"
          />
        </a-form-item>
      </a-form>
    </a-space>

    <a-flex vertical :style="{ width: '200px', maxWidth: '100%', marginTop: '12px' }" :gap="8">
      <a-input prefix="Hi" placeholder="Input" allow-clear />
      <a-select prefix="Hi" placeholder="Single" :options="options" allow-clear show-search />
      <a-select
        prefix="Hi"
        placeholder="Single"
        :options="options"
        allow-clear
        show-search
        default-value="Bamboo"
      />
      <a-select placeholder="Multiple" :options="options" allow-clear mode="multiple" />
      <a-select prefix="Hi" placeholder="Multiple" :options="options" allow-clear mode="multiple" />
      <a-select
        prefix="Hi"
        placeholder="Multiple"
        :options="options"
        allow-clear
        mode="multiple"
        :default-value="['Bamboo']"
      />
      <a-select
        placeholder="Multiple"
        :options="options"
        allow-clear
        mode="multiple"
        :default-value="['Bamboo']"
      />
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { h, reactive } from 'vue';
import { Typography } from '@hiltonkohler21/ant-design-vue';

const options = [
  { value: 'long', label: h(Typography, null, () => 'long, long, long piece of text') },
  { value: 'short', label: h(Typography, null, () => 'short') },
  { value: 'normal', label: h('div', 'normal') },
];

const treeData = [
  {
    value: 'parent 1',
    title: 'parent 1',
    children: [
      { value: 'long', title: 'long, long, long piece of text' },
      { value: 'short', title: 'short' },
      { value: 'normal', title: 'normal' },
    ],
  },
];

const formState = reactive({
  selectVal: 'Bamboo',
  acVal: 'Bamboo',
});
</script>
