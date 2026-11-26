<docs>
---
order: 11
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Card 的[语义化结构](#semantic-dom)样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Card by passing objects/functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex gap="middle" wrap="wrap" class="card-style-class-demo">
    <a-card
      title="Object Card"
      variant="borderless"
      :class-names="cardClassNames"
      :styles="stylesCard"
    >
      <template #extra>
        <a-button type="link">More</a-button>
      </template>
      <template #actions>
        <HeartOutlined key="heart" style="color: #ff6b6b" />
        <ShareAltOutlined key="share" style="color: #4ecdc4" />
        <EditOutlined key="edit" style="color: #45b7d1" />
      </template>
      <a-card-meta title="Object Card Meta title" description="This is the description">
        <template #avatar>
          <a-avatar :src="avatarUrl" />
        </template>
      </a-card-meta>
    </a-card>
    <a-card title="Function Card" :class-names="cardClassNames" :styles="stylesCardFn">
      <template #extra>
        <a-button type="link" :styles="{ root: { color: '#A7AAE1' } }">More</a-button>
      </template>
      <template #actions>
        <HeartOutlined key="heart" style="color: #ff6b6b" />
        <ShareAltOutlined key="share" style="color: #4ecdc4" />
        <EditOutlined key="edit" style="color: #45b7d1" />
      </template>
      <a-card-meta title="Function Card Meta title" description="This is the description">
        <template #avatar>
          <a-avatar :src="avatarUrl" />
        </template>
      </a-card-meta>
    </a-card>
  </a-flex>
</template>

<script lang="ts" setup>
import { EditOutlined, HeartOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import type { CardProps } from '@hiltonkohler21/ant-design-vue';

const avatarUrl =
  'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23e6f4ff%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2224%22%20r%3D%2211%22%20fill%3D%22%231677ff%22%2F%3E%3Cpath%20d%3D%22M14%2055c2.5-11%209.5-17%2018-17s15.5%206%2018%2017%22%20fill%3D%22%231677ff%22%2F%3E%3C%2Fsvg%3E';

const cardClassNames: CardProps['classNames'] = {
  root: 'custom-card-root',
  header: 'custom-card-header',
  body: 'custom-card-body',
};

const stylesCard: CardProps['styles'] = {
  root: {
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    borderRadius: '8px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 500,
  },
};

const stylesCardFn: CardProps['styles'] = info => {
  if (info.props.variant === 'outlined') {
    return {
      root: {
        borderColor: '#696FC7',
        boxShadow: '0 2px 8px #A7AAE1',
        borderRadius: '8px',
      },
      extra: {
        color: '#696FC7',
      },
      title: {
        fontSize: '16px',
        fontWeight: 500,
        color: '#A7AAE1',
      },
    };
  }
  return {};
};
</script>

<style scoped>
.card-style-class-demo :deep(.custom-card-root) {
  width: 300px;
  max-width: 100%;
  background-color: var(--ant-color-bg-container, #fff);
  border-radius: var(--ant-border-radius, 8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--ant-color-border-secondary, #f0f0f0);
}

.card-style-class-demo :deep(.custom-card-header) {
  border-bottom: none;
  padding-bottom: 8px;
}

.card-style-class-demo :deep(.custom-card-body) {
  padding-top: 0;
}
</style>
