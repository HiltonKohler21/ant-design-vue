<docs>
---
order: 8
version: 4.3.0
title:
  zh-CN: 自定义样式
  en-US: Customize
---

## zh-CN

自定义操作元素样式。

## en-US

Customize handle elements and style.

</docs>

<template>
  <div class="splitter-customize-demo">
    <a-config-provider :theme="splitterTheme">
      <a-splitter
        style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)"
        :dragger-icon="horizontalDraggerIcon"
        :collapsible="horizontalCollapsible"
      >
        <a-splitter-panel default-size="40%" min="20%" max="70%" collapsible>
          <a-flex justify="center" align="center" style="height: 100%">
            <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
              Panel 1
            </a-typography-title>
          </a-flex>
        </a-splitter-panel>

        <a-splitter-panel collapsible>
          <a-flex justify="center" align="center" style="height: 100%">
            <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
              Panel 2
            </a-typography-title>
          </a-flex>
        </a-splitter-panel>

        <a-splitter-panel :resizable="false">
          <a-flex justify="center" align="center" style="height: 100%">
            <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
              Panel 3
            </a-typography-title>
          </a-flex>
        </a-splitter-panel>
      </a-splitter>

      <a-divider />

      <a-splitter
        orientation="vertical"
        :class-names="verticalClassNames"
        style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)"
        :dragger-icon="null"
        :collapsible="verticalCollapsible"
      >
        <a-splitter-panel default-size="40%" min="30%" max="70%" collapsible>
          <a-flex justify="center" align="center" style="height: 100%">
            <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
              First
            </a-typography-title>
          </a-flex>
        </a-splitter-panel>

        <a-splitter-panel collapsible>
          <a-flex justify="center" align="center" style="height: 100%">
            <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
              Second
            </a-typography-title>
          </a-flex>
        </a-splitter-panel>
      </a-splitter>
    </a-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import {
  CaretDownOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
  CaretUpOutlined,
  ColumnWidthOutlined,
} from '@ant-design/icons-vue';
import type { ConfigProviderProps, SplitterProps } from '@hiltonkohler21/ant-design-vue';

const splitterTheme: ConfigProviderProps['theme'] = {
  components: {
    Splitter: {
      splitBarSize: 1,
      splitTriggerSize: 16,
    } as Record<string, any>,
  },
};

const horizontalDraggerIcon = () => h(ColumnWidthOutlined, { class: 'custom-dragger-icon' });

const horizontalCollapsible: SplitterProps['collapsible'] = {
  icon: {
    start: () => h(CaretLeftOutlined, { class: 'custom-collapsible-icon' }),
    end: () => h(CaretRightOutlined, { class: 'custom-collapsible-icon' }),
  },
};

const verticalClassNames: SplitterProps['classNames'] = {
  dragger: {
    default: 'custom-dragger',
    active: 'custom-dragger-active',
  },
};

const verticalCollapsible: SplitterProps['collapsible'] = {
  icon: {
    start: () => h(CaretUpOutlined, { class: 'custom-collapsible-icon' }),
    end: () => h(CaretDownOutlined, { class: 'custom-collapsible-icon' }),
  },
};
</script>

<style scoped>
.splitter-customize-demo :deep(.custom-dragger)::before {
  background-color: transparent !important;
  border: 1px dashed var(--ant-control-item-bg-hover, rgba(0, 0, 0, 0.04));
}

.splitter-customize-demo :deep(.custom-dragger:hover)::before,
.splitter-customize-demo :deep(.custom-dragger-active)::before {
  border: 1px dashed var(--ant-color-primary, #1677ff);
}

.splitter-customize-demo :deep(.custom-dragger-icon:hover) {
  color: var(--ant-color-primary, #1677ff);
}

.splitter-customize-demo :deep(.custom-collapsible-icon) {
  font-size: 16px;
  color: var(--ant-color-text-description, rgba(0, 0, 0, 0.45));
}

.splitter-customize-demo :deep(.custom-collapsible-icon:hover) {
  color: var(--ant-color-primary, #1677ff);
}
</style>
