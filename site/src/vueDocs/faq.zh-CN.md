# 常见问题

以下整理了 Ant Design Vue `4.3.0` 与 Vue 3 开发中的高频问题和官方建议，提问或提交 Issue 前建议先在此检索。

## 升级 4.3.0 后，自定义样式里的 `token.value.borderRadius` 拼接 `px` 失效或变 `NaN`？

自 `4.3.0` 起，`<a-config-provider>` **默认开启 CSS 变量模式（`cssVar: true`）**。`theme.useToken()` 返回的 `token.value.borderRadius` 是带单位的 CSS 变量引用字符串 `'var(--ant-border-radius)'`，而非数字 `6`。

- **直接写入 CSS 样式**：去掉手动拼接的 `px`，或使用 CSS `calc()`：
  ```ts
  const { token } = theme.useToken();
  const style = computed(() => ({
    borderRadius: token.value.borderRadius, // "var(--ant-border-radius)"
    padding: `calc(${token.value.padding} * 2)`,
  }));
  ```
- **JS 数值运算、颜色库（TinyColor）或 Canvas / SVG / ECharts**：请从 `theme.useToken()` 解构原始数值对象 **`realToken`**：
  ```ts
  const { realToken } = theme.useToken();
  const radiusPx = `${realToken.value.borderRadius}px`; // "6px"
  const doublePadding = realToken.value.padding * 2; // 32
  const primaryHex = realToken.value.colorPrimary; // "#1677ff"
  ```

如需临时回退旧行为，可在根组件传入 `<a-config-provider :theme="{ cssVar: false }">`。详见 [从 4.2.6 升级到 4.3.0](/docs/vue/migration-v43-cn)。

## 如何解决与 TailwindCSS v4 / v3 的样式优先级冲突？

`@hiltonkohler21/ant-design-vue` 默认使用 `:where(.css-xxx)` 降低组件选择器权重，而 TailwindCSS Preflight（`base` reset）可能会把按钮背景重置为透明或覆盖边框样式。

- **TailwindCSS v4**：在入口 CSS 顶部显式声明 `@layer` 顺序，并将 `reset.css` 归入 `base` 层：

  ```css
  @layer theme, base, antd, components, utilities;

  @import 'tailwindcss';
  @import '@hiltonkohler21/ant-design-vue/dist/reset.css' layer(base);
  ```

- **提升组件权重**：在根组件外层包裹 `<a-style-provider hash-priority="high">`，移除 `:where(...)` 降权包装。

完整配置（含 Tailwind v3 与 `zeroRuntime` 静态 CSS）请参考 [样式兼容](/docs/vue/compatible-style-cn)。

## 如何在 Shadow DOM 中使用 Ant Design Vue？

Shadow DOM 内部无法读取注入到 `document.head` 的 `<style>` 标签。使用 `StyleProvider` 的 `container` 属性将动态样式注入到 `shadowRoot` 中即可：

```vue
<template>
  <a-style-provider :container="shadowRoot">
    <a-config-provider :get-popup-container="() => popupContainer">
      <MyApp />
    </a-config-provider>
  </a-style-provider>
</template>
```

> 同时建议为 `ConfigProvider` 配置 `getPopupContainer`，让 Modal、Select、Tooltip 等弹层也挂载在 Shadow DOM 内部。详见 [样式兼容 - Shadow DOM 场景](/docs/vue/compatible-style-cn)。

## 开启了 Content Security Policy (CSP) 后动态样式被拦截怎么办？

通过 `ConfigProvider` 的 `csp` 属性传入服务端生成的 `nonce`，所有动态注入的 `<style>` 标签都会自动带上该 `nonce`：

```vue
<template>
  <a-config-provider :csp="{ nonce: 'your-server-nonce' }">
    <App />
  </a-config-provider>
</template>
```

如果 CSP 策略完全禁止内联 `<style>`，建议开启 `4.3.0` 的 `zeroRuntime` 模式并引入预提取的外部静态 CSS 文件，详见 [SSR 与静态样式导出](/docs/vue/ssr-extract-ssr-cn)。

## SSR（Nuxt 3 / Vite SSR）首屏出现无样式闪烁（FOUC）怎么办？

4.x 采用 CSS-in-JS，服务端渲染时必须收集本次渲染产生的样式并内联到 HTML `<head>` 中。特别注意在 `4.3.0` 默认开启 `cssVar: true` 后，需同时提取组件样式与 `:root` CSS 变量声明：

