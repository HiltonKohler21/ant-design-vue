<docs>
---
order: 17
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象或者函数可以自定义 Modal 组件的 [语义化结构](#semantic-dom) 样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Modal by passing objects or functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex gap="middle">
    <a-button @click="modalOpen = true">Open Style Modal</a-button>
    <a-button type="primary" @click="modalFnOpen = true">Open Function Modal</a-button>
    <a-modal
      v-model:open="modalOpen"
      centered
      :class-names="modalClassNames"
      :footer="null"
      title="Custom Style Modal"
      :styles="modalStyles"
      @ok="modalOpen = false"
    >
      <div :style="lineStyle">
        Following the Ant Design specification, we developed a Vue UI library ant-design-vue that
        contains a set of high quality components and demos for building rich, interactive user
        interfaces.
      </div>
      <div :style="lineStyle">🌈 Enterprise-class UI designed for web applications.</div>
      <div :style="lineStyle">📦 A set of high-quality Vue components out of the box.</div>
      <div :style="lineStyle">🛡 Written in TypeScript with predictable static types.</div>
      <div :style="lineStyle">⚙️ Whole package of design resources and development tools.</div>
      <div :style="lineStyle">🌍 Internationalization support for dozens of languages.</div>
      <div :style="lineStyle">🎨 Powerful theme customization in every detail.</div>
    </a-modal>
    <a-modal
      v-model:open="modalFnOpen"
      centered
      :class-names="modalClassNames"
      title="Custom Function Modal"
      :styles="modalStylesFn"
      :mask="{ enabled: true, blur: true }"
      @ok="modalFnOpen = false"
    >
      <template #footer>
        <a-button
          :styles="{ root: { borderColor: '#ccc', color: '#171717', backgroundColor: '#fff' } }"
          @click="modalFnOpen = false"
        >
          Cancel
        </a-button>
        <a-button
          type="primary"
          :styles="{ root: { backgroundColor: '#171717' } }"
          @click="modalOpen = true"
        >
          Submit
        </a-button>
      </template>
      <div :style="lineStyle">
        Following the Ant Design specification, we developed a Vue UI library ant-design-vue that
        contains a set of high quality components and demos for building rich, interactive user
        interfaces.
      </div>
      <div :style="lineStyle">🌈 Enterprise-class UI designed for web applications.</div>
      <div :style="lineStyle">📦 A set of high-quality Vue components out of the box.</div>
      <div :style="lineStyle">🛡 Written in TypeScript with predictable static types.</div>
      <div :style="lineStyle">⚙️ Whole package of design resources and development tools.</div>
      <div :style="lineStyle">🌍 Internationalization support for dozens of languages.</div>
      <div :style="lineStyle">🎨 Powerful theme customization in every detail.</div>
    </a-modal>
  </a-flex>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import { ref } from 'vue';
import type { ModalProps } from '@hiltonkohler21/ant-design-vue';

const modalOpen = ref<boolean>(false);
const modalFnOpen = ref<boolean>(false);

const lineStyle: CSSProperties = {
  lineHeight: '28px',
};

const modalClassNames: ModalProps['classNames'] = {
  container: 'modal-style-class-demo-container',
};

const modalStyles: ModalProps['styles'] = {
  mask: {
    backgroundImage: 'linear-gradient(to top, #18181b 0, rgba(21, 21, 22, 0.2) 100%)',
  },
};

const modalStylesFn: ModalProps['styles'] = info => {
  if (info.props.footer) {
    return {
      container: {
        borderRadius: '14px',
        border: '1px solid #ccc',
        padding: '0px',
        overflow: 'hidden',
      },
      header: {
        padding: '16px',
      },
      body: {
        padding: '16px',
      },
      footer: {
        padding: '16px 10px',
        backgroundColor: '#fafafa',
      },
    };
  }
  return {};
};
</script>

<style>
.modal-style-class-demo-container {
  border-radius: 10px;
  padding: 10px;
}
</style>
