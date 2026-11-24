<docs>
---
order: 12
debug: true
title:
  zh-CN: 多样的 Child
  en-US: Diverse Child
---

## zh-CN

Debug usage

## en-US

Debug usage

</docs>

<template>
  <a-space wrap>
    Button
    <a-button>Button</a-button>
    Button
    <a-popconfirm title="Are you sure delete this task?" ok-text="Yes" cancel-text="No">
      <a-button>Delete</a-button>
    </a-popconfirm>
    <a-popconfirm title="Are you sure delete this task?" ok-text="Yes" cancel-text="No">
      <a-button disabled>Delete</a-button>
    </a-popconfirm>
    <template v-if="false">Hidden</template>
    {{ 1 }}
    Button
  </a-space>
</template>
