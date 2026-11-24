<docs>
---
order: 13
title:
  zh-CN: 嵌套
  en-US: Nested
---

## zh-CN

嵌套在多层弹窗中使用图片预览与图片组预览。

## en-US

Preview single images and image preview groups nested inside modals.
</docs>

<template>
  <a-button type="primary" @click="show1 = true">Open Modal</a-button>

  <a-modal v-model:open="show1" title="Modal Level 1" @ok="show1 = false">
    <a-button @click="show2 = true">Open Nested Modal 2</a-button>

    <a-modal v-model:open="show2" title="Modal Level 2" @ok="show2 = false">
      <a-button @click="show3 = true">Open Nested Modal 3</a-button>

      <a-modal v-model:open="show3" title="Modal Level 3" @ok="show3 = false">
        <a-image
          :width="180"
          alt="Ant Design Logo"
          src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        />
        <a-divider />
        <a-image-preview-group
          :preview="{
            onVisibleChange: vis => console.log('preview visible:', vis),
          }"
        >
          <a-space>
            <a-image
              :width="160"
              alt="Ant Design Logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            />
            <a-image
              :width="160"
              alt="Method Draw"
              src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
            />
          </a-space>
        </a-image-preview-group>
      </a-modal>
    </a-modal>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const show1 = ref(false);
const show2 = ref(false);
const show3 = ref(false);
</script>
