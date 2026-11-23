# Migrating from 4.2.6 to 4.3.0

This guide helps you upgrade smoothly from `ant-design-vue@4.2.6` to `ant-design-vue@4.3.0` (covering both `4.2.7` and `4.3.0` improvements). `4.3.0` adopts the Ant Design v6 performance layer — **CSS Variables enabled by default** and **zero-runtime static CSS extraction** — adds 6 new components (`Masonry`, `BorderBeam`, `Listy`, `Splitter`, `ColorPicker`, `Input.OTP`), wires 72 `ConfigProvider` per-component defaults, and modernizes component APIs across the library.

> Upgrading from `3.x`? Please follow the [V3 to V4 Migration Guide](/docs/vue/migration-v4) first.

## 1. Upgrade Steps & Requirements

### Environment Requirements

- **Vue**: `>= 3.2.0` (`3.4+` or `3.5+` recommended)
- **TypeScript**: `>= 4.9` (`5.x` recommended)
- **Node.js**: `>= 18`
- **Browsers**: Last 2 versions of modern browsers (native CSS Custom Properties and `calc()` are used by default; for older browsers see [Compatible Style](/docs/vue/compatible-style))

### Install `4.3.0`

```bash
# npm
npm install ant-design-vue@4.3.0

# yarn
yarn add ant-design-vue@4.3.0

# pnpm
pnpm add ant-design-vue@4.3.0
```

If your project uses Ant Design icons, update `@ant-design/icons-vue` to the latest 7.x release as well:

```bash
npm install @ant-design/icons-vue@latest
```

---

## 2. Default CSS Variables Mode (`cssVar: true`)

### What Changed & Measured Gains

Starting in `4.3.0`, `<a-config-provider>` enables **CSS Variables mode by default** (`theme.cssVar` defaults to `true`).

- **Styles generated once**: Component CSS rules reference `--ant-*` custom properties instead of hardcoded theme values. Switching themes (Light / Dark / Compact / brand primary colors) or rendering multiple themes only updates CSS variable blocks without regenerating component rules.
- **Measured benchmark** (14 representative components across 1 → 3 themes):
  - **Total CSS size (3 themes)**: **-50.5%** (`469.0 KB` in hashed mode → `231.9 KB` in CSS variable mode)
  - **Incremental multi-theme growth (1 → 3 themes)**: **-86.8%** (`+312.1 KB` hashed vs `+41.3 KB` cssVar)
  - **Single-theme baseline**: `+21.5%` (for `:root` variable declarations and `calc()` chains, in exchange for zero-recompilation dynamic theming)

### Critical Breaking Pitfall: `token` vs `realToken`

> **Must-check before deploying**: This is the #1 breaking behavior change when upgrading from `4.2.6` to `4.3.0`.

In `4.2.6` (hashed mode), `theme.useToken()` returned raw values: `token.value.borderRadius` was `6` (number), `token.value.padding` was `16` (number), and `token.value.colorPrimary` was `'#1677ff'`.

In `4.3.0` with default `cssVar: true`:

- **`token.value.*` resolves to CSS variable strings**, for example:
  - `token.value.borderRadius` → `'var(--ant-border-radius)'` (the variable declaration already includes `px`: `--ant-border-radius: 6px;`)
  - `token.value.padding` → `'var(--ant-padding)'`
  - `token.value.colorPrimary` → `'var(--ant-color-primary)'`
- Any custom code that appends `px` to `token.value.*`, runs JS arithmetic on it, passes it to `TinyColor`, or draws with Canvas / SVG / ECharts will emit invalid CSS (`var(--ant-border-radius)px`, `NaNpx`) or parse colors as black!

#### ❌ Wrong (Breaks under 4.3.0 default `cssVar: true`)

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { theme } from 'ant-design-vue';

const { token } = theme.useToken();

