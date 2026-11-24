<docs>
---
order: 11
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom Semantic DOM Styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Tag 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Tag by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-space size="large" direction="vertical" class="tag-style-class-demo">
    <a-flex gap="middle">
      <a-tag :class-names="tagClassNames" :styles="stylesObject">
        <template #icon>
          <CheckCircleOutlined />
        </template>
        Object
      </a-tag>
      <a-tag variant="filled" :class-names="tagClassNames" :styles="stylesFn">
        <template #icon>
          <CloseCircleOutlined />
        </template>
        Function
      </a-tag>
    </a-flex>
    <a-flex vertical gap="middle">
      <a-checkable-tag-group
        :class-names="groupClassNames"
        :styles="groupStyles"
        :options="['React', 'Vue', 'Angular']"
      />
      <a-checkable-tag-group
        :class-names="groupClassNames"
        :styles="groupStylesFn"
        :options="['meet-student', 'thinkasany']"
        multiple
      />
    </a-flex>
  </a-space>
</template>

<script lang="ts" setup>
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';
import type { TagProps } from 'ant-design-vue';
import type { CheckableTagGroupProps } from 'ant-design-vue/es/tag';

const tagClassNames: TagProps['classNames'] = {
  root: 'custom-tag-root',
};

const groupClassNames: CheckableTagGroupProps['classNames'] = {
  root: 'custom-tag-root',
};

const stylesObject: TagProps['styles'] = {
  root: {
    backgroundColor: '#e6f7ff',
  },
  icon: {
    color: '#52c41a',
  },
  content: {
    color: '#262626',
  },
};

const stylesFn: TagProps['styles'] = info => {
  if (info.props.variant === 'filled') {
    return {
      root: {
        backgroundColor: '#F5EFFF',
      },
      icon: {
        color: '#8F87F1',
      },
      content: {
        color: '#8F87F1',
      },
    };
  }
  return {};
};

const groupStyles: CheckableTagGroupProps['styles'] = {
  root: {
    gap: '12px',
    padding: '8px 12px',
    backgroundColor: 'rgba(82, 196, 26, 0.08)',
    borderRadius: '8px',
  },
  item: {
    backgroundColor: 'rgba(82, 196, 26, 0.1)',
    borderColor: 'rgba(82, 196, 26, 0.3)',
    color: '#52c41a',
  },
};

const groupStylesFn: CheckableTagGroupProps['styles'] = info => {
  if (info.props.multiple) {
    return {
      root: {
        gap: '16px',
        padding: '8px 12px',
        backgroundColor: 'rgba(143, 135, 241, 0.08)',
        borderRadius: '8px',
      },
      item: {
        backgroundColor: 'rgba(143, 135, 241, 0.1)',
        borderColor: 'rgba(143, 135, 241, 0.3)',
        color: '#8F87F1',
        fontWeight: 500,
      },
    };
  }
  return {};
};
</script>

<style scoped>
.tag-style-class-demo :deep(.custom-tag-root) {
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
