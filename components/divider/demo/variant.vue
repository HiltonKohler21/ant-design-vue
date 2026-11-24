<docs>
---
order: 7
title:
  zh-CN: 变体
  en-US: Variant
---

## zh-CN

分隔线默认为 `solid`（实线）变体。您可以将其更改为 `dashed`（虚线）或 `dotted`（点线）。

## en-US

Divider is of `solid` variant by default. You can change that to either `dashed` or `dotted`.
</docs>

<template>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
    probare, quae sunt a te dicta? Refert tamen, quo modo.
  </p>
  <a-divider style="border-color: #7cb305">Solid</a-divider>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
    probare, quae sunt a te dicta? Refert tamen, quo modo.
  </p>
  <a-divider variant="dotted" style="border-color: #7cb305">Dotted</a-divider>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
    probare, quae sunt a te dicta? Refert tamen, quo modo.
  </p>
  <a-divider variant="dashed" style="border-color: #7cb305" dashed>Dashed</a-divider>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
    probare, quae sunt a te dicta? Refert tamen, quo modo.
  </p>
</template>
