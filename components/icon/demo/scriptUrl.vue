<docs>
---
order: 4
title:
  zh-CN: 使用 iconfont.cn 的多个资源
  en-US: Multiple resources from iconfont.cn
---

## zh-CN

`scriptUrl` 可引用多个资源，用户可灵活地管理 [iconfont.cn](https://iconfont.cn/) 图标。如果资源的图标出现重名，会按照数组顺序进行覆盖。

## en-US

You can use `scriptUrl` as an array to manage icons in one `<Icon />` from multiple [iconfont.cn](https://iconfont.cn/) resources. If an icon with a duplicate name is in resources, it will be overridden in array order.

</docs>

<template>
  <a-space>
    <icon-font type="icon-javascript" />
    <icon-font type="icon-java" />
    <icon-font type="icon-shoppingcart" />
    <icon-font type="icon-python" />
  </a-space>
</template>
<script lang="ts" setup>
import { createFromIconfontCN } from '@ant-design/icons-vue';

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js', // icon-javascript, icon-java, icon-shoppingcart (overridden)
    '//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js', // icon-shoppingcart, icon-python
  ],
});
</script>
