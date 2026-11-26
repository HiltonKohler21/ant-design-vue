---
order: 6.5
title: Compatible Style
---

# Compatible Style

Ant Design Vue supports the last 2 versions of modern browsers. Modern CSS features are enabled by default for maintainability and dynamic theming performance. When targeting legacy browsers, Shadow DOM, `rem` scaling, or integrating with TailwindCSS and other CSS frameworks, use `StyleProvider` and CSS `@layer`.

> `StyleProvider` and built-in transformers (`legacyLogicalPropertiesTransformer`, `px2remTransformer`) are exported directly from `@hiltonkohler21/ant-design-vue` — no extra package installation is required.

## Default CSS Features & Browser Compatibility

| Feature | Minimum Chrome | Default | Compatibility / Fallback |
| --- | --- | --- | --- |
| CSS Variables (`--ant-*`) | Chrome 49 | Yes (4.3.0+) | `<a-config-provider :theme="{ cssVar: false }">` (hashed mode) |
| `:where()` low-specificity selector | Chrome 88 | Yes | `<a-style-provider hash-priority="high">` |
| CSS Logical Properties (`inset`, `margin-inline-start`) | Chrome 89 | Yes | `<a-style-provider :transformers="[legacyLogicalPropertiesTransformer]">` |
| CSS `@layer` cascade layers | Chrome 99 | Opt-in | Declare explicit `@layer` order at the top of global CSS |

## `:where()` Selector & `hashPriority`

By default, Ant Design Vue wraps hash selectors with `:where()` to keep component specificity low so custom overrides work easily. If you need to support older browsers (Chrome < 88) or raise component specificity against global resets (such as TailwindCSS Preflight), set `hash-priority="high"`:

```vue
<template>
  <!-- hash-priority defaults to 'low'; setting 'high' removes :where() -->
  <a-style-provider hash-priority="high">
    <MyApp />
  </a-style-provider>
</template>
```

Output selector diff:

```diff
- :where(.css-bAMboO).ant-btn {
+ .css-bAMboO.ant-btn {
    color: #fff;
  }
```

> Notes:
>
> 1. `hashPriority` cannot be changed dynamically at runtime; reload or re-mount after changing it.
> 2. After disabling `:where()`, if your custom rules need higher specificity, consider PostCSS plugins such as `postcss-increase-specificity` or `postcss-add-root-selector`.

## CSS Logical Properties Downgrade

To support both LTR and RTL cleanly, Ant Design Vue uses CSS Logical Properties (`inset`, `margin-inline-start`, `padding-block`). For legacy browsers that lack support, enable `legacyLogicalPropertiesTransformer`:

```vue
<template>
  <a-style-provider :transformers="[legacyLogicalPropertiesTransformer]">
    <MyApp />
  </a-style-provider>
</template>

<script setup lang="ts">
import { legacyLogicalPropertiesTransformer } from '@hiltonkohler21/ant-design-vue';
</script>
```

Transformed CSS:

```diff
.ant-modal-root {
- inset: 0;
+ top: 0;
+ right: 0;
+ bottom: 0;
+ left: 0;
}
```

## Responsive `rem` Adaptation (`px2remTransformer`)

Use `px2remTransformer` to automatically convert component `px` values into `rem` units relative to the root `html` font size:

```vue
<template>
  <a-style-provider :transformers="[px2rem]">
    <MyApp />
  </a-style-provider>
</template>

<script setup lang="ts">
import { px2remTransformer } from '@hiltonkohler21/ant-design-vue';

const px2rem = px2remTransformer({
  rootValue: 16, // 16px = 1rem (default: 16)
  precision: 5,
  mediaQuery: false,
});
</script>
```

### `px2remTransformer` Options

| Option       | Description                                     | Type      | Default |
| ------------ | ----------------------------------------------- | --------- | ------- |
| `rootValue`  | Root `html` font size in px                     | `number`  | `16`    |
| `precision`  | Decimal precision for converted `rem` values    | `number`  | `5`     |
| `mediaQuery` | Whether to convert `px` inside `@media` queries | `boolean` | `false` |

