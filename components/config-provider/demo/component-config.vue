<docs>
---
order: 6
version: 4.3.0
title:
  zh-CN: 组件默认配置
  en-US: Component Config
---

## zh-CN

通过 `ConfigProvider` 的组件级配置属性（如 `button`、`card`、`empty`、`space`、`pagination`）统一设置子树内各组件的默认行为与样式。

## en-US

Configure shared default props across components (`button`, `card`, `empty`, `space`, `pagination`) at the `ConfigProvider` level.
</docs>

<template>
  <a-flex vertical gap="middle">
    <a-flex gap="middle" wrap="wrap" align="center">
      <a-space size="small">
        <span>Button variant:</span>
        <a-radio-group v-model:value="buttonVariant" size="small">
          <a-radio-button value="outlined">outlined</a-radio-button>
          <a-radio-button value="filled">filled</a-radio-button>
          <a-radio-button value="dashed">dashed</a-radio-button>
          <a-radio-button value="solid">solid</a-radio-button>
        </a-radio-group>
      </a-space>

      <a-space size="small">
        <span>Button autoInsertSpace:</span>
        <a-switch v-model:checked="autoInsertSpace" />
      </a-space>

      <a-space size="small">
        <span>Card variant:</span>
        <a-radio-group v-model:value="cardVariant" size="small">
          <a-radio-button value="outlined">outlined</a-radio-button>
          <a-radio-button value="borderless">borderless</a-radio-button>
        </a-radio-group>
      </a-space>

      <a-space size="small">
        <span>Space size:</span>
        <a-radio-group v-model:value="spaceSize" size="small">
          <a-radio-button value="small">small</a-radio-button>
          <a-radio-button value="middle">middle</a-radio-button>
          <a-radio-button value="large">large</a-radio-button>
        </a-radio-group>
      </a-space>

      <a-space size="small">
        <span>Simple Empty:</span>
        <a-switch v-model:checked="simpleEmpty" />
      </a-space>

      <a-space size="small">
        <span>Pagination showSizeChanger:</span>
        <a-switch v-model:checked="showSizeChanger" />
      </a-space>
    </a-flex>

    <div class="component-config-preview">
      <a-config-provider
        :button="buttonConfig"
        :card="cardConfig"
        :empty="emptyConfig"
        :space="spaceConfig"
        :pagination="paginationConfig"
      >
        <a-flex vertical gap="middle">
          <a-space wrap>
            <a-button>确定</a-button>
            <a-button>Cancel</a-button>
            <a-button color="primary">Primary</a-button>
          </a-space>

          <a-card title="Global Card Config" style="max-width: 320px">
            <p style="margin: 0">
              Card variant automatically follows
              <code>ConfigProvider.card.variant</code>
              .
            </p>
          </a-card>

          <a-empty />

          <a-pagination :total="100" />
        </a-flex>
      </a-config-provider>
    </div>
  </a-flex>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { Empty } from 'ant-design-vue';

const buttonVariant = ref<'outlined' | 'filled' | 'dashed' | 'solid'>('filled');
const autoInsertSpace = ref(true);
const cardVariant = ref<'outlined' | 'borderless'>('borderless');
const spaceSize = ref<'small' | 'middle' | 'large'>('middle');
const simpleEmpty = ref(true);
const showSizeChanger = ref(true);

const buttonConfig = computed(() => ({
  variant: buttonVariant.value,
  autoInsertSpace: autoInsertSpace.value,
}));

const cardConfig = computed(() => ({
  variant: cardVariant.value,
}));

const emptyConfig = computed(() => ({
  image: simpleEmpty.value ? Empty.PRESENTED_IMAGE_SIMPLE : Empty.PRESENTED_IMAGE_DEFAULT,
}));

const spaceConfig = computed(() => ({
  size: spaceSize.value,
}));

const paginationConfig = computed(() => ({
  showSizeChanger: showSizeChanger.value,
}));
</script>

<style scoped>
.component-config-preview {
  padding: 20px;
  background: var(--ant-color-bg-layout, #f5f5f5);
  border-radius: 8px;
}
</style>
