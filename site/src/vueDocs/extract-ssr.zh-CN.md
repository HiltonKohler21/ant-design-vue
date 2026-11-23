# SSR 与静态样式导出

在服务端渲染（SSR）场景中，`ant-design-vue@4.3.0` 提供两种样式输出方案，你可以根据项目的主题复杂度与缓存策略进行选择：

- **按请求内联抽取（Inline SSR）**：在服务端通过 `StyleProvider` + `createCache` 收集当前页面实际渲染到的组件样式与 `:root` CSS 变量，随 HTML 一起下发。优点是零多余样式、天然支持动态多主题；缺点是 HTML 体积略增。
- **构建期静态整体导出（Zero-Runtime / Static Extract）**：预先将组件样式与 `--ant-*` 变量烘焙为独立 `.css` 文件并开启 `zeroRuntime: true`。优点是可被 CDN 强缓存、客户端零 `<style>` 运行时注入开销；适合主题固定的应用。

> **4.3.0 `cssVar` 默认开启重要提示**：在 `4.3.0` 中，组件规则引用 `--ant-*` CSS 变量，因此除了使用 `extractStyle(cache)` 提取组件规则外，还需一并调用 `extractCSSVarStyle()` 提取 `:root` CSS 变量声明块，否则首屏 HTML 会缺少主题变量定义。

## 方案一：按请求内联抽取（Vue 3 `createSSRApp` + `renderToString`）

在每次服务端渲染请求中创建独立的 `cache`，用 `StyleProvider` 包裹根组件渲染，再通过 `extractStyle(cache)` 与 `extractCSSVarStyle()` 拼装完整 `<style>`：

```ts
// entry-server.ts
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import Antd, {
  StyleProvider,
  createCache,
  extractStyle,
  extractCSSVarStyle,
  clearCSSVarRegistry,
} from 'ant-design-vue';
import App from './App.vue';

export async function render() {
  clearCSSVarRegistry();
  const cache = createCache();

  const app = createSSRApp({
    render() {
      return h(StyleProvider, { cache, mock: 'server' }, () => h(App));
    },
  });
  app.use(Antd);

  // 1. 渲染组件树 HTML
  const html = await renderToString(app);

  // 2. 提取组件 CSS 规则（默认返回包含 <style> 标签的字符串；传 true 返回纯 CSS 文本）
  const componentStyles = extractStyle(cache);

  // 3. 提取 4.3.0 CSS 变量声明（:root { --ant-color-primary: ... }）
  const cssVarText = extractCSSVarStyle();
  const cssVarStyles = cssVarText ? `<style data-antdv-cssvar>${cssVarText}</style>` : '';

  return {
    html,
    headTags: `${cssVarStyles}\n${componentStyles}`,
  };
}
```

将返回的 `headTags` 与 `html` 注入 HTML 模板：

```ts
const pageHtml = `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    ${headTags}
  </head>
  <body>
    <div id="app">${html}</div>
  </body>
</html>`;
```

## 方案二：零运行时静态样式提取（4.3.0+ 推荐）

如果应用使用固定主题（或仅需一套预定义主题），可以直接在构建阶段提取完整静态 CSS，并在运行时开启 `zeroRuntime: true`，彻底消除客户端动态注入 `<style>` 的开销。

### 1. 使用内置提取脚本

```bash
npm run static-style-extract
```

脚本会在 `dist/static-style/antdv.css` 生成包含 `:root` CSS 变量与组件规则的完整静态样式表。

### 2. 应用入口引入并开启 `zeroRuntime`

```ts
// src/main.ts
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import '../dist/static-style/antdv.css';
import App from './App.vue';

createApp(App).use(Antd).mount('#app');
```

```vue
<!-- src/App.vue -->
<template>
  <a-config-provider :theme="{ cssVar: true, zeroRuntime: true }">
    <RouterView />
  </a-config-provider>
</template>
```

### 3. 自定义主题或多主题静态提取

你也可以基于 Vue 3 `renderToString` 编写自定义静态提取脚本，将自己的 `ConfigProvider` 主题烘焙进 CSS 文件：

