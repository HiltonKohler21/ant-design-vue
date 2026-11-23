# 在 Vite 中使用

[Vite](https://cn.vitejs.dev/) 是现代 Vue 3 应用的首选构建工具，具备毫秒级冷启动与极速热更新（HMR）。本文介绍如何在 Vite + Vue 3 + TypeScript 工程中接入 `ant-design-vue@4.3.0`，并配置自动按需引入、图标、主题及工程化优化。

## 1. 创建 Vite 项目

使用你偏好的包管理器创建 Vue 3 + TypeScript 项目：

```bash
# npm
npm create vite@latest my-antdv-app -- --template vue-ts

# pnpm
pnpm create vite my-antdv-app --template vue-ts

# yarn
yarn create vite my-antdv-app --template vue-ts
```

进入目录并安装基础依赖：

```bash
cd my-antdv-app
npm install
npm run dev
```

打开浏览器访问 `http://localhost:5173`，看到 Vite + Vue 欢迎页即表示初始化成功。

## 2. 安装 `ant-design-vue` 与图标库

```bash
npm install ant-design-vue @ant-design/icons-vue
```

> `ant-design-vue` 4.x 内置了 CSS-in-JS 与原生 CSS Variables（4.3.0 起默认开启），**不需要**安装 `less`、`less-loader` 或 `babel-plugin-import`。

## 3. 引入方式

### 方式一：自动按需引入（推荐）

借助 [`unplugin-vue-components`](https://github.com/unplugin/unplugin-vue-components) 与内置的 `AntDesignVueResolver`，模板中使用 `<a-button>` 等组件时将自动生成按需导入语句并产出 TypeScript 声明文件：

```bash
npm install -D unplugin-vue-components
```

配置 `vite.config.ts`：

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
          // 4.x 采用 CSS-in-JS / CSS Variables，无需插件自动引入 less/css
          importStyle: false,
        }),
      ],
    }),
  ],
});
```

在 `src/main.ts` 中引入基础重置样式（可选，但推荐）：

```ts
import { createApp } from 'vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue';

createApp(App).mount('#app');
```

在组件中直接使用模板标签即可，无需手动 `import`：

```vue
<template>
  <a-config-provider :theme="{ token: { colorPrimary: '#1677ff' } }">
    <a-app>
      <a-space>
        <a-button type="primary" :icon="h(PlusOutlined)" @click="onClick">新建项目</a-button>
        <a-date-picker />
      </a-space>
    </a-app>
  </a-config-provider>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { App } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';

const { message } = App.useApp();
const onClick = () => {
  message.success('Vite + Ant Design Vue 4.3.0 已就绪！');
};
</script>
```

> 注意：静态/Hook 方法（如 `App.useApp()`、`theme.useToken()`、`Form.useForm()`）以及图标（`@ant-design/icons-vue`）需显式 `import`。

### 方式二：全量注册

适合中后台管理端或快速原型开发：

```ts
// src/main.ts
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue';

createApp(App).use(Antd).mount('#app');
```

### 方式三：ES Module 手动按需导入

`ant-design-vue` 原生支持 Tree Shaking，直接在 `<script setup lang="ts">` 中按需导入组件即可：

```vue
<template>
  <Button type="primary">Primary Button</Button>
</template>

<script setup lang="ts">
import { Button } from 'ant-design-vue';
</script>
```

## 4. TypeScript 与 IDE 类型提示（Vue - Official / Volar）

若使用全局全量注册（`app.use(Antd)`），在 `tsconfig.json` 中声明 `ant-design-vue/typings/global` 即可获得模板标签与属性的完整补全：

```json
{
  "compilerOptions": {
    "types": ["ant-design-vue/typings/global"]
  }
}
```

若使用 `unplugin-vue-components`，插件会在根目录自动生成 `components.d.ts`，请确保该文件包含在 `tsconfig.json` 的 `include` 数组中。

## 5. 开发态性能优化建议

在大型项目中，可通过 Vite 的 `optimizeDeps.include` 提前预打包常用依赖，减少首次打开页面时的模块请求瀑布与二次重载：

```ts
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: [
      'ant-design-vue',
      'ant-design-vue/es/locale/zh_CN',
      '@ant-design/icons-vue',
      'dayjs',
      'dayjs/locale/zh-cn',
    ],
  },
});
```

## 6. 搭配 TailwindCSS v4 与生产优化

- **搭配 TailwindCSS v4**：在全局样式顶部声明 `@layer theme, base, antd, components, utilities;` 并将 `reset.css` 放入 `layer(base)`，详见 [样式兼容](/docs/vue/compatible-style-cn)。
- **零运行时静态样式（4.3.0+）**：如果应用主题固定且希望移除运行时 `<style>` 注入，可结合 `npm run static-style-extract` 与 `<a-config-provider :theme="{ cssVar: true, zeroRuntime: true }">`，详见 [从 4.2.6 升级到 4.3.0](/docs/vue/migration-v43-cn) 与 [SSR 与静态样式导出](/docs/vue/ssr-extract-ssr-cn)。
- **定制主题**：参考 [定制主题](/docs/vue/customize-theme-cn) 配置品牌色、暗黑模式与紧凑模式。
