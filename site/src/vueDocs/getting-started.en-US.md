# Getting Started

Ant Design Vue is dedicated to providing a **pleasant** development experience for Vue 3 engineers.

> Before getting started, make sure you are familiar with [Vue 3](https://vuejs.org/) and [modern JavaScript (ES2015+)](https://babeljs.io/docs/learn), and have [Node.js](https://nodejs.org/) v18+ installed.
>
> Upgrading from `4.2.6`? Read the [4.2.6 to 4.3.0 Migration Guide](/docs/vue/migration-v43).

## 1. Create a New Project

We recommend [Vite](https://vitejs.dev/) or [Rsbuild](https://rsbuild.dev/) to scaffold a Vue 3 + TypeScript app:

```bash
# Vite (Recommended)
npm create vite@latest my-antdv-app -- --template vue-ts

# or Rsbuild
npm create rsbuild@latest
```

For full Vite configuration, automatic on-demand imports, and dev optimization tips, see [Use in Vite](/docs/vue/use-with-vite).

## 2. Install Dependencies

```bash
npm install ant-design-vue@4.3.0 @ant-design/icons-vue
```

> `4.x` uses CSS-in-JS with native CSS Variables (enabled by default in 4.3.0). Do **not** import `antd.css`, and `babel-plugin-import` is no longer needed.

## 3. Register and Use Components

### Option A: Global Registration

```ts
// src/main.ts
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue';

createApp(App).use(Antd).mount('#app');
```

Wrap your root with `<a-config-provider>` and `<a-app>`:

```vue
<template>
  <a-config-provider :theme="{ token: { colorPrimary: '#1677ff' } }">
    <a-app>
      <a-space>
        <a-button type="primary" @click="notify">Get Started</a-button>
        <a-date-picker v-model:value="date" />
      </a-space>
    </a-app>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Dayjs } from 'dayjs';
import { App } from 'ant-design-vue';

const date = ref<Dayjs>();
const { message } = App.useApp();
const notify = () => message.success('Welcome to Ant Design Vue 4.3.0!');
</script>
```

### Option B: On-Demand Import (ES Modules / `unplugin-vue-components`)

`ant-design-vue` supports ES module tree shaking natively:

```vue
<template>
  <Button type="primary">Primary</Button>
</template>

<script setup lang="ts">
import { Button } from 'ant-design-vue';
</script>
```

Or configure `unplugin-vue-components` to resolve `<a-*>` tags automatically — see [Use in Vite](/docs/vue/use-with-vite).

### Option C: Partial Global Registration

```ts
import { createApp } from 'vue';
import { Button, DatePicker } from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue';

const app = createApp(App);
// app.use(Button) also registers Button sub-components
app.use(Button).use(DatePicker).mount('#app');
```

## 4. Next Steps

- [Use in Vite](/docs/vue/use-with-vite): Auto on-demand imports, Volar types, and dev optimization
- [4.2.6 to 4.3.0 Migration Guide](/docs/vue/migration-v43): Default CSS Variables, `token` vs `realToken`, new components, and API upgrades
- [Customize Theme](/docs/vue/customize-theme): Brand tokens, Dark Mode, Compact Mode, and `zeroRuntime`
- [Common Props](/docs/vue/common-props): `rootClassName`, `classNames`/`styles`, `variant`, and `ConfigProvider` defaults
- [SSR & Static Style Extraction](/docs/vue/ssr-extract-ssr): Nuxt 3 and Vite SSR integration
- [FAQ](/docs/vue/faq): TailwindCSS v4, Shadow DOM, CSP, i18n, and troubleshooting