```ts
// scripts/genAntdvCss.ts
import fs from 'node:fs';
import path from 'node:path';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import {
  Button,
  Card,
  ConfigProvider,
  Input,
  Modal,
  Select,
  Space,
  StyleProvider,
  Table,
  Tabs,
  Tag,
  createCache,
  extractStyle,
  extractCSSVarStyle,
  clearCSSVarRegistry,
} from 'ant-design-vue';

async function buildStaticCss() {
  clearCSSVarRegistry();
  const cache = createCache();

  const customTheme = {
    cssVar: true,
    zeroRuntime: true,
    token: {
      colorPrimary: '#00b96b',
      borderRadius: 8,
    },
  };

  const app = createSSRApp({
    render() {
      return h(StyleProvider, { cache, mock: 'server' }, () =>
        h(ConfigProvider, { theme: customTheme }, () => [
          h(Button, { type: 'primary' }, () => 'Button'),
          h(Input),
          h(Select, { options: [] }),
          h(Tag, () => 'Tag'),
          h(Card, { title: 'Card' }, () => 'Body'),
          h(Tabs, { items: [{ key: '1', label: 'Tab 1', children: 'Content' }] }),
          h(Table, { columns: [{ title: 'Name', dataIndex: 'name' }], dataSource: [] }),
          h(Modal, { open: false }),
          h(Space),
        ]),
      );
    },
  });

  await renderToString(app);

  // 第二个参数传 true 返回纯 CSS 文本（不带 <style> 包裹）
  const css = `${extractCSSVarStyle()}\n${extractStyle(cache, true)}`;
  const outFile = path.resolve(process.cwd(), 'public/antdv.min.css');
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, css, 'utf8');
}

buildStaticCss();
```

> 若需要快速提取全量组件默认样式，也可使用内置模块 `ant-design-vue/lib/_util/static-style-extract`（使用 `h(ConfigProvider, ...)` 包裹节点）。

## Nuxt 3 集成指南

在 Nuxt 3 中，你可以通过服务端插件收集每次请求的 Ant Design Vue 样式并注入到 `<head>`：

```ts
// plugins/antdv-ssr.ts
import { defineNuxtPlugin } from '#app';
import Antd, {
  createCache,
  extractStyle,
  extractCSSVarStyle,
  clearCSSVarRegistry,
  useStyleProvider,
} from 'ant-design-vue';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(Antd);

  if (import.meta.server) {
    clearCSSVarRegistry();
    const cache = createCache();

    // 在根应用上下文提供 SSR cache
    nuxtApp.vueApp.mixin({
      created() {
        if (this.$parent === null) {
          useStyleProvider({ cache, mock: 'server' });
        }
      },
    });

    nuxtApp.hooks.hook('app:rendered', () => {
      const componentCss = extractStyle(cache, true);
      const cssVarCss = extractCSSVarStyle();
      const combined = `${cssVarCss}\n${componentCss}`.trim();

      if (combined) {
        nuxtApp.ssrContext?.head?.push({
          style: [{ innerHTML: combined, tagPriority: 'high' }],
        });
      }
    });
  }
});
```

在 `nuxt.config.ts` 中确保正确转译相关依赖：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['ant-design-vue/dist/reset.css'],
  build: {
    transpile: ['ant-design-vue', '@ant-design/icons-vue'],
  },
});
```

## Vite SSR 集成指南

在基于 Vite 的自定义 Node SSR 服务（Express / Fastify / Hono）中，可在 `index.html` 中预留 `<!--antdv-head-->` 与 `<!--ssr-outlet-->` 占位符：

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <!--antdv-head-->
  </head>
  <body>
    <div id="app"><!--ssr-outlet--></div>
    <script type="module" src="/src/entry-client.ts"></script>
  </body>
</html>
```

在服务端入口替换占位符即可完成无闪烁首屏渲染：

```ts
// server.ts（核心片段）
const { html, headTags } = await render(url);
const finalHtml = template
  .replace('<!--antdv-head-->', headTags)
  .replace('<!--ssr-outlet-->', html);

res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
```

## 相关 API 速查

| 导出方法 / 组件 | 导入路径 | 说明 |
| --- | --- | --- |
| `StyleProvider` | `ant-design-vue` | 样式上下文容器，传入 `:cache="cache"` 以收集 SSR 样式 |
| `createCache()` | `ant-design-vue` | 创建单次渲染隔离的样式缓存实体 |
| `extractStyle(cache, plain?)` | `ant-design-vue` | 从缓存导出组件 CSS；`plain = true` 时返回纯 CSS 文本，默认返回 `<style>` HTML |
| `extractCSSVarStyle()` | `ant-design-vue` | 导出 `4.3.0` CSS 变量模式下已登记的全部 `:root` / 组件级变量声明块 |
| `clearCSSVarRegistry()` | `ant-design-vue` | 清空变量登记表，适用于 SSR 请求前或多次离线构建提取 |
