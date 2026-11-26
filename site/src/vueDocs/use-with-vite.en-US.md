# Use in Vite

[Vite](https://vitejs.dev/) is the recommended build tool for modern Vue 3 applications, offering instant dev server startup and fast HMR. This guide walks through setting up `@hiltonkohler21/ant-design-vue@4.3.0` in a Vite + Vue 3 + TypeScript project, including automatic on-demand imports, icons, theming, and dev performance tips.

## 1. Create a Vite Project

Scaffold a Vue 3 + TypeScript app using your preferred package manager:

```bash
# npm
npm create vite@latest my-antdv-app -- --template vue-ts

# pnpm
pnpm create vite my-antdv-app --template vue-ts

# yarn
yarn create vite my-antdv-app --template vue-ts
```

Install dependencies and start the dev server:

```bash
cd my-antdv-app
npm install
npm run dev
```

Open `http://localhost:5173` in your browser to verify the initial Vite + Vue app.

## 2. Install `@hiltonkohler21/ant-design-vue` and Icons

```bash
npm install @hiltonkohler21/ant-design-vue @ant-design/icons-vue
```

> `@hiltonkohler21/ant-design-vue` 4.x uses CSS-in-JS with native CSS Variables (enabled by default in 4.3.0). You do **not** need `less`, `less-loader`, or `babel-plugin-import`.

## 3. Importing Components

### Option A: Automatic On-Demand Import (Recommended)

Use [`unplugin-vue-components`](https://github.com/unplugin/unplugin-vue-components) with the built-in `AntDesignVueResolver` to automatically import `<a-*>` components on demand and generate TypeScript definitions:

```bash
npm install -D unplugin-vue-components
```

Configure `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          // 4.x uses CSS-in-JS / CSS Variables; no CSS/Less side-effect imports needed
          importStyle: false,
        }),
      ],
    }),
  ],
});
```

Import the optional base reset stylesheet in `src/main.ts`:

```ts
import { createApp } from 'vue';
import '@hiltonkohler21/ant-design-vue/dist/reset.css';
import App from './App.vue';

createApp(App).mount('#app');
```

Then use `<a-*>` components directly in your templates without manual imports:

```vue
<template>
  <a-config-provider :theme="{ token: { colorPrimary: '#1677ff' } }">
    <a-app>
      <a-space>
        <a-button type="primary" :icon="h(PlusOutlined)" @click="onClick">New Project</a-button>
        <a-date-picker />
      </a-space>
    </a-app>
  </a-config-provider>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { App } from '@hiltonkohler21/ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';

const { message } = App.useApp();
const onClick = () => {
  message.success('Vite + Ant Design Vue 4.3.0 is ready!');
};
</script>
```

> Note: Utility hooks (`App.useApp()`, `theme.useToken()`, `Form.useForm()`) and icons (`@ant-design/icons-vue`) should still be imported explicitly.

### Option B: Global Registration

Convenient for admin dashboards and rapid prototyping:

```ts
// src/main.ts
import { createApp } from 'vue';
import Antd from '@hiltonkohler21/ant-design-vue';
import '@hiltonkohler21/ant-design-vue/dist/reset.css';
import App from './App.vue';

createApp(App).use(Antd).mount('#app');
```

### Option C: Direct ES Module Import

`@hiltonkohler21/ant-design-vue` supports ES module tree shaking out of the box:

```vue
<template>
  <Button type="primary">Primary Button</Button>
</template>

<script setup lang="ts">
import { Button } from '@hiltonkohler21/ant-design-vue';
</script>
```

## 4. TypeScript & IDE Intellisense (Vue - Official / Volar)

When using global registration (`app.use(Antd)`), add `@hiltonkohler21/ant-design-vue/typings/global` to `tsconfig.json` for full template tag and prop autocompletion:

```json
{
  "compilerOptions": {
    "types": ["@hiltonkohler21/ant-design-vue/typings/global"]
  }
}
```

When using `unplugin-vue-components`, make sure the generated `components.d.ts` file is included in your `tsconfig.json` `include` array.

## 5. Dev Server Performance Tip

In large projects, pre-bundle frequently used dependencies via `optimizeDeps.include` to reduce module waterfalls and avoid mid-session reloads during development:

```ts
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: [
      '@hiltonkohler21/ant-design-vue',
      '@hiltonkohler21/ant-design-vue/es/locale/en_US',
      '@ant-design/icons-vue',
      'dayjs',
    ],
  },
});
```

## 6. Next Steps

- **Using with TailwindCSS v4**: Declare `@layer theme, base, antd, components, utilities;` and load `reset.css` inside `layer(base)`. See [Compatible Style](/docs/vue/compatible-style).
- **Zero-Runtime Static CSS (4.3.0+)**: For fixed-theme apps, pair `npm run static-style-extract` with `<a-config-provider :theme="{ cssVar: true, zeroRuntime: true }">`. See [Migrating from 4.2.6 to 4.3.0](/docs/vue/migration-v43) and [SSR & Static Style Extraction](/docs/vue/ssr-extract-ssr).
- **Theming**: Visit [Customize Theme](/docs/vue/customize-theme) to configure brand tokens, Dark Mode, and Compact Mode.
