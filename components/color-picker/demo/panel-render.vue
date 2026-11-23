<docs>
---
order: 10
title:
  zh-CN: 自定义面板
  en-US: Custom Render Panel
---

## zh-CN

通过 `panelRender` 可以自由组合与扩展面板的内容结构。

## en-US

Customize and extend the panel content layout via `panelRender`.

</docs>
<template>
  <a-color-picker v-model:value="color" :panelRender="customPanelRender" showText />
</template>
<script lang="ts" setup>
import { ref, h } from 'vue';
import { Button, Divider, Space } from 'ant-design-vue';

const color = ref('#1677ff');

const customPanelRender = (panel: any) => {
  return h('div', [
    panel,
    h(Divider, { style: { margin: '8px 0' } }),
    h(
      Space,
      { style: { padding: '0 8px 8px 8px', width: '100%', justifyContent: 'space-between' } },
      () => [
        h('span', { style: { fontSize: '12px', color: '#888' } }, '自定义操作'),
        h(
          Button,
          { size: 'small', type: 'primary', onClick: () => alert(`当前颜色: ${color.value}`) },
          () => '确定',
        ),
      ],
    ),
  ]);
};
</script>
