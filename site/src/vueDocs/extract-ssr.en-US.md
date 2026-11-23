# SSR & Static Style Extraction

`ant-design-vue@4.3.0` offers two SSR styling strategies depending on your theming needs and caching architecture:

- **Per-Request Inline Extraction (Inline SSR)**: Collect only the component rules and `:root` CSS variables used during each server render via `StyleProvider` + `createCache`, and inline them into `<head>`. Zero unused CSS and full dynamic multi-theme support, at the cost of slightly larger HTML payloads.
- **Build-Time Static Extraction (Zero-Runtime)**: Pre-bake component styles and `--ant-*` variables into a static `.css` file and enable `zeroRuntime: true`. Cacheable by CDNs with zero runtime `<style>` injection overhead; ideal for apps with fixed themes.

> **Important for 4.3.0 default `cssVar: true`**: Because component rules reference `--ant-*` custom properties, you must extract **both** component styles (`extractStyle(cache)`) and `:root` variable blocks (`extractCSSVarStyle()`) during SSR so the initial HTML renders with complete theme variables.

## Approach 1: Per-Request Inline Extraction (Vue 3 `createSSRApp` + `renderToString`)

Create a fresh `cache` per request, wrap your app in `StyleProvider`, render with Vue 3's `renderToString`, and combine `extractStyle(cache)` with `extractCSSVarStyle()`:

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

  // 1. Render component tree to HTML
  const html = await renderToString(app);

  // 2. Extract component CSS rules (returns <style> tags by default; pass true for raw CSS)
  const componentStyles = extractStyle(cache);

  // 3. Extract 4.3.0 CSS variable declarations (:root { --ant-color-primary: ... })
  const cssVarText = extractCSSVarStyle();
  const cssVarStyles = cssVarText ? `<style data-antdv-cssvar>${cssVarText}</style>` : '';

  return {
    html,
    headTags: `${cssVarStyles}\n${componentStyles}`,
  };
}
```

Inject `headTags` and `html` into your HTML shell:

```ts
const pageHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    ${headTags}
  </head>
  <body>
    <div id="app">${html}</div>
  </body>
</html>`;
```

## Approach 2: Zero-Runtime Static CSS Extraction (4.3.0+)

For fixed-theme applications, pre-extract a static CSS file at build time and enable `zeroRuntime: true` to eliminate runtime `<style>` injection completely.

### 1. Run the Built-In Extraction Script

```bash
npm run static-style-extract
```

This generates `dist/static-style/antdv.css` containing both `:root` CSS variables and component rules.

### 2. Import the Stylesheet and Enable `zeroRuntime`

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

### 3. Custom Theme Static Extraction Script

You can write a Vue 3 SSR script to pre-bake your own custom `ConfigProvider` theme into a static CSS file:

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

  // Pass `true` as 2nd argument to extract plain CSS without <style> wrappers
  const css = `${extractCSSVarStyle()}\n${extractStyle(cache, true)}`;
  const outFile = path.resolve(process.cwd(), 'public/antdv.min.css');
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, css, 'utf8');
}

buildStaticCss();
```

> For a quick full-library default stylesheet, you can also use `ant-design-vue/lib/_util/static-style-extract` with a Vue `h(ConfigProvider, ...)` wrapper.

## Nuxt 3 Guide

Use a Nuxt plugin to collect styles on the server and push them into `<head>` after rendering:

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

Transpile the packages in `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['ant-design-vue/dist/reset.css'],
  build: {
    transpile: ['ant-design-vue', '@ant-design/icons-vue'],
  },
});
```

## Vite SSR Guide

In a custom Vite SSR server (Express / Fastify / Hono), place `<!--antdv-head-->` and `<!--ssr-outlet-->` markers in `index.html`:

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
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

Replace both placeholders in your server handler:

```ts
// server.ts (core snippet)
const { html, headTags } = await render(url);
const finalHtml = template
  .replace('<!--antdv-head-->', headTags)
  .replace('<!--ssr-outlet-->', html);

res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
```

## API Quick Reference

| Export | Package | Description |
| --- | --- | --- |
| `StyleProvider` | `ant-design-vue` | Style context provider; pass `:cache="cache"` to collect SSR styles |
| `createCache()` | `ant-design-vue` | Creates an isolated style cache instance per render |
| `extractStyle(cache, plain?)` | `ant-design-vue` | Extracts component CSS; returns plain CSS when `plain = true`, otherwise `<style>` HTML tags |
| `extractCSSVarStyle()` | `ant-design-vue` | Extracts all registered `:root` / component CSS variable blocks in `4.3.0` CSS Variables mode |
| `clearCSSVarRegistry()` | `ant-design-vue` | Clears the CSS variable registry before an SSR render or build extraction |
