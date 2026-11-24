<docs>
---
order: 13
debug: true
title:
  zh-CN: 线框风格
  en-US: Wireframe
---

## zh-CN

线框化样式。

## en-US

Wireframe style.
</docs>

<template>
  <a-config-provider :theme="{ token: { wireframe: true } }">
    <a-flex vertical gap="middle">
      <a-pagination show-size-changer :default-current="3" :total="500" />
      <a-pagination show-size-changer :default-current="3" :total="500" disabled />
      <a-pagination size="small" :default-current="50" :total="500" />
      <a-pagination disabled size="small" :default-current="50" :total="500" />
    </a-flex>
  </a-config-provider>
</template>