const cardStyle = computed(() => ({
  // ❌ Emits invalid CSS: "var(--ant-border-radius)px"
  borderRadius: `${token.value.borderRadius}px`,
  // ❌ Emits invalid CSS: "NaNpx" (cannot multiply a var(...) string)
  padding: `${token.value.padding * 2}px`,
  // ❌ Canvas / ECharts / TinyColor cannot parse "var(--ant-color-primary)"
  '--chart-color': token.value.colorPrimary,
}));
</script>
```

#### ✅ Correct (Assign `token` directly in CSS, or destructure `realToken`)

`theme.useToken()` in `4.3.0` also returns **`realToken`** — the raw numeric and color values before CSS variable transformation:

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { theme } from 'ant-design-vue';

const { token, realToken } = theme.useToken();

// Option A: Use token directly in CSS styles (already includes units; use CSS calc() for math)
const cardStyle = computed(() => ({
  color: token.value.colorText,
  backgroundColor: token.value.colorBgContainer,
  borderRadius: token.value.borderRadius, // "var(--ant-border-radius)"
  padding: `calc(${token.value.padding} * 2)`, // "calc(var(--ant-padding) * 2)"
}));

// Option B: Use realToken for JS arithmetic, explicit px suffixes, color libs, Canvas / SVG / ECharts
const canvasConfig = computed(() => ({
  radiusPx: `${realToken.value.borderRadius}px`, // "6px"
  doublePadding: realToken.value.padding * 2, // 32
  strokeColor: realToken.value.colorPrimary, // "#1677ff"
}));
</script>
```

> **Quick audit tip**: Search your repository for `${token.` and arithmetic operators (`*`, `+`, `-`, `/`) involving `token.value.`, and update them to Option A or Option B.

### Opting Out (Fallback to Legacy Hash Mode)

If you have a single-theme app or want a gradual migration path while auditing custom `useToken()` usage, opt out explicitly on your root `ConfigProvider`:

```vue
<template>
  <a-config-provider :theme="{ cssVar: false }">
    <App />
  </a-config-provider>
</template>
```

### Zero-Runtime Static CSS Extraction (`zeroRuntime: true`)

For fixed-theme apps targeting minimal runtime overhead and instant first paint, pre-extract static CSS and enable `zeroRuntime: true` so no `<style>` tags are injected at runtime:

**Step 1: Extract the static stylesheet**

```bash
npm run static-style-extract
# Output: dist/static-style/antdv.css (includes :root CSS variable declarations + component rules)
```

**Step 2: Import the extracted stylesheet and enable `zeroRuntime`**

```ts
// main.ts
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import '../dist/static-style/antdv.css';
import App from './App.vue';

createApp(App).use(Antd).mount('#app');
```

```vue
<!-- App.vue -->
<template>
  <a-config-provider :theme="{ cssVar: true, zeroRuntime: true }">
    <RouterView />
  </a-config-provider>
</template>
```

> If your app switches themes dynamically at runtime (e.g., Light/Dark toggle), keep `zeroRuntime: false` (default) — CSS Variables mode still ensures component styles are emitted only once. See [SSR & Static Style Extraction](/docs/vue/ssr-extract-ssr) for server-side workflows.

---

## 3. New Components & Upgrading `List` → `Listy`

Six new components have been added between `4.2.6` and `4.3.0`:

| Component | Version | Highlights | Docs |
| --- | --- | --- | --- |
| `Masonry` | `4.3.0` | Responsive masonry grid with breakpoint `columns`/`gutter`, shortest-column packing, `ResizeObserver` relayout | [Masonry](/components/masonry) |
| `BorderBeam` | `4.3.0` | `offset-path` animated rounded border comet with multi-beam `items`, gradient `color`, `duration`, `outset`, `size` | [BorderBeam](/components/border-beam) |
| `Listy` | `4.3.0` | Virtualized list container with `items`, `rowKey`, `group`, `sticky`, `scrollWidth`, auto `itemHeight`, `scrollTo` | [Listy](/components/listy) |
| `Splitter` | `4.2.7` / `4.3.0` | Resizable split panes supporting `horizontal`/`vertical`, `lazy` drag, `collapsible`, `min`/`max` constraints | [Splitter](/components/splitter) |
| `ColorPicker` | `4.2.7` / `4.3.0` | Solid & gradient color picker with HEX/RGB/HSB `format`, alpha control, `presets`, `allowClear`, `onChangeComplete` | [ColorPicker](/components/color-picker) |
| `Input.OTP` | `4.2.7` | One-time password input (`<a-input-otp>`) with `length`, `mask`, `separator`, `formatter`, and auto focus advancing | [Input](/components/input) |

### Quick-Start Snippets

#### Masonry

