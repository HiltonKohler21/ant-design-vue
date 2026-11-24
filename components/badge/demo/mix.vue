<docs>
---
order: 13
debug: true
title:
  zh-CN: 各种混用的情况
  en-US: Mixed usage
---

## zh-CN

测试 `count` `status` `color` `dot` 共用的情况。

## en-US

Using `count/dot` with custom `status/color`.
</docs>

<template>
  <a-space size="middle" wrap>
    <a-space size="middle" wrap>
      <a-badge :count="5" status="success">
        <a-avatar shape="square" size="large" />
      </a-badge>
      <a-badge :count="5" status="warning">
        <a-avatar shape="square" size="large" />
      </a-badge>
      <a-badge :count="5" color="blue">
        <a-avatar shape="square" size="large" />
      </a-badge>
      <a-badge :count="5" color="#fa541c">
        <a-avatar shape="square" size="large" />
      </a-badge>
      <a-badge dot status="success">
        <a-avatar shape="square" size="large" />
      </a-badge>
      <a-badge dot status="warning">
        <a-avatar shape="square" size="large" />
      </a-badge>
      <a-badge dot status="processing">
        <a-avatar shape="square" size="large" />
      </a-badge>
      <a-badge dot color="blue">
        <a-avatar shape="square" size="large" />
      </a-badge>
      <a-badge dot color="#fa541c">
        <a-avatar shape="square" size="large" />
      </a-badge>
    </a-space>

    <a-space size="middle" wrap>
      <a-badge :count="0" show-zero />
      <a-badge :count="0" show-zero color="blue" />
      <a-badge :count="0" show-zero color="#f0f" />
      <a-badge :count="0" show-zero>
        <a-avatar shape="square" size="large" />
      </a-badge>
      <a-badge :count="0" show-zero color="blue">
        <a-avatar shape="square" size="large" />
      </a-badge>
      <a-badge :count="0" color="#f0f" />
      <a-badge status="success" :text="0" show-zero />
      <a-badge status="warning" :text="0" />
    </a-space>
  </a-space>
</template>
