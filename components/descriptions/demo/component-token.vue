<docs>
---
order: 11
debug: true
title:
  zh-CN: 组件 Token
  en-US: Component Token
---

## zh-CN

Component Token Debug.

## en-US

Component Token Debug.
</docs>

<template>
  <a-config-provider :theme="themeConfig">
    <div>
      <a-radio-group v-model:value="size" @change="onChange">
        <a-radio value="default">default</a-radio>
        <a-radio value="middle">middle</a-radio>
        <a-radio value="small">small</a-radio>
      </a-radio-group>
      <br />
      <br />
      <a-descriptions bordered title="Custom Size" :size="size">
        <template #extra>
          <div>extra color: blue</div>
        </template>
        <a-descriptions-item label="Product">Cloud Database</a-descriptions-item>
        <a-descriptions-item label="Billing">Prepaid</a-descriptions-item>
        <a-descriptions-item label="Time">18:00:00</a-descriptions-item>
        <a-descriptions-item label="Amount">$80.00</a-descriptions-item>
        <a-descriptions-item label="Discount">$20.00</a-descriptions-item>
        <a-descriptions-item label="Official">$60.00</a-descriptions-item>
        <a-descriptions-item label="Config Info">
          Data disk type: MongoDB
          <br />
          Database version: 3.4
          <br />
          Package: dds.mongo.mid
          <br />
          Storage space: 10 GB
          <br />
          Replication factor: 3
          <br />
          Region: East China 1
          <br />
        </a-descriptions-item>
      </a-descriptions>
      <br />
      <br />
      <a-descriptions title="Custom Size" :size="size">
        <template #extra>
          <a-button type="primary">Edit</a-button>
        </template>
        <a-descriptions-item label="Product">Cloud Database</a-descriptions-item>
        <a-descriptions-item label="Billing">Prepaid</a-descriptions-item>
        <a-descriptions-item label="Time">18:00:00</a-descriptions-item>
        <a-descriptions-item label="Amount">$80.00</a-descriptions-item>
        <a-descriptions-item label="Discount">$20.00</a-descriptions-item>
        <a-descriptions-item label="Official">$60.00</a-descriptions-item>
      </a-descriptions>
    </div>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ConfigProviderProps, DescriptionsProps, RadioChangeEvent } from 'ant-design-vue';

const size = ref<DescriptionsProps['size']>('default');

const onChange = (e: RadioChangeEvent) => {
  console.log('size checked', e.target.value);
};

const themeConfig: ConfigProviderProps['theme'] = {
  components: {
    Descriptions: {
      labelBg: 'red',
      titleColor: 'red',
      titleMarginBottom: 2,
      itemPaddingBottom: 8,
      itemPaddingEnd: 8,
      colonMarginRight: 10,
      colonMarginLeft: 20,
      contentColor: 'green',
      extraColor: 'blue',
    } as Record<string, any>,
  },
};
</script>