```vue
<template>
  <a-masonry :columns="{ xs: 1, sm: 2, lg: 3 }" :gutter="16" :items="items">
    <template #item="{ item }">
      <a-card :title="item.data.title">{{ item.data.desc }}</a-card>
    </template>
  </a-masonry>
</template>

<script setup lang="ts">
const items = [
  { key: '1', data: { title: 'Card 1', desc: 'Packed into the shortest column automatically' } },
  { key: '2', data: { title: 'Card 2', desc: 'Responsive breakpoints and live ResizeObserver' } },
  { key: '3', data: { title: 'Card 3', desc: 'Supports semantic classNames and styles' } },
];
</script>
```

#### BorderBeam

```vue
<template>
  <a-border-beam :duration="5" :color="['#1677ff', '#722ed1']">
    <a-card title="AI Recommendation">Animated rounded border beam effect</a-card>
  </a-border-beam>
</template>
```

#### Splitter

```vue
<template>
  <a-splitter style="height: 240px">
    <a-splitter-panel default-size="40%" min="20%" max="70%" collapsible>
      <div style="padding: 16px">Left Pane</div>
    </a-splitter-panel>
    <a-splitter-panel>
      <div style="padding: 16px">Right Pane</div>
    </a-splitter-panel>
  </a-splitter>
</template>
```

#### ColorPicker (Solid + Gradient)

```vue
<template>
  <a-color-picker
    v-model:value="color"
    :mode="['single', 'gradient']"
    show-text
    allow-clear
    @change-complete="val => console.log('Selected:', val)"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
const color = ref('#1677ff');
</script>
```

#### Input.OTP

```vue
<template>
  <a-input-otp v-model:value="code" :length="6" :formatter="str => str.toUpperCase()" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
const code = ref('');
</script>
```

### Migrating from `List` to `Listy`

With `List` deprecated upstream, `4.3.0` introduces **`Listy`** as the modern virtualized list container with built-in grouping, sticky headers, horizontal scrolling, and semantic styling.

#### Key API Mapping

| Capability | Legacy `List` | New `Listy` | Notes |
| --- | --- | --- | --- |
| Data source | `dataSource` | `items` | Legacy alias `data` is deprecated (still works with dev warning) |
| Row identity | `rowKey` | `rowKey` | Legacy alias `itemKey` is deprecated (still works with dev warning) |
| Item rendering | `#renderItem="{ item, index }"` | `#item="{ item, index }"` or `:item-render` | Cleaner scoped slot API |
| Virtualization | Requires 3rd-party library | `:height="360"` + `virtual` (`itemHeight` auto-calculated if omitted) | Also supports `scrollWidth` for horizontal overflow |
| Grouping & Sticky | Not supported | `:group="{ key, title }"` + `sticky` | Supports `#groupTitle="{ groupKey, items }"` |
| Imperative scrolling | Not supported | `ref.scrollTo(number \| { top, left } \| { index, align, offset } \| { key, align, offset } \| { groupKey, align, offset })` | Plus `ref.scrollToIndex(index)` |
| Semantic styling | Limited | `classNames` / `styles` (object or function) | Slots: `root`, `item`, `groupHeader`, `groupSection`, `holder`, `scrollbar` |

#### Before (`List`) → After (`Listy`)

```vue
<!-- ❌ Before: Legacy List -->
<template>
  <a-list :data-source="users" row-key="id">
    <template #renderItem="{ item }">
      <a-list-item>{{ item.name }} ({{ item.role }})</a-list-item>
    </template>
  </a-list>
</template>
```

```vue
<!-- ✅ After: 4.3.0 Listy (virtualized, grouped, sticky headers, scrollTo) -->
<template>
  <a-space direction="vertical" style="width: 100%">
    <a-button @click="listyRef?.scrollTo({ index: 50, align: 'top' })">Scroll to #51</a-button>
    <a-listy
      ref="listyRef"
      :items="users"
      row-key="id"
      :height="320"
      virtual
      sticky
      :group="{ key: 'role', title: role => `Role: ${role}` }"
    >
      <template #item="{ item }">
        <div>{{ item.name }}</div>
      </template>
    </a-listy>
  </a-space>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ListyRef } from 'ant-design-vue';

const listyRef = ref<ListyRef>();
const users = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  role: i % 2 === 0 ? 'Engineering' : 'Design',
}));
</script>
```

---

## 4. Unified `ConfigProvider` Component Defaults (72 Component Configs)

`4.3.0` wires all **72 component-level default configs** in `ConfigProvider` (including `button`, `card`, `empty`, `space`, `pagination`, `input`, `select`, `table`, `modal`, `drawer`, `tabs`, `divider`, `listy`, `masonry`, `splitter`, `colorPicker`, `borderBeam`, and more), alongside global `variant`, `popupMatchSelectWidth`, `popupOverflow`, `holderRender`, `componentDisabled`, and `warning`.

