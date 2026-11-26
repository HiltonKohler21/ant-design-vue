<docs>
---
order: 13
debug: true
title:
  zh-CN: 按钮对齐
  en-US: Button alignment
---

## zh-CN

检查卡片 `extra`、`actions`、内联按钮组和气泡确认框中的按钮与图标垂直对齐。

## en-US

Verify vertical alignment and icon spacing of buttons in Card `extra`, `actions`, inline button groups, and Popconfirm.
</docs>

<template>
  <div class="card-button-alignment-debug">
    <a-config-provider :button="{ classNames: btnCls }">
      <a-flex vertical gap="middle">
        <a-card class="line-card" title="#57727 Card extra">
          <template #extra>
            <a-button>
              <template #icon><SmileOutlined /></template>
              Test
            </a-button>
          </template>
          Button in Card extra should be vertically centered with the title.
        </a-card>

        <a-card title="#59725 Card actions">
          <template #actions>
            <a-button key="button">
              <template #icon><SmileOutlined /></template>
              Edit
            </a-button>
            <a-button key="link-button" href="#edit">
              <template #icon><SmileOutlined /></template>
              Edit
            </a-button>
            <a key="link" href="#details">Details</a>
          </template>
          Buttons with and without href should have the same icon spacing.
        </a-card>

        <a-card title="#57896 regression minimum case">
          <a-space wrap>
            <a-button>Cancel</a-button>
            <a-button type="primary">
              <template #icon><SmileOutlined /></template>
              Confirm
            </a-button>
          </a-space>
        </a-card>

        <InternalPopconfirm title="Are you OK?" :ok-button-props="{ icon: h(SmileOutlined) }" />
      </a-flex>
    </a-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { SmileOutlined } from '@ant-design/icons-vue';
import { Popconfirm } from '@hiltonkohler21/ant-design-vue';
import type { ButtonProps } from '@hiltonkohler21/ant-design-vue';

const InternalPopconfirm = Popconfirm._InternalPanelDoNotUseOrYouWillBeFired;

const btnCls: ButtonProps['classNames'] = {
  icon: 'card-btn-align-icon',
  content: 'card-btn-align-content',
};
</script>

<style scoped>
.card-button-alignment-debug :deep(.card-btn-align-icon) {
  background: rgba(255, 0, 0, 0.1);
}

.card-button-alignment-debug :deep(.card-btn-align-icon span) {
  background: rgba(0, 255, 0, 0.5);
}

.card-button-alignment-debug :deep(.card-btn-align-content) {
  background: rgba(0, 0, 255, 0.1);
}
</style>
