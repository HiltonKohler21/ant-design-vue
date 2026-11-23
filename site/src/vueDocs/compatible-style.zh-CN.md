---
order: 6.5
title: 样式兼容
---

# 样式兼容

Ant Design Vue 支持最近 2 个版本的现代浏览器。默认启用了现代 CSS 特性以提升可维护性与主题性能；如需兼容旧版浏览器、Shadow DOM、rem 适配，或与 TailwindCSS 等三方样式库共存，可按需使用 `StyleProvider` 与 CSS `@layer` 进行配置。

> `StyleProvider` 以及内置转换器（`legacyLogicalPropertiesTransformer`、`px2remTransformer`）均已直接从 `ant-design-vue` 导出，无需额外安装独立包。

## 默认样式特性与兼容性一览

| 特性 | 最低 Chrome 版本 | 默认启用 | 兼容 / 降级方案 |
| --- | --- | --- | --- |
| CSS Variables（`--ant-*`） | Chrome 49 | 是（4.3.0+） | `<a-config-provider :theme="{ cssVar: false }">` 回退 hash 模式 |
| `:where()` 降权选择器 | Chrome 88 | 是 | `<a-style-provider hash-priority="high">` |
| CSS 逻辑属性（`inset` / `margin-inline-start`） | Chrome 89 | 是 | `<a-style-provider :transformers="[legacyLogicalPropertiesTransformer]">` |
| CSS `@layer` 级联层 | Chrome 99 | 按需使用 | 在全局样式顶部显式声明 `@layer` 顺序 |

## `:where` 选择器降权与 `hashPriority`

Ant Design Vue 的 CSS-in-JS 默认使用 `:where()` 包裹 hash 选择器，将组件样式权重降至最低，便于业务代码直接覆盖样式。若你需要兼容旧版浏览器（如 Chrome < 88）或希望提升组件自身权重（如避免被 TailwindCSS 基础 reset 覆盖），可将 `hash-priority` 设为 `high`：

```vue
<template>
  <!-- hash-priority 默认为 'low'；设为 'high' 后移除 :where() 包裹 -->
  <a-style-provider hash-priority="high">
    <MyApp />
  </a-style-provider>
</template>
```

转换前后的选择器对比：

```diff
- :where(.css-bAMboO).ant-btn {
+ .css-bAMboO.ant-btn {
    color: #fff;
  }
```

> 注意：
>
> 1. `hashPriority` 不支持运行时动态切换，修改后需重新渲染应用或刷新页面。
> 2. 关闭 `:where()` 降权后，如果业务自定义样式权重不足，可结合 PostCSS 插件（如 `postcss-increase-specificity` 或 `postcss-add-root-selector`）提升业务选择器权重。

## CSS 逻辑属性降级

为同时支持 LTR 与 RTL 布局，组件样式广泛使用了 CSS 逻辑属性（如 `inset`、`margin-inline-start`、`padding-block`）。如需兼容不支持逻辑属性的旧版浏览器（如部分旧版内核浏览器），可启用 `legacyLogicalPropertiesTransformer`：

```vue
<template>
  <a-style-provider :transformers="[legacyLogicalPropertiesTransformer]">
    <MyApp />
  </a-style-provider>
</template>

<script setup lang="ts">
import { legacyLogicalPropertiesTransformer } from 'ant-design-vue';
</script>
```

转换效果：

```diff
.ant-modal-root {
- inset: 0;
+ top: 0;
+ right: 0;
+ bottom: 0;
+ left: 0;
}
```

## rem 响应式适配（`px2remTransformer`）

在需要整体按根字号缩放的大屏或响应式场景中，可通过 `px2remTransformer` 自动将组件 CSS 中的 `px` 转换为 `rem`：

```vue
<template>
  <a-style-provider :transformers="[px2rem]">
    <MyApp />
  </a-style-provider>
</template>

<script setup lang="ts">
import { px2remTransformer } from 'ant-design-vue';

const px2rem = px2remTransformer({
  rootValue: 16, // 16px = 1rem（默认 16）
  precision: 5,
  mediaQuery: false,
});
</script>
```

### `px2remTransformer` 配置项

| 参数         | 说明                                    | 类型      | 默认值  |
| ------------ | --------------------------------------- | --------- | ------- |
| `rootValue`  | 根元素 `html` 字体基准大小（px）        | `number`  | `16`    |
| `precision`  | 转换后 `rem` 保留的小数位数             | `number`  | `5`     |
| `mediaQuery` | 是否同时转换 `@media` 媒体查询中的 `px` | `boolean` | `false` |

> 可将多个转换器合并传入，例如 `:transformers="[legacyLogicalPropertiesTransformer, px2rem]"`。注意 `transformers` 不支持动态变更。