```vue
<template>
  <a-config-provider
    variant="filled"
    :popup-match-select-width="false"
    popup-overflow="viewport"
    :button="{ autoInsertSpace: false, className: 'app-btn' }"
    :card="{ variant: 'borderless', styles: { body: { padding: '20px' } } }"
    :empty="{ image: Empty.PRESENTED_IMAGE_SIMPLE }"
    :space="{ size: 'middle' }"
    :pagination="{ showSizeChanger: true }"
    :holder-render="holderRender"
  >
    <a-app>
      <RouterView />
    </a-app>
  </a-config-provider>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { ConfigProvider, Empty } from 'ant-design-vue';

// Wrap static message / notification / modal holders with custom context
const holderRender = (children: any) => h(ConfigProvider, { prefixCls: 'ant' }, () => children);
</script>
```

See [ConfigProvider](/components/config-provider) and [Common Props](/docs/vue/common-props) for the full list of 72 component config props.

---

## 5. API Upgrades & Deprecated Prop Mapping Table

Legacy props below remain backward-compatible in `4.3.0` (some log dev deprecation warnings), so you can migrate incrementally:

| Components | Legacy Prop (Deprecated) | Recommended API (4.3.0) | Notes |
| --- | --- | --- | --- |
| Modal / Drawer / Tooltip / Popover / Dropdown / Popconfirm / Image | `v-model:visible` / `:visible` | `v-model:open` / `:open` | Unified overlay visibility prop |
| Input / InputNumber / Select / Cascader / TreeSelect / Mentions / AutoComplete / DatePicker / TimePicker / Card | `:bordered="false"` | `variant="borderless"` (`outlined` / `filled` / `borderless` / `underlined` for inputs; `outlined` / `borderless` for Card) | Also configurable globally via `ConfigProvider.variant` |
| Select / TreeSelect / Cascader / AutoComplete / Dropdown | `dropdownRender` | `popupRender` | **Signature change**: `popupRender` receives `menuNode` directly (`(menuNode) => VNode`), not `{ menuNode }` |
| Select / TreeSelect / Cascader / AutoComplete / DatePicker / Mentions | `dropdownClassName` | `popupClassName` (or `classNames.popup.root`) | Prefer `classNames.popup.root` where supported |
| Select / TreeSelect / Cascader / AutoComplete / ConfigProvider | `dropdownMatchSelectWidth` | `popupMatchSelectWidth` | Controls popup width matching trigger |
| Modal / Drawer / Tabs / Dropdown / Tooltip / Collapse | `destroyOnClose` / `destroyInactiveTabPane` / `destroyPopupOnHide` / `destroyTooltipOnHide` / `destroyInactivePanel` | `destroyOnHidden` | Unified unmount-on-hide prop |
| Modal / Drawer / Card / Descriptions / Empty / Slider / Tooltip | `bodyStyle` / `headStyle` / `headerStyle` / `footerStyle` / `maskStyle` / `imageStyle` | `styles` (e.g. `styles.body`, `styles.header`, `styles.mask`) | Paired with semantic `classNames` |
| Slider | `@after-change` / `onAfterChange` | `@change-complete` / `onChangeComplete` | Fired when drag or keyboard interaction finishes |
| Button | `type` + `danger` / `ghost` | `variant` (`outlined`/`dashed`/`solid`/`filled`/`text`/`link`) + `color` (`default`/`primary`/`danger` + **13 preset colors**) + `iconPosition` | 13 presets: `blue`, `purple`, `cyan`, `green`, `magenta`, `pink`, `red`, `orange`, `yellow`, `volcano`, `geekblue`, `lime`, `gold` |
| Divider | `dashed` | `variant` (`solid` / `dashed` / `dotted`) + `size` (`small` / `middle` / `medium` / `large`) + `orientation` (`start` / `end`) | RTL-aware orientation & dotted border |
| Avatar.Group | `maxCount` / `maxStyle` / `maxPopoverPlacement` / `maxPopoverTrigger` | `:max="{ count, style, popover }"` | Unified object config (still accepts `number`) |
| Progress | `strokeLinecap="round"` / custom label position | `rounding` + `:percent-position="{ align: 'start' \| 'center' \| 'end', type: 'inner' \| 'outer' }"` | Supports inner progress bar percentage text |
| Tabs | `<a-tab-pane>` / `indicatorSize` | `:items="tabItems"` + `:indicator="{ size, align }"` + `destroyOnHidden` | Config-driven tabs and custom indicator sizing/alignment |
| Table | Non-virtual large tables / legacy filter props | `virtual` (with `:scroll="{ y: 360 }"`) + `Column.sortIcon` + `filterOnClose` + `filterDropdownProps` | Built-in virtual scrolling & customizable sort/filter |
| Notification | `btn` | `actions` + `showProgress` + `pauseOnHover` | Countdown progress bar & hover pause |
| Alert | Custom right-side controls | `action` prop / `#action` slot | Dedicated action slot |
| BackTop | Standalone `<a-back-top>` | `<a-float-button-back-top>` (`FloatButton.BackTop`) | Standalone `BackTop` is deprecated |

