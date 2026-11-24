<docs>
---
order: 1
title:
  zh-CN: 带文字的分割线
  en-US: Divider with title
---

## zh-CN

分割线中带有文字，可以用 `titlePlacement` 指定文字位置。

## en-US

Divider with inner title, set `titlePlacement="start/end"` to align it.
</docs>

<template>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
    probare, quae sunt a te dicta? Refert tamen, quo modo.
  </p>
  <a-divider>Text</a-divider>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
    probare, quae sunt a te dicta? Refert tamen, quo modo.
  </p>
  <a-divider title-placement="start">Left Text</a-divider>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
    probare, quae sunt a te dicta? Refert tamen, quo modo.
  </p>
  <a-divider title-placement="end">Right Text</a-divider>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
    probare, quae sunt a te dicta? Refert tamen, quo modo.
  </p>
  <a-divider title-placement="start" :styles="{ content: { margin: 0 } }">
    Left Text margin with 0
  </a-divider>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
    probare, quae sunt a te dicta? Refert tamen, quo modo.
  </p>
  <a-divider title-placement="end" :styles="{ content: { margin: '0 50px' } }">
    Right Text margin with 50px
  </a-divider>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
    probare, quae sunt a te dicta? Refert tamen, quo modo.
  </p>
</template>