## Shadow DOM 场景

在微前端或 Web Components 的 Shadow DOM 中，注入到 `document.head` 的 `<style>` 无法作用于 Shadow Root 内部。通过 `StyleProvider` 的 `container` 属性将样式挂载到 `shadowRoot`，同时建议配置 `ConfigProvider` 的 `getPopupContainer` 让弹层也留在 Shadow DOM 内：

```ts
import { createApp, defineComponent, h } from 'vue';
import Antd, { ConfigProvider, StyleProvider } from 'ant-design-vue';
import MyApp from './MyApp.vue';

const host = document.getElementById('shadow-host')!;
const shadowRoot = host.attachShadow({ mode: 'open' });
const mountEl = document.createElement('div');
shadowRoot.appendChild(mountEl);

const Root = defineComponent({
  setup() {
    return () =>
      h(StyleProvider, { container: shadowRoot }, () =>
        h(ConfigProvider, { getPopupContainer: () => mountEl }, () => h(MyApp)),
      );
  },
});

createApp(Root).use(Antd).mount(mountEl);
```

## CSS `@layer` 与 TailwindCSS 共存

当 `ant-design-vue` 与 TailwindCSS、UnoCSS 等原子化样式框架共存时，常见冲突是三方框架的基础重置（Preflight）与组件 `:where()` 低权重样式互相覆盖。通过显式规划 CSS `@layer` 层级可以彻底解决顺序冲突。

### TailwindCSS v4

TailwindCSS v4 内置了 `theme`、`base`、`components`、`utilities` 四个级联层。在全局入口 CSS 最顶部声明层顺序，并将 `reset.css`（以及 `zeroRuntime` 模式下的静态 `antdv.css`）放入对应层级：

```css
/* src/assets/main.css */
@layer theme, base, antd, components, utilities;

@import 'tailwindcss';
@import 'ant-design-vue/dist/reset.css' layer(base);

/* 若开启 4.3.0 zeroRuntime 并引入预提取静态 CSS，需指定 layer(antd) */
/* @import '../dist/static-style/antdv.css' layer(antd); */
```

- 在动态注入模式下，未包在 `@layer` 中的 `:where()` 组件样式天然高于 `@layer base`，从而避免被 Tailwind Preflight 重置按钮背景色，同时仍低于业务未分层样式；
- 如果你希望 Tailwind 的 `@layer utilities`（例如 `bg-red-500`、`p-4`）直接覆盖组件样式，可以：
  1. 在 `zeroRuntime` 模式下用 `@import '.../antdv.css' layer(antd);` 将组件样式置于 `utilities` 之前；或
  2. 在非 `zeroRuntime` 模式下为 Tailwind 原子类添加 `!` 修饰符（如 `!bg-red-500`），或在需要提升组件基础样式时配合 `<a-style-provider hash-priority="high">`。

### TailwindCSS v3

在 TailwindCSS v3 的入口样式中，将 `@tailwind base` 置于独立低权重层，避免覆盖组件默认样式：

```css
@layer tailwind-base, antd;

@layer tailwind-base {
  @tailwind base;
}

@tailwind components;
@tailwind utilities;
```

或直接在 `tailwind.config.js` 中关闭 Preflight：

```js
module.exports = {
  corePlugins: {
    preflight: false,
  },
};
```

### `reset.css` 与 `zeroRuntime` 静态 CSS（`antdv.css`）

当同时引入 `ant-design-vue/dist/reset.css` 与 `npm run static-style-extract` 产出的 `antdv.css` 时，建议显式划分 `@layer`，确保 `reset.css` 永远不会覆盖组件样式：

```css
@layer reset, antd;

@import 'ant-design-vue/dist/reset.css' layer(reset);
@import '../dist/static-style/antdv.css' layer(antd);
```

### SSR 场景下的 `@layer` 加载顺序

在服务端渲染（Nuxt 3 / Vite SSR）中，声明 `@layer` 顺序的规则**必须出现在任何内联 `<style>` 或组件样式之前**，否则浏览器会按首次出现顺序锁定层优先级：

#### ❌ 错误顺序

```html
<head>
  <!-- 样式先出现，导致 @layer 优先级被提前锁定 -->
  <style data-antdv-cssvar>
    /* ... */
  </style>
  <link rel="stylesheet" href="/assets/main.css" />
</head>
```

#### ✅ 正确顺序

```html
<head>
  <!-- 先声明 @layer 顺序 -->
  <style>
    @layer theme, base, antd, components, utilities;
  </style>
  <link rel="stylesheet" href="/assets/main.css" />
  <!-- 再插入 SSR 提取的变量与组件样式 -->
  <style data-antdv-cssvar>
    /* ... */
  </style>
  <!-- SSR component <style> blocks -->
</head>
```
