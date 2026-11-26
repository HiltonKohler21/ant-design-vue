<docs>
---
order: 10
debug: true
title:
  zh-CN: 禁用标签
  en-US: Disabled
---

## zh-CN

设置 `disabled` 属性后，标签将不可用。

## en-US

Set the `disabled` property to make the tag unusable.
</docs>

<template>
  <context-holder />
  <a-flex vertical gap="middle">
    <a-flex gap="small" wrap>
      <a-tag disabled>Basic Tag</a-tag>
      <a-tag disabled>
        <a href="https://ant.design">Link Tag</a>
      </a-tag>
      <a-tag disabled href="https://ant.design">Href Tag</a-tag>
      <a-tag disabled color="success">
        <template #icon><CheckCircleOutlined /></template>
        Icon Tag
      </a-tag>
    </a-flex>

    <a-flex gap="small" wrap>
      <a-tag disabled color="red">Preset Color Red</a-tag>
      <a-tag disabled color="#f50">Custom Color #f50 Outlined</a-tag>
      <a-tag disabled color="#f50" variant="solid">Custom Color #f50 Filled</a-tag>
      <a-tag disabled color="#f50" variant="filled">Custom Color #f50 Borderless</a-tag>
      <a-tag disabled color="success">Preset Status Success</a-tag>
    </a-flex>

    <a-flex gap="small" wrap>
      <a-checkable-tag
        v-for="tag in tagsData"
        :key="tag"
        disabled
        :checked="selectedTags.includes(tag)"
        @change="checked => handleCheckableChange(tag, checked)"
      >
        {{ tag }}
      </a-checkable-tag>
    </a-flex>

    <a-flex gap="small" wrap>
      <a-tag disabled closable @close="() => handleClose('Closable')">Closable Tag</a-tag>
      <a-tag disabled closable color="success" @close="() => handleClose('Closable Success')">
        <template #icon><CheckCircleOutlined /></template>
        Closable with Icon
      </a-tag>
      <a-tag disabled closable>
        <template #closeIcon><CloseCircleOutlined /></template>
        Closable with Custom Icon
      </a-tag>
    </a-flex>

    <a-flex gap="small" wrap>
      <a-tag disabled variant="filled">Borderless Basic</a-tag>
      <a-tag disabled variant="filled" color="success">
        <template #icon><CheckCircleOutlined /></template>
        Borderless with Icon
      </a-tag>
      <a-tag disabled variant="filled" closable @close="() => handleClose('Borderless Closable')">
        Borderless Closable
      </a-tag>
    </a-flex>
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { message } from '@hiltonkohler21/ant-design-vue';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';

const [messageApi, contextHolder] = message.useMessage();
const tagsData = ['Books', 'Movies', 'Music'];
const selectedTags = ref<string[]>(['Books']);

const handleClose = (tagName: string) => {
  console.log(`Tag ${tagName} closed`);
  messageApi.info(`Tag ${tagName} closed`);
};

const handleCheckableChange = (tag: string, checked: boolean) => {
  selectedTags.value = checked
    ? [...selectedTags.value, tag]
    : selectedTags.value.filter(t => t !== tag);
  messageApi.info(`${tag} is ${checked ? 'checked' : 'unchecked'}`);
};
</script>