> Multiple transformers can be combined, e.g. `:transformers="[legacyLogicalPropertiesTransformer, px2rem]"`. Transformers do not support dynamic runtime updates.

## Shadow DOM Usage

Inside a Shadow DOM (micro-frontends or Web Components), `<style>` tags in `document.head` do not apply. Pass `shadowRoot` to `StyleProvider`'s `container` prop and configure `ConfigProvider`'s `getPopupContainer` so popups stay inside the shadow tree:

```ts
import { createApp, defineComponent, h } from 'vue';
import Antd, { ConfigProvider, StyleProvider } from '@hiltonkohler21/ant-design-vue';
import MyApp from './MyApp.vue';

const host = document.getElementById('shadow-host')!;
const shadowRoot = host.attachShadow({ mode: 'open' });
const mountEl = document.createElement('div');
shadowRoot.appendChild(mountEl);

const Root = defineComponent({
  setup() {
    return () =>
      h(StyleProvider, { container: shadowRoot }, () =>
        h(ConfigProvider, { getPopupContainer: () => mountEl }, () => h(MyApp)),
      );
  },
});

createApp(Root).use(Antd).mount(mountEl);
```

## CSS `@layer` & TailwindCSS Compatibility

When combining Ant Design Vue with TailwindCSS or UnoCSS, define explicit CSS `@layer` ordering to prevent Preflight resets and utility classes from conflicting with component styles.

### TailwindCSS v4

TailwindCSS v4 defines `@layer theme, base, components, utilities`. Declare the layer order at the top of your main stylesheet and place `reset.css` (and extracted `antdv.css` if using `zeroRuntime`) into explicit layers:

```css
/* src/assets/main.css */
@layer theme, base, antd, components, utilities;

@import 'tailwindcss';
@import '@hiltonkohler21/ant-design-vue/dist/reset.css' layer(base);

/* When using 4.3.0 zeroRuntime with pre-extracted static CSS: */
/* @import '../dist/static-style/antdv.css' layer(antd); */
```

- In standard dynamic mode, unlayered `:where()` component rules naturally outrank `@layer base` (preventing Tailwind Preflight from clearing button backgrounds) while staying easy to override.
- To let Tailwind `@layer utilities` classes (like `bg-red-500` or `p-4`) override component styles directly, either load pre-extracted `antdv.css` inside `layer(antd)` (before `utilities`), or use Tailwind's `!` important modifier (e.g., `!bg-red-500`).

### TailwindCSS v3

Place `@tailwind base` inside a lower-priority cascade layer:

```css
@layer tailwind-base, antd;

@layer tailwind-base {
  @tailwind base;
}

@tailwind components;
@tailwind utilities;
```

Or disable Preflight in `tailwind.config.js`:

```js
module.exports = {
  corePlugins: {
    preflight: false,
  },
};
```

### `reset.css` and `zeroRuntime` Static CSS (`antdv.css`)

When loading both `@hiltonkohler21/ant-design-vue/dist/reset.css` and pre-extracted `antdv.css`, isolate them in ordered layers so resets never override components:

```css
@layer reset, antd;

@import '@hiltonkohler21/ant-design-vue/dist/reset.css' layer(reset);
@import '../dist/static-style/antdv.css' layer(antd);
```

### SSR `<head>` Layer Order

In SSR (Nuxt 3 / Vite SSR), the `@layer` order declaration **must appear before** any inline `<style>` tags or extracted stylesheets:

#### ❌ Wrong

```html
<head>
  <!-- Styles appear first, locking layer precedence too early -->
  <style data-antdv-cssvar>
    /* ... */
  </style>
  <link rel="stylesheet" href="/assets/main.css" />
</head>
```

#### ✅ Correct

```html
<head>
  <!-- Declare @layer order first -->
  <style>
    @layer theme, base, antd, components, utilities;
  </style>
  <link rel="stylesheet" href="/assets/main.css" />
  <!-- Then inject SSR CSS variables and component styles -->
  <style data-antdv-cssvar>
    /* ... */
  </style>
  <!-- SSR component <style> blocks -->
</head>
```
