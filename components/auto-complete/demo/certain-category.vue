<docs>
---
order: 4
title:
  zh-CN: 查询模式 - 确定类目
  en-US: Lookup-Patterns - Certain Category
---

## zh-CN

查询模式 - 确定类目。

## en-US

Lookup-Patterns - Certain Category.
</docs>

<template>
  <div class="certain-category-search-wrapper" style="width: 250px">
    <a-auto-complete
      v-model:value="value"
      class="certain-category-search"
      :class-names="{ popup: { root: 'certain-category-search-dropdown' } }"
      :popup-match-select-width="500"
      style="width: 250px"
      :options="dataSource"
    >
      <template #option="item">
        <template v-if="item.options">
          <span>
            {{ item.value }}
            <a
              style="float: right"
              href="https://www.google.com/search?q=antd"
              target="_blank"
              rel="noopener noreferrer"
            >
              more
            </a>
          </span>
        </template>
        <template v-else-if="item.value === 'all'">
          <a
            href="https://www.google.com/search?q=ant-design-vue"
            target="_blank"
            rel="noopener noreferrer"
          >
            View all results
          </a>
        </template>
        <template v-else>
          <div style="display: flex; justify-content: space-between">
            {{ item.value }}
            <span>
              <UserOutlined />
              {{ item.count }}
            </span>
          </div>
        </template>
      </template>
      <a-input-search placeholder="input here" size="large"></a-input-search>
    </a-auto-complete>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';
const dataSource = [
  {
    value: 'Libraries',
    options: [
      {
        value: 'AntDesignVue',
        count: 10000,
      },
      {
        value: 'AntDesignVue UI',
        count: 10600,
      },
    ],
  },
  {
    value: 'Solutions',
    options: [
      {
        value: 'AntDesignVue UI FAQ',
        count: 60100,
      },
      {
        value: 'AntDesignVue FAQ',
        count: 30010,
      },
    ],
  },
  {
    value: 'Articles',
    options: [
      {
        value: 'AntDesignVue design language',
        count: 100000,
      },
    ],
  },
  {
    value: 'all',
  },
];
const value = ref('');
</script>

<style>
.certain-category-search-dropdown .ant-select-item-group {
  color: var(--ant-color-text-secondary, #666);
  font-weight: bold;
}

.certain-category-search-dropdown .ant-select-item-option {
  padding-left: 16px;
}
</style>
