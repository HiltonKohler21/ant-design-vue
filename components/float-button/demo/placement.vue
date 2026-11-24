<docs>
---
order: 7
version: 4.3.0
title:
  zh-CN: 弹出方向
  en-US: Placement
---

## zh-CN

自定义菜单弹出位置，支持 `top`、`right`、`bottom`、`left` 四个方向，默认为 `top`。

## en-US

Customize menu animation placement, supporting `top`, `right`, `bottom`, and `left` directions, defaulting to `top`.

</docs>

<template>
  <a-flex justify="space-evenly" align="center" :style="wrapperStyle">
    <div :style="boxStyle">
      <a-float-button-group
        v-for="(item, index) in placements"
        :key="item.placement"
        trigger="click"
        :placement="item.placement"
        :style="{
          position: 'absolute',
          insetInlineEnd: `${insetInlineEnd[index]}px`,
          bottom: `${bottom[index]}px`,
        }"
      >
        <template #icon>
          <component :is="item.icon" />
        </template>
        <a-float-button />
        <a-float-button>
          <template #icon>
            <CommentOutlined />
          </template>
        </a-float-button>
      </a-float-button-group>
    </div>
  </a-flex>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import {
  CommentOutlined,
  DownOutlined,
  LeftOutlined,
  RightOutlined,
  UpOutlined,
} from '@ant-design/icons-vue';
import type { FloatButtonGroupPlacement } from 'ant-design-vue';

const BOX_SIZE = 100;
const BUTTON_SIZE = 40;

const wrapperStyle: CSSProperties = {
  width: '100%',
  height: '360px',
  overflow: 'hidden',
  position: 'relative',
};

const boxStyle: CSSProperties = {
  width: `${BOX_SIZE}px`,
  height: `${BOX_SIZE}px`,
  position: 'relative',
};

const insetInlineEnd = [
  (BOX_SIZE - BUTTON_SIZE) / 2,
  -(BUTTON_SIZE / 2),
  (BOX_SIZE - BUTTON_SIZE) / 2,
  BOX_SIZE - BUTTON_SIZE / 2,
];

const bottom = [
  BOX_SIZE - BUTTON_SIZE / 2,
  (BOX_SIZE - BUTTON_SIZE) / 2,
  -(BUTTON_SIZE / 2),
  (BOX_SIZE - BUTTON_SIZE) / 2,
];

const placements: Array<{ placement: FloatButtonGroupPlacement; icon: any }> = [
  { placement: 'top', icon: UpOutlined },
  { placement: 'right', icon: RightOutlined },
  { placement: 'bottom', icon: DownOutlined },
  { placement: 'left', icon: LeftOutlined },
];
</script>
