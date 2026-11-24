<docs>
---
order: 12
version: 4.3.0
title:
  zh-CN: 自定义语义结构的样式和类
  en-US: Custom semantic dom styling
---

## zh-CN

通过 `classNames` 和 `styles` 传入对象或者函数可以自定义 Drawer 组件的 [语义化结构](#semantic-dom) 样式。

## en-US

You can customize the [semantic dom](#semantic-dom) style of Drawer by passing objects or functions through `classNames` and `styles`.
</docs>

<template>
  <a-flex gap="middle">
    <a-button @click="drawerOpen = true">Open Style Drawer</a-button>
    <a-button type="primary" @click="drawerFnOpen = true">Open Function Drawer</a-button>
  </a-flex>
  <a-drawer
    v-model:open="drawerOpen"
    :class-names="drawerClassNames"
    :size="500"
    title="Custom Style Drawer"
    :styles="stylesObject"
    @close="drawerOpen = false"
  >
    <div :style="lineStyle">
      Following the Ant Design specification, we developed a Vue UI library that contains a set of
      high quality components and demos for building rich, interactive user interfaces.
    </div>
    <div :style="lineStyle">🌈 Enterprise-class UI designed for web applications.</div>
    <div :style="lineStyle">📦 A set of high-quality Vue components out of the box.</div>
    <div :style="lineStyle">🛡 Written in TypeScript with predictable static types.</div>
    <div :style="lineStyle">⚙️ Whole package of design resources and development tools.</div>
    <div :style="lineStyle">🌍 Internationalization support for dozens of languages.</div>
    <div :style="lineStyle">🎨 Powerful theme customization in every detail.</div>
  </a-drawer>
  <a-drawer
    v-model:open="drawerFnOpen"
    :class-names="drawerClassNames"
    :size="500"
    title="Custom Function drawer"
    :styles="stylesFn"
    :mask="{ enabled: true, blur: true }"
    @close="drawerFnOpen = false"
  >
    <div :style="lineStyle">
      Following the Ant Design specification, we developed a Vue UI library that contains a set of
      high quality components and demos for building rich, interactive user interfaces.
    </div>
    <div :style="lineStyle">🌈 Enterprise-class UI designed for web applications.</div>
    <div :style="lineStyle">📦 A set of high-quality Vue components out of the box.</div>
    <div :style="lineStyle">🛡 Written in TypeScript with predictable static types.</div>
    <div :style="lineStyle">⚙️ Whole package of design resources and development tools.</div>
    <div :style="lineStyle">🌍 Internationalization support for dozens of languages.</div>
    <div :style="lineStyle">🎨 Powerful theme customization in every detail.</div>
    <template #footer>
      <a-flex gap="middle" justify="flex-end">
        <a-button
          :style="{ borderColor: '#ccc', color: '#171717', backgroundColor: '#fff' }"
          @click="drawerFnOpen = false"
        >
          Cancel
        </a-button>
        <a-button
          type="primary"
          :style="{ backgroundColor: '#171717' }"
          @click="drawerFnOpen = false"
        >
          Submit
        </a-button>
      </a-flex>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { CSSProperties } from 'vue';
import type { DrawerProps } from 'ant-design-vue';

const drawerOpen = ref(false);
const drawerFnOpen = ref(false);

const lineStyle: CSSProperties = {
  lineHeight: '28px',
};

const drawerClassNames: DrawerProps['classNames'] = {
  root: 'demo-drawer-root',
};

const stylesObject: DrawerProps['styles'] = {
  mask: {
    backgroundImage: 'linear-gradient(to top, #18181b 0, rgba(21, 21, 22, 0.2) 100%)',
  },
};

const stylesFn: DrawerProps['styles'] = info => {
  if (info.props.footer) {
    return {
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
.demo-drawer-root {
  border-radius: 10px;
}
</style>
