<docs>
---
order: 9
title:
  zh-CN: 全部展示
  en-US: Show All
---

## zh-CN

展示所有配置选项。

## en-US

Show all configured prop.
</docs>

<template>
  <a-pagination
    :total="85"
    show-size-changer
    show-quick-jumper
    :show-total="total => `Total ${total} items`"
  />
</template>
