# FAQ

Here are the most frequently asked questions about Ant Design Vue `4.3.0` and Vue 3. Please check this page before opening a discussion or issue.

## After upgrading to 4.3.0, why does appending `px` to `token.value.borderRadius` produce invalid CSS or `NaN`?

Starting in `4.3.0`, `<a-config-provider>` enables **CSS Variables mode (`cssVar: true`) by default**. Tokens returned from `theme.useToken()` evaluate to CSS variable strings such as `'var(--ant-border-radius)'` (already including the `px` unit in the variable declaration) rather than raw numbers like `6`.

- **Direct CSS properties**: Assign `token.value.*` directly without adding `px`, or use CSS `calc()`:
  ```ts
  const { token } = theme.useToken();
  const style = computed(() => ({
    borderRadius: token.value.borderRadius, // "var(--ant-border-radius)"
    padding: `calc(${token.value.padding} * 2)`,
  }));
  ```
- **JS math, color libraries (TinyColor), Canvas, SVG, or ECharts**: Destructure **`realToken`** from `theme.useToken()`:
  ```ts
  const { realToken } = theme.useToken();
  const radiusPx = `${realToken.value.borderRadius}px`; // "6px"
  const doublePadding = realToken.value.padding * 2; // 32
  const primaryHex = realToken.value.colorPrimary; // "#1677ff"
  ```

To temporarily opt out and keep hashed mode, pass `<a-config-provider :theme="{ cssVar: false }">`. See [Migrating from 4.2.6 to 4.3.0](/docs/vue/migration-v43).

## How do I resolve style conflicts with TailwindCSS v4 / v3?

`@hiltonkohler21/ant-design-vue` lowers selector specificity with `:where(.css-xxx)` by default, which can allow Tailwind Preflight resets to override button backgrounds or borders.

- **TailwindCSS v4**: Declare an explicit `@layer` order at the top of your main CSS file and assign `reset.css` to `layer(base)`:

  ```css
  @layer theme, base, antd, components, utilities;

  @import 'tailwindcss';
  @import '@hiltonkohler21/ant-design-vue/dist/reset.css' layer(base);
  ```

- **Increase component specificity**: Wrap your app in `<a-style-provider hash-priority="high">` to remove `:where(...)`.

See [Compatible Style](/docs/vue/compatible-style) for Tailwind v3 and `zeroRuntime` layer setup.

## How do I use Ant Design Vue inside a Shadow DOM?

Styles injected into `document.head` cannot pierce a Shadow DOM boundary. Pass your `shadowRoot` to `StyleProvider`'s `container` prop so dynamic `<style>` tags are injected inside the shadow root:

```vue
<template>
  <a-style-provider :container="shadowRoot">
    <a-config-provider :get-popup-container="() => popupContainer">
      <MyApp />
    </a-config-provider>
  </a-style-provider>
</template>
```

> Also set `getPopupContainer` on `ConfigProvider` so portals (`Modal`, `Select`, `Tooltip`) mount inside the Shadow DOM. See [Compatible Style](/docs/vue/compatible-style).

## How do I support Content Security Policy (CSP)?

Pass your server-generated `nonce` via `ConfigProvider`'s `csp` prop so every injected `<style>` tag receives the `nonce` attribute:

```vue
<template>
  <a-config-provider :csp="{ nonce: 'your-server-nonce' }">
    <App />
  </a-config-provider>
</template>
```

If your CSP forbids inline `<style>` tags altogether, use `4.3.0` `zeroRuntime: true` with a pre-extracted external CSS file. See [SSR & Static Style Extraction](/docs/vue/ssr-extract-ssr).

## How do I prevent unstyled content flash (FOUC) in SSR (Nuxt 3 / Vite SSR)?

During SSR, collect generated styles and inject them into the HTML `<head>`. Under `4.3.0` default `cssVar: true`, be sure to extract **both** component rules (`extractStyle(cache)`) and `:root` CSS variable declarations (`extractCSSVarStyle()`):

```ts
import { createCache, extractStyle, extractCSSVarStyle } from '@hiltonkohler21/ant-design-vue';

const componentCss = extractStyle(cache);
const cssVarCss = `<style data-antdv-cssvar>${extractCSSVarStyle()}</style>`;
```

Alternatively, pre-extract static CSS and enable `zeroRuntime: true`. See [SSR & Static Style Extraction](/docs/vue/ssr-extract-ssr) for full Nuxt 3 and Vite SSR guides.

## Why was `visible` replaced with `open` on overlay components?

Older versions mixed `visible` and `open` across different overlay components. Since `4.x`, `Modal`, `Drawer`, `Tooltip`, `Popover`, `Dropdown`, `Popconfirm`, `Image.preview`, and `Table` filter popups are standardized on `open` (`v-model:open` in Vue templates) for consistency.

## Why do `message`, `notification`, and `Modal.confirm` ignore `ConfigProvider` theme or `prefixCls`?

Static imperative methods create detached Vue instances outside your application tree, so they cannot read `ConfigProvider` context (custom `theme`, `locale`, or `prefixCls`).

