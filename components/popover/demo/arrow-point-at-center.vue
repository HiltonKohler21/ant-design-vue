<docs>
---
order: 4
title:
  zh-CN: Arrow.pointAtCenter
  en-US: Arrow.pointAtCenter
debug: true
---

## zh-CN

设置了 `arrow: { pointAtCenter: true }` 后，箭头将指向目标元素的中心。

## en-US

The arrow points to the center of the target element when setting `arrow: { pointAtCenter: true }`.

</docs>
<template>
  <a-flex :gap="16" wrap>
    <div v-for="placement in placements" :key="placement" class="popover-arrow-center-item">
      <a-popover
        :placement="placement"
        :auto-adjust-overflow="false"
        :arrow="{ pointAtCenter: true }"
        :get-popup-container="getPopupContainer"
        open
      >
        <template #content>
          <a-flex align="center" justify="center">{{ placement }}</a-flex>
        </template>
        <div class="popover-arrow-center-box popover-arrow-center-cross" />
      </a-popover>
    </div>
  </a-flex>
</template>

<script lang="ts" setup>
import type { PopoverProps } from 'ant-design-vue';

type Placement = NonNullable<PopoverProps['placement']>;

const placements: Placement[] = [
  'topLeft',
  'top',
  'topRight',
  'leftTop',
  'left',
  'leftBottom',
  'rightTop',
  'right',
  'rightBottom',
  'bottomLeft',
  'bottom',
  'bottomRight',
];

const getPopupContainer = (trigger: HTMLElement) => trigger.parentElement || document.body;
</script>

<style scoped>
.popover-arrow-center-item {
  position: relative;
  width: 240px;
  max-width: 100%;
  height: 240px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed purple;
}

.popover-arrow-center-box {
  width: 40px;
  height: 40px;
  background-color: deepskyblue;
}

.popover-arrow-center-cross {
  position: relative;
}

.popover-arrow-center-cross::before,
.popover-arrow-center-cross::after {
  content: '';
  position: absolute;
  inset: 0;
}

.popover-arrow-center-cross::before {
  top: 50%;
  height: 1px;
  background-color: red;
}

.popover-arrow-center-cross::after {
  inset-inline-start: 50%;
  width: 1px;
  background-color: blue;
}
</style>
