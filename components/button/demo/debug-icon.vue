<docs>
---
order: 5
debug: true
title:
  zh-CN: 调试图标按钮
  en-US: Debug Icon Button
---

## zh-CN

调试使用

## en-US

Debug usage
</docs>

<template>
  <a-radio-group v-model:value="size">
    <a-radio-button value="large">Large</a-radio-button>
    <a-radio-button value="middle">Default</a-radio-button>
    <a-radio-button value="small">Small</a-radio-button>
  </a-radio-group>
  <a-divider title-placement="start" plain>Preview</a-divider>
  <a-config-provider :component-size="size">
    <a-flex gap="small" vertical>
      <a-flex gap="small" wrap="wrap">
        <a-tooltip title="search">
          <a-button type="primary" shape="circle" :icon="h(SearchOutlined)" />
        </a-tooltip>
        <a-button type="primary" shape="circle">A</a-button>
        <a-button type="primary" :icon="h(SearchOutlined)">Search</a-button>
        <a-tooltip title="search">
          <a-button shape="circle" :icon="h(SearchOutlined)" />
        </a-tooltip>
        <a-button :icon="h(SearchOutlined)">Search</a-button>
      </a-flex>
      <a-flex gap="small" wrap="wrap">
        <a-tooltip title="search">
          <a-button shape="circle" :icon="h(SearchOutlined)" />
        </a-tooltip>
        <a-button :icon="h(SearchOutlined)">Search</a-button>
        <a-tooltip title="search">
          <a-button type="dashed" shape="circle" :icon="h(SearchOutlined)" />
        </a-tooltip>
        <a-button type="dashed" :icon="h(SearchOutlined)">Search</a-button>
        <a-button :icon="h(SearchOutlined)" href="https://www.google.com" target="_blank" />
        <a-button>
          <SearchOutlined />
          Search
        </a-button>
      </a-flex>
      <a-divider plain>https://github.com/ant-design/ant-design/issues/51811</a-divider>
      <a-flex gap="small" wrap="wrap">
        <a-button>without icon</a-button>
        <a-button :icon="h(SearchOutlined)">with icon</a-button>
      </a-flex>
      <a-divider plain>https://github.com/ant-design/ant-design/issues/52124</a-divider>
      <a-flex gap="small" wrap="wrap">
        <a-button style="height: 60px">without icon</a-button>
        <a-button :icon="h(SearchOutlined)" style="height: 60px">with icon</a-button>
      </a-flex>
      <a-divider plain>https://github.com/ant-design/ant-design/issues/51380</a-divider>
      <a-flex gap="small" wrap="wrap" align="center">
        <a-button size="large" :icon="h(CustomColumnsIcon, { class: 'my-class-name' })" />
        <a-button size="large" :icon="h(CustomColumnsIcon)">custom icon</a-button>
        <a-button :icon="h(SearchOutlined)" />
        <a-button :icon="h(SearchOutlined)">with icon</a-button>
        <a-button size="large">without icon</a-button>
        <a-input-search style="width: 100px" />
      </a-flex>
      <a-divider plain>https://github.com/ant-design/ant-design/issues/51380</a-divider>
      <div style="overflow: hidden; max-width: 100%">
        <a-flex
          gap="small"
          style="
            width: fit-content;
            transform: scale(1.8);
            transform-origin: left top;
            margin-bottom: 44px;
          "
        >
          <a-button :icon="h(MinusSquareOutlined)" />
          <a-button :icon="h(Icon12Size)" />
          <a-button :icon="h(Icon16Size)" />
          <a-button :icon="h(IconIrregularSize)" />
        </a-flex>
      </div>
    </a-flex>
  </a-config-provider>

  <a-config-provider
    :theme="{
      components: { Button: { paddingInline: 100, paddingInlineLG: 150, paddingInlineSM: 50 } },
    }"
  >
    <a-divider plain>paddingInline / paddingInlineLG / paddingInlineSM</a-divider>

    <p style="margin-bottom: 12px">
      Icon-only button should not be affected by paddingInline / paddingInlineLG / paddingInlineSM
    </p>

    <a-flex :gap="8" style="margin-bottom: 12px">
      <a-button size="small" shape="default" :icon="h(ArrowDownOutlined)" />
      <a-button size="small" shape="round" :icon="h(ArrowDownOutlined)" />
      <a-button size="small" shape="circle" :icon="h(ArrowDownOutlined)" />
    </a-flex>

    <a-flex :gap="8" style="margin-bottom: 12px">
      <a-button shape="default" :icon="h(ArrowDownOutlined)" />
      <a-button shape="round" :icon="h(ArrowDownOutlined)" />
      <a-button shape="circle" :icon="h(ArrowDownOutlined)" />
    </a-flex>

    <a-flex :gap="8" style="margin-bottom: 12px">
      <a-button size="large" shape="default" :icon="h(ArrowDownOutlined)" />
      <a-button size="large" shape="round" :icon="h(ArrowDownOutlined)" />
      <a-button size="large" shape="circle" :icon="h(ArrowDownOutlined)" />
    </a-flex>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { ArrowDownOutlined, MinusSquareOutlined, SearchOutlined } from '@ant-design/icons-vue';
import type { ConfigProviderProps } from 'ant-design-vue';

type SizeType = ConfigProviderProps['componentSize'];

const size = ref<SizeType>('large');

const CustomColumnsIcon = () =>
  h(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: '1em',
      height: '1em',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
    [
      h('path', {
        d: 'M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18',
      }),
    ],
  );

/** 12px 图标 */
const Icon12Size = () => h('div', { style: { background: 'red', width: '12px', height: '12px' } });
/** 16px 图标 */
const Icon16Size = () =>
  h('div', { style: { background: 'green', width: '16px', height: '16px' } });
/** 不规则宽高 */
const IconIrregularSize = () =>
  h('div', { style: { background: 'blue', width: '14px', height: '16px' } });
</script>
