<docs>
---
order: 13
debug: true
title:
  zh-CN: 尺寸混合
  en-US: Size Mix
---

## zh-CN

混合使用像素与百分比尺寸约束。

## en-US

Mix pixel and percentage size constraints.

</docs>

<template>
  <div>
    <a-radio-group v-model:value="sizeBucket" style="margin-bottom: 16px">
      <a-radio-button :value="1">Size Bucket 1</a-radio-button>
      <a-radio-button :value="2">Size Bucket 2</a-radio-button>
    </a-radio-group>
    <div style="max-width: 100%; overflow-x: auto">
      <a-splitter
        :key="sizeBucket"
        style="height: 300px; width: 1000px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)"
      >
        <a-splitter-panel v-bind="currentBuckets[0]">
          <a-flex justify="center" align="center" style="height: 100%">
            <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
              First
            </a-typography-title>
          </a-flex>
        </a-splitter-panel>
        <a-splitter-panel v-bind="currentBuckets[1]">
          <a-flex justify="center" align="center" style="height: 100%">
            <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
              Second
            </a-typography-title>
          </a-flex>
        </a-splitter-panel>
        <a-splitter-panel v-bind="currentBuckets[2]">
          <a-flex justify="center" align="center" style="height: 100%">
            <a-typography-title type="secondary" :level="5" style="white-space: nowrap; margin: 0">
              Third
            </a-typography-title>
          </a-flex>
        </a-splitter-panel>
      </a-splitter>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

const SIZE_BUCKETS_1 = [
  { defaultSize: 100, min: 100, max: 200 },
  { min: 100, max: 200 },
  { min: '20%' },
];

const SIZE_BUCKETS_2 = [{ min: 300 }, { min: 100, max: 200 }, { min: 600 }];

const sizeBucket = ref(1);
const currentBuckets = computed(() => (sizeBucket.value === 1 ? SIZE_BUCKETS_1 : SIZE_BUCKETS_2));
</script>