### Before → After Migration Examples

#### 1. Form `variant`, `popupRender`, and `popupMatchSelectWidth`

```vue
<!-- ❌ Before -->
<template>
  <a-input :bordered="false" placeholder="Borderless" />
  <a-select
    :bordered="false"
    dropdown-class-name="custom-dropdown"
    :dropdown-match-select-width="false"
    :dropdown-render="({ menuNode }) => h('div', { class: 'wrap' }, [menuNode])"
    :options="options"
  />
</template>
```

```vue
<!-- ✅ After -->
<template>
  <a-input variant="borderless" placeholder="Borderless" />
  <a-input variant="filled" placeholder="Filled" />
  <a-input variant="underlined" placeholder="Underlined" />

  <a-select
    variant="filled"
    popup-class-name="custom-dropdown"
    :popup-match-select-width="false"
    :popup-render="menuNode => h('div', { class: 'wrap' }, [menuNode])"
    :options="options"
  />
</template>
```

#### 2. Semantic `styles` & `destroyOnHidden` on `Card` and `Modal`

```vue
<!-- ❌ Before -->
<template>
  <a-card :bordered="false" :head-style="{ color: '#1677ff' }" :body-style="{ padding: '16px' }" />
  <a-modal v-model:visible="open" destroy-on-close :body-style="{ padding: '24px' }" />
</template>
```

```vue
<!-- ✅ After -->
<template>
  <a-card
    variant="borderless"
    :styles="{ header: { color: '#1677ff' }, body: { padding: '16px' } }"
  />
  <a-modal v-model:open="open" destroy-on-hidden :styles="{ body: { padding: '24px' } }" />
</template>
```

#### 3. `Button` Presets, `Divider`, `Avatar.Group`, `Progress`, `Tabs`, `Table`, `Alert`, `Notification`, `FloatButton.BackTop`

```vue
<template>
  <!-- Button: color (incl. 13 presets) + variant -->
  <a-space wrap>
    <a-button color="purple" variant="solid">Purple Solid</a-button>
    <a-button color="cyan" variant="filled">Cyan Filled</a-button>
    <a-button color="danger" variant="outlined">Danger Outlined</a-button>
  </a-space>

  <!-- Divider: variant + size + start/end -->
  <a-divider variant="dotted" size="small" orientation="start">Section</a-divider>

  <!-- Avatar.Group: max object -->
  <a-avatar-group
    :max="{
      count: 2,
      style: { color: '#f56a00', backgroundColor: '#fde3cf' },
      popover: { trigger: 'click' },
    }"
  >
    <a-avatar>A</a-avatar>
    <a-avatar>B</a-avatar>
    <a-avatar>C</a-avatar>
  </a-avatar-group>

  <!-- Progress: percentPosition object -->
  <a-progress
    :percent="68"
    :size="['100%', 20]"
    :percent-position="{ align: 'center', type: 'inner' }"
  />

  <!-- Tabs: items + indicator -->
  <a-tabs
    :items="tabItems"
    :indicator="{ size: origin => origin - 20, align: 'center' }"
    destroy-on-hidden
  />

  <!-- Slider: onChangeComplete -->
  <a-slider v-model:value="sliderVal" @change-complete="onDone" />

  <!-- Table: virtual scrolling + filterOnClose -->
  <a-table
    virtual
    :scroll="{ y: 360 }"
    :columns="columns"
    :data-source="rows"
    :pagination="false"
  />

  <!-- Alert: action slot -->
  <a-alert message="Ant Design Vue 4.3.0 is available" type="info" show-icon>
    <template #action>
      <a-button size="small" type="primary">View Notes</a-button>
    </template>
  </a-alert>

  <!-- FloatButton.BackTop replaces deprecated BackTop -->
  <a-float-button-back-top :visibility-height="300" />
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import { App, Button } from 'ant-design-vue';

const sliderVal = ref(30);
const onDone = (val: number) => console.log('Slider complete:', val);

const tabItems = [
  { key: '1', label: 'Overview', children: 'Overview content' },
  { key: '2', label: 'Settings', children: 'Settings content' },
];

// Notification: showProgress + pauseOnHover + actions
const { notification } = App.useApp();
const openNotice = () => {
  notification.open({
    message: 'Build Succeeded',
    description: 'Running with 4.3.0 CSS Variables mode.',
    showProgress: true,
    pauseOnHover: true,
    actions: h(Button, { type: 'primary', size: 'small' }, () => 'View Report'),
  });
};
</script>
```

