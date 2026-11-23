<docs>
---
order: 14
title:
  zh-CN: 表格
  en-US: Table
---

## zh-CN

为 Typography 内的原生 `<table>` 元素提供默认样式，适用于在文档中展示表格内容（如价格表、对比表等），无需使用完整的 Table 组件。

## en-US

Provides default styles for native `<table>` elements within Typography, suitable for displaying tabular content in documents (such as pricing tables, comparison charts, etc.) without using the full Table component.
</docs>
<template>
  <a-typography>
    <a-typography-title :level="4">Typography with Table</a-typography-title>

    <table>
      <thead>
        <tr>
          <th>Plan</th>
          <th>Price</th>
          <th>Features</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Basic</td>
          <td>Free</td>
          <td>1GB Storage, Basic Support</td>
        </tr>
        <tr>
          <td>Pro</td>
          <td>$9.99/month</td>
          <td>100GB Storage, Priority Support</td>
        </tr>
        <tr>
          <td>Enterprise</td>
          <td>Contact us</td>
          <td>Unlimited Storage, 24/7 Support</td>
        </tr>
      </tbody>
    </table>
  </a-typography>
</template>
