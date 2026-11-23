# 快速上手

Ant Design Vue 致力于提供给程序员**愉悦**的开发体验。

> 在开始之前，推荐先了解 [Vue 3](https://cn.vuejs.org/) 和 [现代 JavaScript（ES2015+）](https://babeljs.io/docs/learn)，并确保已安装 [Node.js](https://nodejs.org/) v18 或以上版本。
>
> 如果你正从 `4.2.6` 升级，请查看 [从 4.2.6 升级到 4.3.0 指南](/docs/vue/migration-v43-cn)。

## 1. 创建项目

推荐使用 [Vite](https://cn.vitejs.dev/) 或 [Rsbuild](https://rsbuild.dev/zh/) 初始化 Vue 3 + TypeScript 项目：

```bash
# Vite（推荐）
npm create vite@latest my-antdv-app -- --template vue-ts

# 或 Rsbuild
npm create rsbuild@latest
```

详细的 Vite 配置、自动按需导入与开发态优化请参考 [在 Vite 中使用](/docs/vue/use-with-vite-cn)。

## 2. 安装依赖

```bash
npm install ant-design-vue@4.3.0 @ant-design/icons-vue
```

> `4.x` 采用 CSS-in-JS 与原生 CSS Variables（4.3.0 默认开启），**不需要**引入 `antd.css`，也不再需要 `babel-plugin-import`。

## 3. 注册与使用组件

### 方式一：全局完整注册

```ts
// src/main.ts
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue';

createApp(App).use(Antd).mount('#app');
```

在页面中搭配 `<a-config-provider>` 与 `<a-app>` 使用：

```vue
<template>
  <a-config-provider :theme="{ token: { colorPrimary: '#1677ff' } }">
    <a-app>
      <a-space>
        <a-button type="primary" @click="notify">开始使用</a-button>
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
const notify = () => message.success('欢迎使用 Ant Design Vue 4.3.0！');
</script>
```

### 方式二：按需导入（ES Modules / `unplugin-vue-components`）

`ant-design-vue` 原生支持 Tree Shaking，你可以直接在 `<script setup lang="ts">` 中按需引入组件：

```vue
<template>
  <Button type="primary">Primary</Button>
</template>

<script setup lang="ts">
import { Button } from 'ant-design-vue';
</script>
```

或者配合 `unplugin-vue-components` 自动解析模板中的 `<a-*>` 标签，详见 [在 Vite 中使用](/docs/vue/use-with-vite-cn)。

### 方式三：全局部分注册

```ts
import { createApp } from 'vue';
import { Button, DatePicker } from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue';

const app = createApp(App);
// app.use(Button) 会自动注册 Button 下的子组件
app.use(Button).use(DatePicker).mount('#app');
```

## 4. 下一步

- [在 Vite 中使用](/docs/vue/use-with-vite-cn)：自动按需引入、Volar 类型配置与开发态优化
- [从 4.2.6 升级到 4.3.0](/docs/vue/migration-v43-cn)：CSS 变量模式、`token` vs `realToken`、新组件与 API 迁移
- [定制主题](/docs/vue/customize-theme-cn)：品牌主色、暗黑模式、紧凑模式与零运行时静态样式
- [通用属性](/docs/vue/common-props-cn)：`rootClassName`、`classNames`/`styles`、`variant` 与 `ConfigProvider` 默认配置
- [SSR 与静态样式导出](/docs/vue/ssr-extract-ssr-cn)：Nuxt 3 与 Vite SSR 样式抽取方案
- [常见问题](/docs/vue/faq-cn)：TailwindCSS v4、Shadow DOM、CSP、国际化等高频问题排查
