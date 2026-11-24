<docs>
---
order: 7
debug: true
title:
  zh-CN: 同行布局
  en-US: Same line
---

## zh-CN

在同行内检查 Checkbox 与 Radio 的基线对齐效果。

## en-US

Check baseline alignment of Checkbox and Radio on the same line.
</docs>

<template>
  <div>
    <a-space :style="sharedStyle" align="center" wrap>
      <a-checkbox value="light" />
      <div>Bamboo</div>
      <a-checkbox value="little">Little</a-checkbox>
    </a-space>

    <a-space :style="sharedStyle" align="center" wrap>
      <a-radio value="light" />
      <div>Bamboo</div>
      <a-radio value="little">Little</a-radio>
    </a-space>

    <div :style="{ ...sharedStyle, display: 'flex', alignItems: 'center', gap: '8px' }">
      <a-checkbox value="light" />
      <div>Bamboo</div>
      <a-checkbox value="little">Little</a-checkbox>
    </div>

    <div :style="{ ...sharedStyle, display: 'flex', alignItems: 'center', gap: '8px' }">
      <a-radio value="light" />
      <div>Bamboo</div>
      <a-radio value="little">Little</a-radio>
    </div>

    <div>
      <a-config-provider
        :theme="{
          token: {
            controlHeight: 48,
          },
        }"
      >
        <a-checkbox>Aligned</a-checkbox>
      </a-config-provider>
    </div>

    <div>
      <a-checkbox>
        <span :style="{ fontSize: '32px' }">Aligned</span>
      </a-checkbox>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue';

const sharedStyle: CSSProperties = {
  border: '1px solid #ff4d4f',
  marginBottom: '16px',
  padding: '4px 8px',
  maxWidth: '100%',
};
</script>
