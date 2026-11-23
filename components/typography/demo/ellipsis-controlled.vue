<docs>
---
order: 8
version: 4.3.0
title:
  zh-CN: 受控省略展开/收起
  en-US: Controlled ellipsis
---

## zh-CN

受控多行文本省略。

## en-US

Controlled multi line text omission.
</docs>
<template>
  <a-flex :gap="16" vertical>
    <a-flex :gap="16" align="center">
      <a-switch v-model:checked="expanded" style="flex: none" />
      <a-slider v-model:value="rows" :min="1" :max="20" style="flex: auto" />
    </a-flex>

    <a-typography-paragraph
      :ellipsis="{
        rows,
        expandable: 'collapsible',
        expanded,
        onExpand: (_, info) => (expanded = info.expanded),
      }"
      copyable
    >
      {{ repeatedText }}
    </a-typography-paragraph>
  </a-flex>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const rows = ref(2);
const expanded = ref(false);
const repeatedText =
  'Ant Design, a design language for background applications, is refined by Ant UED Team.'.repeat(
    20,
  );
</script>
