# Ant Design of Vue

这里是 Ant Design 的 Vue 3 实现，开发和服务于企业级中后台产品。

<div class="pic-plus">
  <img width="150" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="Ant Design" />
  <span>+</span>
  <img width="160" src="/vue.png" alt="Vue" />
</div>

<style>
.pic-plus > * {
  display: inline-block !important;
  vertical-align: middle;
}
.pic-plus span {
  font-size: 30px;
  color: #aaa;
  margin: 0 20px;
}
</style>

## 特性

- 提炼自企业级中后台产品的交互语言和视觉风格。
- 75 个开箱即用的高质量 Vue 3 组件，完整 TypeScript 类型定义与 72 项 `ConfigProvider` 组件默认配置。
- `4.3.0` 默认开启原生 CSS Variables 并支持可选零运行时静态样式提取（`zeroRuntime`）。
- 共享 [Ant Design](https://ant.design/docs/spec/introduce-cn) 设计体系与可视化主题编辑器。

> 正在从 `4.2.6` 升级？请查阅 [从 4.2.6 升级到 4.3.0 指南](/docs/vue/migration-v43-cn)。

## 支持环境

- 现代浏览器（最近 2 个版本）；如需支持 IE9，请使用 `1.x` 版本。
- 支持服务端渲染（Nuxt 3 / Vite SSR），详见 [SSR 与静态样式导出](/docs/vue/ssr-extract-ssr-cn)。
- [Electron](https://www.electronjs.org/)

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br/>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br/>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br/>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br/>Electron |
| --- | --- | --- | --- | --- | --- |
| last 2 versions | last 2 versions | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 版本

- 稳定版：[![npm package](https://img.shields.io/npm/v/@hiltonkohler21/ant-design-vue.svg?style=flat-square)](https://www.npmjs.com/package/@hiltonkohler21/ant-design-vue)

你可以订阅：<https://github.com/HiltonKohler21/ant-design-vue/releases.atom> 获取稳定版发布通知。

## 安装

### 使用 npm / yarn / pnpm 安装

**我们推荐使用包管理器进行开发**，不仅可在 Vite 等现代构建工具中轻松调试，也可享受 ES Module Tree Shaking 与完整 TypeScript 生态。

```bash
npm install @hiltonkohler21/ant-design-vue@4.3.0
# 或
yarn add @hiltonkohler21/ant-design-vue@4.3.0
# 或
pnpm add @hiltonkohler21/ant-design-vue@4.3.0
```

如需在 Vite 项目中快速集成与自动按需引入，请参阅 [在 Vite 中使用](/docs/vue/use-with-vite-cn)。

### 浏览器引入

在浏览器中使用 `script` 和 `link` 标签直接引入文件，并使用全局变量 `antd`。

我们在 npm 发布包内的 `@hiltonkohler21/ant-design-vue/dist` 目录下提供了 `antd.js`、`antd.min.js` 和 `reset.css`。你也可以通过 [![jsdelivr](https://data.jsdelivr.com/v1/package/npm/@hiltonkohler21/ant-design-vue/badge)](https://www.jsdelivr.com/package/npm/@hiltonkohler21/ant-design-vue) 或 [UNPKG](https://unpkg.com/@hiltonkohler21/ant-design-vue/dist/) 获取。

> **强烈不推荐在生产环境直接引入全量 UMD 文件**，这样无法按需加载，也难以享受现代构建优化。
>
> 注意：引入 `antd.js` 前需要先行引入 `vue`、[`dayjs`](https://day.js.org/) 及其相关插件：

```html
<script src="https://unpkg.com/dayjs/dayjs.min.js"></script>
<script src="https://unpkg.com/dayjs/plugin/customParseFormat.js"></script>
<script src="https://unpkg.com/dayjs/plugin/weekday.js"></script>
<script src="https://unpkg.com/dayjs/plugin/localeData.js"></script>
<script src="https://unpkg.com/dayjs/plugin/weekOfYear.js"></script>
<script src="https://unpkg.com/dayjs/plugin/weekYear.js"></script>
<script src="https://unpkg.com/dayjs/plugin/advancedFormat.js"></script>
<script src="https://unpkg.com/dayjs/plugin/quarterOfYear.js"></script>
```

## 示例

```ts
import { createApp } from 'vue';
import { DatePicker } from '@hiltonkohler21/ant-design-vue';
import '@hiltonkohler21/ant-design-vue/dist/reset.css';
import App from './App.vue';

const app = createApp(App);
app.use(DatePicker).mount('#app');
```

### 按需加载与自动按需引入

`@hiltonkohler21/ant-design-vue` 默认支持基于 ES modules 的 Tree Shaking。如果你使用 Vite，推荐使用 [`unplugin-vue-components`](https://github.com/unplugin/unplugin-vue-components) 并配置 `AntDesignVueResolver({ importStyle: false })` 实现自动按需导入，完整配置请查看 [在 Vite 中使用](/docs/vue/use-with-vite-cn)。

## 链接

- [快速上手](/docs/vue/getting-started-cn)
- [在 Vite 中使用](/docs/vue/use-with-vite-cn)
- [从 4.2.6 升级到 4.3.0](/docs/vue/migration-v43-cn)
- [组件总览](/components/overview-cn)
- [定制主题](/docs/vue/customize-theme-cn)
- [通用属性](/docs/vue/common-props-cn)
- [常见问题](/docs/vue/faq-cn)
- [更新日志](/docs/vue/changelog-cn)
- [Ant Design of React](https://ant.design/)
- [Awesome Ant Design Vue](https://github.com/vueComponent/ant-design-vue-awesome)

## 如何贡献

如果你希望参与贡献，欢迎提交 [Pull Request](https://github.com/HiltonKohler21/ant-design-vue/pulls) 或在 [GitHub Issues](https://github.com/HiltonKohler21/ant-design-vue/issues) 反馈 Bug 与建议。

> 推荐阅读 [《提问的智慧》](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way) 与 [《如何向开源社区提问题》](https://github.com/seajs/seajs/issues/545)，清晰的可复现示例有助于更快定位问题。

## 关于 ant-design-vue

Ant Design 作为一门面向企业级产品的设计语言，经历多年演进已成为前端领域的事实标准。`@hiltonkohler21/ant-design-vue` 是 Ant Design 的 Vue 3 实现，在保持一致的视觉规范、HTML 结构与 CSS 体系的同时，充分结合 Vue 3 组合式 API、响应式系统与 TypeScript 生态，致力于为 Vue 开发者带来**愉悦**的开发体验。

## 特别感谢

[Ant Design Team](https://github.com/ant-design/ant-design/blob/master/AUTHORS.txt)
