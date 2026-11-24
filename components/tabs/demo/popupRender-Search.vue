<docs>
---
order: 9
version: 4.3.0
title:
  zh-CN: 自定义折叠菜单搜索
  en-US: Custom Popup Search
---

## zh-CN

通过 `popupRender` 属性自定义 Tabs 更多下拉菜单，支持搜索和键盘导航。

## en-US

Customize the Tabs more dropdown menu via `popupRender` prop, supporting search and keyboard navigation.
</docs>

<template>
  <a-tabs v-model:active-key="currentKey" :items="items" :more="moreConfig" />
</template>

<script lang="ts" setup>
import { computed, defineComponent, h, ref } from 'vue';
import { Input, Menu } from 'ant-design-vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import type { TabsProps } from 'ant-design-vue';

const items: TabsProps['items'] = Array.from({ length: 30 }, (_, i) => {
  const id = String(i);
  return {
    label: `Tab-${id}`,
    key: id,
    disabled: i === 28,
    children: `Content of tab ${id}`,
  };
});

const SearchPopup = defineComponent({
  name: 'SearchPopup',
  props: {
    restTabs: { type: Array as () => any[], required: true },
    activeKey: { type: String, required: true },
    onSelect: { type: Function as () => (key: string) => void, required: true },
  },
  setup(props) {
    const searchTerm = ref('');

    const fullTabs = computed(() =>
      props.restTabs.map(item => ({
        key: item.key,
        label: item.label ?? item.tab,
        disabled: item.disabled,
      })),
    );

    const filterTabs = computed(() =>
      !searchTerm.value
        ? fullTabs.value
        : fullTabs.value.filter(tab =>
            String(tab.label).toLowerCase().includes(searchTerm.value.toLowerCase()),
          ),
    );

    return () =>
      h('div', { class: 'tabs-search-popup-container' }, [
        h(
          'div',
          { class: 'tabs-search-popup-input' },
          h(Input, {
            placeholder: 'Search tabs...',
            value: searchTerm.value,
            allowClear: true,
            'onUpdate:value': (val: string) => {
              searchTerm.value = val;
            },
            prefix: h(SearchOutlined),
          }),
        ),
        h(
          'div',
          { class: 'tabs-search-popup-menu' },
          filterTabs.value.length > 0
            ? h(Menu, {
                selectedKeys: [props.activeKey],
                items: filterTabs.value,
                onClick: ({ key }: { key: string | number }) => {
                  searchTerm.value = '';
                  props.onSelect(String(key));
                },
              })
            : h('div', { class: 'tabs-search-popup-empty' }, 'No matching tabs'),
        ),
      ]);
  },
});

const currentKey = ref('1');

const moreConfig: TabsProps['more'] = {
  trigger: 'click',
  placement: 'bottomLeft',
  popupRender: (_, { restTabs, onClose }) =>
    h(SearchPopup, {
      restTabs,
      activeKey: currentKey.value,
      onSelect: (key: string) => {
        currentKey.value = key;
        onClose();
      },
    }),
};
</script>

<style>
.tabs-search-popup-container {
  width: 200px;
  background: var(--ant-color-bg-container, #fff);
  box-shadow: var(--ant-box-shadow-secondary, 0 6px 16px 0 rgba(0, 0, 0, 0.08));
  border-radius: var(--ant-border-radius-lg, 8px);
  overflow: hidden;
}
.tabs-search-popup-input {
  padding: 8px 12px;
  border-bottom: 1px solid var(--ant-color-border-secondary, #f0f0f0);
}
.tabs-search-popup-menu {
  max-height: 300px;
  overflow-y: auto;
}
.tabs-search-popup-empty {
  padding: 12px;
  color: var(--ant-color-text-disabled, rgba(0, 0, 0, 0.25));
  text-align: center;
}
</style>