---

## 6. Verification Checklist & Common Upgrade FAQs

### Post-Upgrade Checklist

1. **Audit `theme.useToken()` usage**: Search for `${token.` and JS math/color operations on `token.value.*`. Use `token.value.*` directly in CSS styles, or switch to `realToken.value.*` for numeric/color computations and Canvas/SVG/ECharts.
2. **Verify `popupRender` callbacks**: When migrating from `dropdownRender` to `popupRender`, ensure the function receives `menuNode` directly as its first parameter.
3. **Check overlay props**: Ensure `Modal`, `Drawer`, `Tooltip`, `Popover`, and `Dropdown` use `v-model:open` instead of `v-model:visible`.
4. **Inspect dev console warnings**: Visit primary pages in development mode and resolve deprecation warnings (`Listy` `data`/`itemKey`, `Select` `dropdownClassName`, etc.).
5. **Verify styling & SSR**: If using TailwindCSS v4 or Nuxt 3 / Vite SSR, check the FAQs below.

### Common Upgrade FAQs

#### 1. How do I avoid style conflicts with TailwindCSS v4?

TailwindCSS v4 organizes styles with native CSS `@layer` (`theme`, `base`, `components`, `utilities`), whereas `ant-design-vue` uses `:where(.css-xxx)` low-specificity selectors by default. Declare an explicit `@layer` order and place `reset.css` (and pre-extracted `antdv.css` if using `zeroRuntime`) inside appropriate layers:

```css
/* src/assets/main.css */
@layer theme, base, antd, components, utilities;

@import 'tailwindcss';
@import 'ant-design-vue/dist/reset.css' layer(base);
/* If using zeroRuntime extracted CSS: */
/* @import './antdv.css' layer(antd); */
```

If Tailwind's base reset overrides Ant Design Vue component styles (e.g., transparent primary buttons), wrap your root app in `<a-style-provider hash-priority="high">` to remove `:where(...)`. See [Compatible Style](/docs/vue/compatible-style) for details.

#### 2. How do I prevent FOUC in Nuxt 3 / Vite SSR?

With `cssVar: true` enabled by default in `4.3.0`, SSR must extract **both** component styles (`extractStyle(cache)`) and `:root` CSS variable declarations (`extractCSSVarStyle()`), and inject them into `<head>`:

```ts
import { createCache, extractStyle, extractCSSVarStyle } from 'ant-design-vue';

const componentCss = extractStyle(cache);
const cssVarCss = `<style data-antdv-cssvar>${extractCSSVarStyle()}</style>`;
```

See [SSR & Static Style Extraction](/docs/vue/ssr-extract-ssr) for complete Nuxt 3 and Vite SSR examples.

#### 3. Will a nested `ConfigProvider` leak into global `:root` CSS variables?

**No.** In `4.3.0`, the root `<a-config-provider>` uses `:root` CSS variables for fast global theme switching. Whenever a nested `<a-config-provider>` defines local `token`, `components`, or `algorithm` overrides, `ant-design-vue` **automatically isolates that subtree in scoped hashed mode** so local overrides never clobber global `:root` variables.

> Tip: If you use `<a-config-provider :theme="{ inherit: false }">` to reset a subtree to default tokens without passing `token`/`algorithm`, explicitly add `cssVar: false` (`:theme="{ inherit: false, cssVar: false }"`) to guarantee full `:root` isolation.
