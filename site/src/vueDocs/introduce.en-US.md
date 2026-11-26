# Ant Design of Vue

Following the Ant Design specification, `@hiltonkohler21/ant-design-vue` is a Vue 3 UI component library designed for enterprise-level web applications.

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

## Features

- An enterprise-class UI design language for desktop web applications.
- 75 high-quality Vue 3 components out of the box with complete TypeScript definitions and 72 `ConfigProvider` component defaults.
- Native CSS Variables enabled by default in `4.3.0`, plus optional zero-runtime static CSS extraction (`zeroRuntime`).
- Shared [Ant Design](https://ant.design/docs/spec/introduce) design system and visual Theme Editor.

> Upgrading from `4.2.6`? Read the [4.2.6 to 4.3.0 Migration Guide](/docs/vue/migration-v43).

## Environment Support

- Modern browsers (last 2 versions). For IE9+, please use `1.x`.
- Server-Side Rendering (Nuxt 3 / Vite SSR) — see [SSR & Static Style Extraction](/docs/vue/ssr-extract-ssr).
- [Electron](https://www.electronjs.org/)

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br/>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br/>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br/>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br/>Electron |
| --- | --- | --- | --- | --- | --- |
| last 2 versions | last 2 versions | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## Version

- Stable: [![npm package](https://img.shields.io/npm/v/@hiltonkohler21/ant-design-vue.svg?style=flat-square)](https://www.npmjs.com/package/@hiltonkohler21/ant-design-vue)

Subscribe to new releases via Atom feed: <https://github.com/HiltonKohler21/ant-design-vue/releases.atom>

## Installation

### Using npm, yarn, or pnpm

**We recommend installing via a package manager** to take advantage of modern bundlers like Vite, ES module tree shaking, and full TypeScript tooling.

```bash
npm install @hiltonkohler21/ant-design-vue@4.3.0
# or
yarn add @hiltonkohler21/ant-design-vue@4.3.0
# or
pnpm add @hiltonkohler21/ant-design-vue@4.3.0
```

For Vite setup and automatic on-demand imports, see [Use in Vite](/docs/vue/use-with-vite).

### Import in Browser

Add `script` and `link` tags to use the global `antd` variable.

Prebuilt `antd.js`, `antd.min.js`, and `reset.css` are shipped under `@hiltonkohler21/ant-design-vue/dist`, also available on [![jsdelivr](https://data.jsdelivr.com/v1/package/npm/@hiltonkohler21/ant-design-vue/badge)](https://www.jsdelivr.com/package/npm/@hiltonkohler21/ant-design-vue) and [unpkg](https://unpkg.com/@hiltonkohler21/ant-design-vue/dist/).

> **We strongly discourage using the full UMD bundle in production**, as it disables tree shaking and modern build optimizations.
>
> Note: Load `vue`, [`dayjs`](https://day.js.org/), and required `dayjs` plugins before `antd.js`:

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

## Usage

```ts
import { createApp } from 'vue';
import { DatePicker } from '@hiltonkohler21/ant-design-vue';
import '@hiltonkohler21/ant-design-vue/dist/reset.css';
import App from './App.vue';

const app = createApp(App);
app.use(DatePicker).mount('#app');
```

### Tree Shaking & Automatic On-Demand Imports

`@hiltonkohler21/ant-design-vue` supports ES module tree shaking out of the box. In Vite projects, pair it with [`unplugin-vue-components`](https://github.com/unplugin/unplugin-vue-components) and `AntDesignVueResolver({ importStyle: false })` — see [Use in Vite](/docs/vue/use-with-vite).

## Links

- [Getting Started](/docs/vue/getting-started)
- [Use in Vite](/docs/vue/use-with-vite)
- [4.2.6 to 4.3.0 Migration Guide](/docs/vue/migration-v43)
- [Components Overview](/components/overview)
- [Customize Theme](/docs/vue/customize-theme)
- [Common Props](/docs/vue/common-props)
- [FAQ](/docs/vue/faq)
- [Change Log](/docs/vue/changelog)
- [Ant Design of React](https://ant.design/)
- [Awesome Ant Design Vue](https://github.com/vueComponent/ant-design-vue-awesome)

## Contributing

We welcome [Pull Requests](https://github.com/HiltonKohler21/ant-design-vue/pulls) and bug reports via [GitHub Issues](https://github.com/HiltonKohler21/ant-design-vue/issues).

> Please review [How To Ask Questions The Smart Way](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way) and include a minimal reproduction when reporting issues.

## About ant-design-vue

Ant Design has become an industry-standard design language for enterprise applications. `@hiltonkohler21/ant-design-vue` brings Ant Design's visual language, DOM structure, and design token system natively to Vue 3 with Composition API and full TypeScript support, aiming to give Vue developers a **pleasant** experience.

## Special Thanks

[Ant Design Team](https://github.com/ant-design/ant-design/blob/master/AUTHORS.txt)
