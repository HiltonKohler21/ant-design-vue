<docs>
---
order: 5
title:
  zh-CN: 图标按钮
  en-US: Icon
---

## zh-CN

你可以通过 `icon` 属性或 `icon` 插槽为标签添加自定义图标。注意，`CheckableTag` 的 `icon` 属性在 `>=4.3.0` 版本支持。

若需要控制图标的位置，请在默认插槽中直接使用 `<XXXIcon />` 组件，而非通过 `icon` 属性实现。

`icon` 也支持第三方图标库的裸 `<svg>` 元素，无论其尺寸以 `em` 还是 `px` 设置，都会自动与文字居中对齐。

## en-US

You can add a custom icon to the tag via the `icon` prop or slot. Note that the `icon` prop for `CheckableTag` is supported in version `>=4.3.0`.

If you need to control the icon position, please use the `<XXXIcon />` component directly in the default slot instead of the `icon` prop.

`icon` also accepts a bare `<svg>` element from a third-party icon library. It stays vertically centred with the label whether it is sized in `em` or in `px`.

</docs>

<template>
  <a-divider title-placement="start">Tag with icon</a-divider>
  <a-flex gap="small" wrap align="center">
    <a-tag color="#55acee">
      <template #icon>
        <TwitterOutlined />
      </template>
      Twitter
    </a-tag>
    <a-tag color="#cd201f">
      <template #icon>
        <YoutubeOutlined />
      </template>
      Youtube
    </a-tag>
    <a-tag color="#3b5999">
      <template #icon>
        <FacebookOutlined />
      </template>
      Facebook
    </a-tag>
    <a-tag color="#55acee">
      <template #icon>
        <LinkedinOutlined />
      </template>
      LinkedIn
    </a-tag>
  </a-flex>

  <a-divider title-placement="start">CheckableTag with icon</a-divider>
  <a-flex gap="small" wrap align="center">
    <a-checkable-tag :checked="checked[0]" @change="val => handleChange(0, val)">
      <template #icon>
        <TwitterOutlined />
      </template>
      Twitter
    </a-checkable-tag>
    <a-checkable-tag :checked="checked[1]" @change="val => handleChange(1, val)">
      <template #icon>
        <YoutubeOutlined />
      </template>
      Youtube
    </a-checkable-tag>
    <a-checkable-tag :checked="checked[2]" @change="val => handleChange(2, val)">
      <template #icon>
        <FacebookOutlined />
      </template>
      Facebook
    </a-checkable-tag>
    <a-checkable-tag :checked="checked[3]" @change="val => handleChange(3, val)">
      <template #icon>
        <LinkedinOutlined />
      </template>
      LinkedIn
    </a-checkable-tag>
  </a-flex>

  <a-divider title-placement="start">Tag with third-party icon</a-divider>
  <a-flex gap="small" wrap align="center">
    <a-tag color="#f50">
      <template #icon>
        <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
        </svg>
      </template>
      Star (em)
    </a-tag>
    <a-tag color="#eb2f96">
      <template #icon>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path
            d="M12 20.7l-1.4-1.3C5.4 14.8 2 11.7 2 8a5 5 0 0 1 10-1.7A5 5 0 0 1 22 8c0 3.7-3.4 6.8-8.6 11.4L12 20.7z"
          />
        </svg>
      </template>
      Heart (px)
    </a-tag>
    <a-tag closable>
      <template #icon>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path
            d="M12 20.7l-1.4-1.3C5.4 14.8 2 11.7 2 8a5 5 0 0 1 10-1.7A5 5 0 0 1 22 8c0 3.7-3.4 6.8-8.6 11.4L12 20.7z"
          />
        </svg>
      </template>
      Closable
    </a-tag>
  </a-flex>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {
  FacebookOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from '@ant-design/icons-vue';

const checked = ref<boolean[]>([true, false, false, false]);

const handleChange = (index: number, value: boolean) => {
  const nextChecked = [...checked.value];
  nextChecked[index] = value;
  checked.value = nextChecked;
};
</script>