```ts
import { createCache, extractStyle, extractCSSVarStyle } from '@hiltonkohler21/ant-design-vue';

// renderToString 完成后：
const componentCss = extractStyle(cache);
const cssVarCss = `<style data-antdv-cssvar>${extractCSSVarStyle()}</style>`;
```

也可以预构建静态样式文件并启用 `zeroRuntime: true`。完整 Nuxt 3 与 Vite SSR 示例见 [SSR 与静态样式导出](/docs/vue/ssr-extract-ssr-cn)。

## 为什么弹层组件的 `visible` 变成了 `open`？

历史版本中各浮层组件的显隐属性命名不统一（既有 `visible` 也有 `open`）。从 `4.x` 起，`Modal`、`Drawer`、`Tooltip`、`Popover`、`Dropdown`、`Popconfirm`、`Image.preview`、`Table` 筛选浮层等统一使用 `open`（Vue 模板中使用 `v-model:open`），以降低记忆成本并保持 API 一致性。

## 设置了 `prefixCls` 或自定义主题后，`message` / `notification` / `Modal.confirm` 静态方法样式丢失或不响应暗黑模式？

静态方法（如 `message.info()`、`Modal.confirm()`）会独立挂载新的 Vue 实例，无法读取当前组件树中 `ConfigProvider` 提供的主题、语言包和 `prefixCls` 上下文。

推荐两种标准解法：

1. **推荐：使用 `<a-app>` 与 `App.useApp()`**：
   ```vue
   <!-- App.vue -->
   <template>
     <a-config-provider prefix-cls="my-ant" :theme="{ algorithm: theme.darkAlgorithm }">
       <a-app>
         <RouterView />
       </a-app>
     </a-config-provider>
   </template>
   ```
   ```ts
   // 任意子组件
   import { App } from '@hiltonkohler21/ant-design-vue';
   const { message, modal, notification } = App.useApp();
   message.success('自动继承暗黑主题与自定义 prefixCls');
   ```
2. **局部使用 Hooks**：调用 `message.useMessage()`、`notification.useNotification()`、`Modal.useModal()` 并将返回的 `contextHolder` 渲染在 `<a-config-provider>` 内部。

## 如何关闭全局组件动画与点击波纹特效？

在低配设备、自动化测试或极简性能场景下，可以通过主题 Token 与 `wave` 配置关闭组件动画和点击水波纹：

```vue
<template>
  <a-config-provider
    :theme="{
      token: {
        motion: false,
        motionUnit: 0,
        motionBase: 0,
      },
    }"
    :wave="{ disabled: true }"
  >
    <App />
  </a-config-provider>
</template>
```

其中 `motion: false` 会禁用 `BorderBeam` 等组件的动效逻辑，`motionUnit: 0` 与 `motionBase: 0` 会将过渡时长 Token（`motionDurationFast` / `Mid` / `Slow`）归零，`:wave="{ disabled: true }"` 会关闭按钮/复选框等的点击波纹。

## VS Code（Vue - Official / Volar）没有组件标签与属性类型提示？

- **全局完整注册（`app.use(Antd)`）**：在 `tsconfig.json` 中显式引入全局组件类型声明：
  ```json
  {
    "compilerOptions": {
      "types": ["@hiltonkohler21/ant-design-vue/typings/global"]
    }
  }
  ```
- **使用 `unplugin-vue-components`**：确保插件生成的 `components.d.ts` 已包含在 `tsconfig.json` 的 `include` 中，并在 VS Code 中重启 TS Server。
- 确保已卸载旧版 Vetur 插件，仅保留官方 **Vue - Official（Volar）** 扩展。

## Vite 开发环境首次打开页面较慢或频繁触发依赖重优化？

在 `vite.config.ts` 中通过 `optimizeDeps.include` 提前预打包 `@hiltonkohler21/ant-design-vue`、`@ant-design/icons-vue` 与 `dayjs` 及其语言包，避免运行期按需发现依赖导致的二次重载：

```ts
export default defineConfig({
  optimizeDeps: {
    include: [
      '@hiltonkohler21/ant-design-vue',
      '@hiltonkohler21/ant-design-vue/es/locale/zh_CN',
      '@ant-design/icons-vue',
      'dayjs',
      'dayjs/locale/zh-cn',
    ],
  },
});
```

