<docs>
---
order: 3
title:
  zh-CN: 动态更新
  en-US: Dynamic
---

## zh-CN

动态新增和删除瀑布流项，并自动重新计算最短列分布。

## en-US

Dynamically add or remove items with automatic shortest-column re-layout.

</docs>

<template>
  <a-flex vertical :gap="16">
    <a-masonry :columns="4" :gutter="16" :items="items">
      <template #item="{ item }">
        <a-card size="small" :style="{ height: `${item.height}px` }">
          <div style="display: flex; align-items: center; justify-content: space-between">
            <span>Item {{ Number(item.key) + 1 }}</span>
            <a-button size="small" type="text" @click="removeItem(item.key)">
              <template #icon>
                <CloseOutlined />
              </template>
            </a-button>
          </div>
        </a-card>
      </template>
    </a-masonry>
    <a-button block @click="addItem">Add Item</a-button>
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { CloseOutlined } from '@ant-design/icons-vue';

interface DynamicMasonryItem {
  key: number;
  height: number;
}

const presetHeights = [130, 70, 100, 85, 115, 145, 95, 80, 110, 125, 75, 135];

let nextKey = presetHeights.length;

const items = ref<DynamicMasonryItem[]>(
  presetHeights.map((height, index) => ({
    key: index,
    height,
  })),
);

const removeItem = (removeKey: string | number) => {
  items.value = items.value.filter(item => item.key !== removeKey);
};

const addItem = () => {
  const height = presetHeights[nextKey % presetHeights.length];
  items.value = [
    ...items.value,
    {
      key: nextKey++,
      height,
    },
  ];
};
</script>
