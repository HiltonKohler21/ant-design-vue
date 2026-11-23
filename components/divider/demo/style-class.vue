<docs>
---
order: 7
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象或函数，自定义 `Divider` 内部 `root`、`rail`、`content` 语义化结构的类名与行内样式。

## en-US

Pass an object or function to `classNames` and `styles` to customize semantic `root`, `rail`, and `content` DOM structures of `Divider`.

</docs>

<template>
  <div>
    <a-divider
      title-placement="start"
      :styles="{
        rail: { borderColor: '#1677ff', borderWidth: '2px' },
        content: { color: '#1677ff', fontWeight: 600 },
      }"
    >
      Object Styles
    </a-divider>
    <a-divider
      variant="dashed"
      title-placement="end"
      :styles="
        ({ props }) => ({
          rail: { borderColor: props.variant === 'dashed' ? '#52c41a' : '#d9d9d9' },
          content: { color: '#52c41a' },
        })
      "
    >
      Function Styles
    </a-divider>
    <div>
      Text
      <a-divider vertical :styles="{ rail: { borderColor: '#fa8c16', borderWidth: '2px' } }" />
      Vertical
    </div>
  </div>
</template>