更多 Vite 工程化配置见 [在 Vite 中使用](/docs/vue/use-with-vite-cn)。

## 为什么 DatePicker 等时间组件的国际化没有生效？

`ConfigProvider` 的 `:locale` 仅控制组件自身的文案，不负责底层日期库的格式化语言。你需要额外导入并激活 `dayjs` 语言包：

```ts
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
```

如果仍不生效，请运行 `npm ls dayjs` 检查项目中是否存在多个不兼容版本的 `dayjs` 实例（锁版本冲突会导致 `dayjs.locale()` 作用在错误的实例上）。详见 [国际化](/docs/vue/i18n-cn)。

## 选择年份/月份时，为什么给 `DatePicker` 设置 `mode="year"` 无法选中？

`mode` 仅用于控制当前展示的面板状态，不会改变默认的选日交互。请直接使用 `picker` 属性或对应的专用组件：

```vue
<template>
  <a-date-picker v-model:value="year" picker="year" />
  <a-date-picker v-model:value="month" picker="month" />
  <a-range-picker v-model:value="monthRange" picker="month" />
</template>
```

使用 `picker="year"` / `picker="month"` 时，点击即可直接完成选择，`disabledDate` 也会正确作用于对应粒度。

## 表单输入框设置了 `:value` 后无法输入，或修改 `defaultValue` 不生效？

- **受控与双向绑定**：只传 `:value` 而不监听更新时，组件处于受控只读状态；在 Vue 3 中请使用 `v-model:value`（或 `:value` + `@update:value` / `@change`）。
- **`defaultValue` / `defaultOpenKeys` 等 `default*` 属性**：仅在组件**首次挂载**时生效，后续动态变更不会覆盖内部状态；如需动态受控，请改用 `v-model:value` / `v-model:openKeys`。
- **`undefined` 与 `null`**：约定 `undefined` 表示非受控，`null` 表示显式受控空值（如 `allowClear` 清空后）。对于 `Select` 等组件的 `options`，建议使用 `string | number` 作为 `option.value`。

## 下拉框、气泡卡片在滚动容器内错位，或嵌套在弹层内点击即关闭？

默认情况下，浮层挂载在 `document.body` 上。在局部滚动容器或嵌套弹层中使用时，通过 `getPopupContainer` 将弹层挂载到父节点（并确保父容器设置了 `position: relative`）：

```vue
<template>
  <!-- 单组件配置 -->
  <a-select :get-popup-container="trigger => trigger.parentNode" :options="options" />

  <!-- 或在 ConfigProvider 全局配置 -->
  <a-config-provider :get-popup-container="trigger => trigger?.parentElement || document.body">
    <App />
  </a-config-provider>
</template>
```

## 是否提供 Sass / Less / CSS 文件？全局样式会不会被覆盖？

- **CSS-in-JS 架构**：自 4.0 起 `@hiltonkohler21/ant-design-vue` 移除了 `antd.css` 与全部 `.less` 源码文件，不再需要也不提供 Sass/Stylus 版本，样式通过 CSS-in-JS（4.3.0 起默认原生 CSS Variables）按需自动注入。
- **不污染全局样式**：4.x 不再主动修改全局标签样式。如果需要统一基础排版与盒模型，可在入口按需引入 `@hiltonkohler21/ant-design-vue/dist/reset.css`；如果不想影响外部页面（如微前端子应用），推荐仅在应用最外层包裹 `<a-app>` 组件。

## 为什么修改了 `colorPrimary`，但链接（`a` 标签）颜色没有跟着变？

在 Design Token 体系中，`colorPrimary` 与 `colorInfo` 是两个独立的 Seed Token，而 `colorLink` 默认派生自 `colorInfo`（而非 `colorPrimary`）。如需链接色同步品牌主色，请同时配置 `colorLink` 或 `colorInfo`：

```vue
<a-config-provider :theme="{ token: { colorPrimary: '#00b96b', colorLink: '#00b96b' } }">
  <App />
</a-config-provider>
```

## `@hiltonkohler21/ant-design-vue` 适合移动端 H5 开发吗？

`@hiltonkohler21/ant-design-vue` 定位为**企业级桌面中后台产品**设计体系，并未针对移动端触控交互做专门适配。移动端项目建议选用专门的移动端 Vue 组件库。