Use one of these two approaches instead:

1. **Recommended: Wrap your root with `<a-app>` and call `App.useApp()`**:
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
   // Any descendant component
   import { App } from '@hiltonkohler21/ant-design-vue';
   const { message, modal, notification } = App.useApp();
   message.success('Inherits Dark Mode and custom prefixCls!');
   ```
2. **Local hooks**: Call `message.useMessage()`, `notification.useNotification()`, or `Modal.useModal()` and render the returned `contextHolder` inside `<a-config-provider>`.

## How do I disable animations and click wave effects globally?

Configure theme motion tokens and `wave.disabled` on `ConfigProvider`:

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

`motion: false` disables motion logic in components like `BorderBeam`, setting `motionUnit: 0` and `motionBase: 0` sets derived duration tokens (`motionDurationFast` / `Mid` / `Slow`) to `0s`, and `:wave="{ disabled: true }"` disables click ripple waves.

## Why aren't template types showing up in VS Code (Vue - Official / Volar)?

- **Global registration (`app.use(Antd)`)**: Add `@hiltonkohler21/ant-design-vue/typings/global` to `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "types": ["@hiltonkohler21/ant-design-vue/typings/global"]
    }
  }
  ```
- **`unplugin-vue-components`**: Ensure the generated `components.d.ts` is covered by `tsconfig.json`'s `include` field and restart the TS Server.
- Uninstall the legacy Vetur extension and keep only **Vue - Official (Volar)**.

## How can I speed up Vite dev server cold start and avoid dependency re-bundling?

Pre-bundle `@hiltonkohler21/ant-design-vue`, `@ant-design/icons-vue`, and `dayjs` in `vite.config.ts`:

```ts
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

See [Use in Vite](/docs/vue/use-with-vite) for more tips.

## Why isn't DatePicker / Calendar localization taking effect?

`ConfigProvider`'s `:locale` only translates component UI strings — date formatting relies on `dayjs`. Import and activate the matching `dayjs` locale separately:

```ts
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
```

If it still fails, run `npm ls dayjs` to ensure two incompatible versions of `dayjs` aren't installed simultaneously. See [Internationalization](/docs/vue/i18n).

## Why can't I select a year or month when setting `mode="year"` on `DatePicker`?

`mode` only controls the displayed panel without changing the selection behavior. Use the `picker` prop instead:

```vue
<template>
  <a-date-picker v-model:value="year" picker="year" />
  <a-date-picker v-model:value="month" picker="month" />
  <a-range-picker v-model:value="monthRange" picker="month" />
</template>
```

With `picker="year"` / `picker="month"`, clicking a cell immediately commits the selection and `disabledDate` works at the matching granularity.

## Why can't I edit an `Input` after binding `:value`, or why doesn't updating `defaultValue` work?

- **Two-way binding**: Passing `:value` alone creates a controlled read-only input. Use `v-model:value` (or bind `:value` together with `@update:value` / `@change`).
- **`default*` props** (`defaultValue`, `defaultOpenKeys`, etc.): Only read on initial mount. For reactive updates, use `v-model:*`.
- **`undefined` vs `null`**: `undefined` means uncontrolled; `null` represents an explicit controlled empty value (such as after `allowClear`). For `Select` `options`, always use `string | number` values rather than `null` or `undefined`.

## Why do dropdowns or popovers detach when scrolling or close inside another overlay?

Popups mount to `document.body` by default. Inside scrollable containers or nested popovers, bind `getPopupContainer` (and ensure the parent has `position: relative`):

```vue
<template>
  <!-- Per component -->
  <a-select :get-popup-container="trigger => trigger.parentNode" :options="options" />

  <!-- Or globally via ConfigProvider -->
  <a-config-provider :get-popup-container="trigger => trigger?.parentElement || document.body">
    <App />
  </a-config-provider>
</template>
```

## Do you ship Less / Sass / CSS files? Does Ant Design Vue override global styles?

- **CSS-in-JS architecture**: Since v4.0, `antd.css` and all `.less` files have been removed (Sass/Stylus files are not provided). Styles are injected automatically via CSS-in-JS (with native CSS Variables by default in 4.3.0).
- **No unwanted global overrides**: v4 does not mutate global element styles by default. Import `@hiltonkohler21/ant-design-vue/dist/reset.css` if you want a global reset, or wrap only your app root with `<a-app>` to scope reset typography cleanly (ideal for micro-frontends).

## Why didn't changing `colorPrimary` change link (`<a>`) colors?

`colorPrimary` and `colorInfo` are independent Seed Tokens, and `colorLink` derives from `colorInfo` by default. Override `colorLink` (or `colorInfo`) alongside `colorPrimary` when you want links to match your brand color:

```vue
<a-config-provider :theme="{ token: { colorPrimary: '#00b96b', colorLink: '#00b96b' } }">
  <App />
</a-config-provider>
```

## Is Ant Design Vue designed for mobile web apps?

Ant Design Vue is built for **enterprise desktop web applications** rather than mobile touch interfaces. For mobile-first Vue applications, consider a dedicated mobile Vue UI library.
