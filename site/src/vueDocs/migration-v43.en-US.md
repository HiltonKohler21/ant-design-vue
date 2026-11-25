# Migrating from 4.2.6 to 4.3.0

This handbook guides you through upgrading smoothly from `ant-design-vue@4.2.6` to `ant-design-vue@4.3.0` (covering all `4.2.7` and `4.3.0` improvements, aligned with `antd@6.7.2`). `4.3.0` brings the Ant Design v6 performance layer (**native CSS Variables enabled by default** and **zero-runtime static CSS extraction**), adds **6 new top-level components** and **6 new subcomponents**, introduces **functional Semantic DOM (`classNames`/`styles`)** across **61 components**, wires **72 `ConfigProvider` per-component defaults**, syncs **74 locale packs**, expands **Component Design Tokens to 317+**, and modernizes component APIs across the entire library.

> Upgrading from `3.x`? Please follow the [V3 to V4 Migration Guide](/docs/vue/migration-v4) first.

## Compatibility Guarantee

Upgrading from `4.2.6` to `4.3.0` is designed to be **incremental and low-risk**:

- **100% Backwards-Compatible Component APIs**: Every deprecated component prop (`visible`, `bordered`, `dropdownRender`, `dropdownClassName`, `dropdownMatchSelectWidth`, `destroyOnClose`, `bodyStyle` / `headStyle` / `maskStyle`, `Divider.type`, `Alert.message` / `closeText` / `closeIcon`, `Tag.bordered`, `Image.preview.visible`, `Slider.tooltipOpen` / `tipFormatter` / `onAfterChange`, `Space.direction` / `split`, `Steps.direction` / `labelPlacement`, `Tabs.tabPosition`, `Carousel.dotPosition`, `Collapse.expandIconPosition`, `Spin.tip`, `Transfer.operations`, `Listy.data` / `itemKey`, etc.) **remains fully functional in `4.3.0`** (selected props log helpful development-mode deprecation notices). You can upgrade the package first and adopt modern APIs at your own pace.
- **Only Behavioral Watchpoint — Default `cssVar: true`**: In `4.3.0`, CSS Variables mode is enabled by default, so `theme.useToken()` returns CSS variable strings (`var(--ant-*)`) on `token` instead of raw numbers/colors. Use `realToken` for JS math, Canvas, SVG, or chart libraries — or pass `:theme="{ cssVar: false }"` on your root `<a-config-provider>` for an **instant one-line fallback** to legacy hashed mode while auditing custom token code.

---

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

Using Vite? See [Use in Vite](/docs/vue/use-with-vite) for recommended plugin and CSS setup.

---

## 2. Default CSS Variables Mode (`cssVar: true`)

### What Changed & Measured Gains

Starting in `4.3.0`, `<a-config-provider>` enables **CSS Variables mode by default** (`theme.cssVar` defaults to `true`).

- **Styles generated once**: Component CSS rules reference `--ant-*` custom properties instead of hardcoded theme values. Switching themes (Light / Dark / Compact / brand primary colors) or rendering multiple themes only updates CSS variable blocks without regenerating component rules.
- **Measured benchmark** (14 representative components across 1 → 3 themes):
  - **Total CSS size (3 themes)**: **-50.5%** (`469.0 KB` in hashed mode → `231.9 KB` in CSS variable mode)
  - **Incremental multi-theme growth (1 → 3 themes)**: **-86.8%** (`+312.1 KB` hashed vs `+41.3 KB` cssVar)
  - **Single-theme baseline**: `+21.5%` (for `:root` variable declarations and `calc()` chains, in exchange for zero-recompilation dynamic theming)

### Critical Watchpoint: `token` vs `realToken`

> **Must-check before deploying**: This is the primary behavioral change when upgrading from `4.2.6` to `4.3.0`.

In `4.2.6` (hashed mode), `theme.useToken()` returned raw values: `token.value.borderRadius` was `6` (number), `token.value.padding` was `16` (number), and `token.value.colorPrimary` was `'#1677ff'`.

In `4.3.0` with default `cssVar: true`:

- **`token.value.*` resolves to CSS variable strings**, for example:
  - `token.value.borderRadius` → `'var(--ant-border-radius)'` (the variable declaration already includes `px`: `--ant-border-radius: 6px;`)
  - `token.value.padding` → `'var(--ant-padding)'`
  - `token.value.colorPrimary` → `'var(--ant-color-primary)'`
- Any custom code that appends `px` to `token.value.*`, runs JS arithmetic on it, passes it to `TinyColor`, or draws with Canvas / SVG / ECharts will emit invalid CSS (`var(--ant-border-radius)px`, `NaNpx`) or parse colors as black.

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

### Instant Opt-Out (Fallback to Legacy Hash Mode)

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

## 3. New Components, New Subcomponents & Upgrading `List` → `Listy`

### 6 New Top-Level Components

| Component | Version | Highlights | Docs |
| --- | --- | --- | --- |
| `Masonry` | `4.3.0` | Responsive masonry grid with breakpoint `columns`/`gutter`, shortest-column packing, image load/error reflow, `fresh`, `MasonryRef`, functional `classNames`/`styles` | [Masonry](/components/masonry) |
| `BorderBeam` | `4.3.0` | `offset-path` animated rounded border comet with multi-beam `items`, gradient `color`, `duration`, `lineWidth`, `outset`, `size` | [BorderBeam](/components/border-beam) |
| `Listy` | `4.3.0` | Virtualized list container with `items`, `rowKey`, `group`, `sticky`, `scrollWidth`, auto `itemHeight`, pixel/key/index/group `scrollTo`, functional `classNames`/`styles` | [Listy](/components/listy) |
| `Splitter` | `4.2.7` / `4.3.0` | Resizable split panes supporting `orientation` (`horizontal`/`vertical`), `lazy` drag, `collapsible`/`collapsibleIcon`, `draggerIcon`, `onDraggerDoubleClick`, `min`/`max` | [Splitter](/components/splitter) |
| `ColorPicker` | `4.2.7` / `4.3.0` | Solid & gradient color picker with HEX/RGB/HSB `format`, alpha control, `presets`, `allowClear`, `onChangeComplete` | [ColorPicker](/components/color-picker) |
| `Input.OTP` | `4.2.7` | One-time password input (`<a-input-otp>`) with `length`, `mask`, `separator`, `formatter`, and auto focus advancing | [Input](/components/input) |

### 6 New Subcomponents + `Image.PreviewGroup.items`

| Subcomponent | Registered Tag | Highlights | Docs |
| --- | --- | --- | --- |
| `Alert.ErrorBoundary` | `<a-alert-error-boundary>` | Vue 3 `onErrorCaptured` error boundary rendering a fallback error `Alert` (`title`/`description` props & slots) | [Alert](/components/alert) |
| `Tag.CheckableTagGroup` | `<a-checkable-tag-group>` | Single/multi selectable tag group (`options`, `multiple`, `v-model:value`, `disabled`, semantic `classNames`/`styles`) | [Tag](/components/tag) |
| `Cascader.Panel` | `<a-cascader-panel>` | Inline multi-column cascader panel without dropdown popup (`options`, `multiple`, `changeOnSelect`, `loadData`, `v-model:value`) | [Cascader](/components/cascader) |
| `Statistic.Timer` | `<a-statistic-timer>` | Unified countdown & countup timer (`type: 'countdown' \| 'countup'`, `value`, `format`, `onFinish`, `onChange`) | [Statistic](/components/statistic) |
| `Space.Addon` | `<a-space-addon>` | Compact addon wrapper for `<a-space-compact>` supporting `variant`, `status`, `disabled`, and `size` | [Space](/components/space) |
| `Tooltip.UniqueProvider` | `<a-tooltip-unique-provider>` | Smooth-transition context provider so sibling `<a-tooltip>` popups glide seamlessly between triggers | [Tooltip](/components/tooltip) |
| `Image.PreviewGroup.items` | `<a-image-preview-group>` | Config-driven gallery `items` (`string \| { src, alt?, ... }`) with `countRender`, `actionsRender`, `imageRender`, and `mask` blur | [Image](/components/image) |

### Quick-Start Snippets (New Top-Level Components)

#### Masonry

```vue
<template>
  <a-masonry ref="masonryRef" :columns="{ xs: 1, sm: 2, lg: 3 }" :gutter="16" :items="items">
    <template #item="{ item }">
      <a-card :title="item.data.title">{{ item.data.desc }}</a-card>
    </template>
  </a-masonry>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { MasonryRef } from 'ant-design-vue';

const masonryRef = ref<MasonryRef>();
const items = [
  { key: '1', data: { title: 'Card 1', desc: 'Packed into the shortest column automatically' } },
  { key: '2', data: { title: 'Card 2', desc: 'Responsive breakpoints and image load reflow' } },
  { key: '3', data: { title: 'Card 3', desc: 'Supports functional classNames and styles' } },
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
  <a-splitter orientation="horizontal" style="height: 240px" @dragger-double-click="resetSizes">
    <a-splitter-panel v-model:size="sizes[0]" min="20%" max="70%" collapsible>
      <div style="padding: 16px">Left Pane</div>
    </a-splitter-panel>
    <a-splitter-panel v-model:size="sizes[1]">
      <div style="padding: 16px">Right Pane</div>
    </a-splitter-panel>
  </a-splitter>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const sizes = ref<(number | string)[]>(['40%', '60%']);
const resetSizes = () => {
  sizes.value = ['50%', '50%'];
};
</script>
```

#### ColorPicker (Solid + Gradient) & Input.OTP

```vue
<template>
  <a-space orientation="vertical" :size="16">
    <a-color-picker
      v-model:value="color"
      :mode="['single', 'gradient']"
      show-text
      allow-clear
      @change-complete="val => console.log('Selected:', val)"
    />
    <a-input-otp v-model:value="code" :length="6" :formatter="str => str.toUpperCase()" />
  </a-space>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const color = ref('#1677ff');
const code = ref('');
</script>
```

### Quick-Start Snippets (New Subcomponents & `Image.PreviewGroup.items`)

```vue
<template>
  <a-space orientation="vertical" :size="20" style="width: 100%">
    <!-- 1. Alert.ErrorBoundary -->
    <a-alert-error-boundary title="Widget failed to render">
      <RiskyChildComponent />
    </a-alert-error-boundary>

    <!-- 2. Tag.CheckableTagGroup -->
    <a-checkable-tag-group v-model:value="selectedTags" multiple :options="tagOptions" />

    <!-- 3. Cascader.Panel -->
    <a-cascader-panel v-model:value="regionPath" :options="regionOptions" />

    <!-- 4. Statistic.Timer (countdown & countup) -->
    <a-space :size="32">
      <a-statistic-timer type="countdown" title="Launch In" :value="deadline" />
      <a-statistic-timer type="countup" title="Uptime" :value="startTime" />
    </a-space>

    <!-- 5. Space.Addon -->
    <a-space-compact>
      <a-space-addon>https://</a-space-addon>
      <a-input v-model:value="domain" placeholder="antdv.com" />
      <a-space-addon>.com</a-space-addon>
    </a-space-compact>

    <!-- 6. Tooltip.UniqueProvider -->
    <a-tooltip-unique-provider>
      <a-space>
        <a-tooltip title="Quick Action A"><a-button>Action A</a-button></a-tooltip>
        <a-tooltip title="Quick Action B"><a-button>Action B</a-button></a-tooltip>
      </a-space>
    </a-tooltip-unique-provider>

    <!-- 7. Image.PreviewGroup.items -->
    <a-image-preview-group
      :items="[
        'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
        'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
      ]"
      :preview="{ mask: { blur: true } }"
    >
      <a-image
        :width="120"
        src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
      />
    </a-image-preview-group>
  </a-space>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedTags = ref<string[]>(['Vue 3']);
const tagOptions = ['Vue 3', 'TypeScript', 'CSS Variables', 'Zero Runtime'];

const regionPath = ref<(string | number)[]>(['zhejiang', 'hangzhou']);
const regionOptions = [
  { value: 'zhejiang', label: 'Zhejiang', children: [{ value: 'hangzhou', label: 'Hangzhou' }] },
];

const deadline = Date.now() + 1000 * 60 * 60;
const startTime = Date.now() - 1000 * 60 * 5;
const domain = ref('');
</script>
```

### Migrating from `List` to `Listy`

With `List` deprecated upstream, `4.3.0` introduces **`Listy`** as the modern virtualized list container with built-in grouping, sticky headers, horizontal scrolling (`scrollWidth`), imperative pixel/key/index/group `scrollTo`, and functional semantic styling.

#### Key API Mapping

| Capability | Legacy `List` | New `Listy` | Notes |
| --- | --- | --- | --- |
| Data source | `dataSource` | `items` | Legacy alias `data` is deprecated (still works with dev warning) |
| Row identity | `rowKey` | `rowKey` | Legacy alias `itemKey` is deprecated (still works with dev warning) |
| Item rendering | `#renderItem="{ item, index }"` | `#item="{ item, index }"` or `:item-render` | Cleaner scoped slot API |
| Virtualization & Horizontal scroll | Requires 3rd-party library | `:height="360"` + `virtual` (`itemHeight` auto-calculated if omitted) + `scrollWidth` | Built-in vertical virtualization & horizontal overflow |
| Grouping & Sticky | Not supported | `:group="{ key, title }"` + `sticky` | Supports `#groupTitle="{ groupKey, items }"` |
| Imperative scrolling | Not supported | `ref.scrollTo(number \| { top, left } \| { index, align, offset } \| { key, align, offset } \| { groupKey, align, offset })` | Plus `ref.scrollToIndex(index)` |
| Semantic styling | Limited | `classNames` / `styles` (static object or function) | Slots: `root`, `item`, `groupHeader`, `groupSection`, `holder`, `scrollbar` |

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
<!-- ✅ After: 4.3.0 Listy (virtualized, grouped, sticky headers, scrollWidth, scrollTo) -->
<template>
  <a-space orientation="vertical" style="width: 100%">
    <a-space>
      <a-button @click="listyRef?.scrollTo({ index: 50, align: 'top' })">Scroll to #51</a-button>
      <a-button @click="listyRef?.scrollTo({ top: 0, left: 0 })">Back to Top</a-button>
    </a-space>
    <a-listy
      ref="listyRef"
      :items="users"
      row-key="id"
      :height="320"
      :scroll-width="640"
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

## 4. Semantic DOM, 72 `ConfigProvider` Configs & 317+ Component Design Tokens

### Functional Semantic DOM (`classNames` / `styles`)

`4.3.0` standardizes semantic styling across **61 components** covering inputs, overlays, data display, navigation, layout, and feedback. Both `classNames` and `styles` accept either a **static object** or a **dynamic function** `({ props }) => ({ ... })`, and every one of the 61 component documentation pages includes an interactive **`Semantic DOM` (`#semantic-dom`)** previewer:

```vue
<template>
  <a-alert
    title="Release 4.3.0 Ready"
    description="Semantic styles can react dynamically to component props."
    type="info"
    variant="filled"
    show-icon
    :styles="
      ({ props }) => ({
        root: { borderRadius: '10px' },
        title: { fontWeight: props.variant === 'filled' ? 600 : 500 },
      })
    "
  />
</template>
```

See [Common Props](/docs/vue/common-props) for the complete semantic slot reference across all 61 components.

### Unified `ConfigProvider` Component Defaults (72 Component Configs)

`4.3.0` wires all **72 component-level default configs** in `ConfigProvider` (including `alert`, `button`, `card`, `divider`, `drawer`, `empty`, `form`, `image`, `input`, `listy`, `masonry`, `modal`, `pagination`, `select`, `space`, `splitter`, `table`, `tabs`, `tag`, `timeline`, `colorPicker`, `borderBeam`, and more), alongside global `variant`, `popupMatchSelectWidth`, `popupOverflow`, `holderRender`, `componentDisabled`, and `warning`:

```vue
<template>
  <a-config-provider
    variant="filled"
    :popup-match-select-width="false"
    popup-overflow="viewport"
    :button="{ autoInsertSpace: false, className: 'app-btn' }"
    :card="{ variant: 'borderless', styles: { body: { padding: '20px' } } }"
    :alert="{ variant: 'filled' }"
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

### 317+ Component Design Tokens

`4.3.0` expands runtime Component Design Tokens from `112` to **317+** (with **341** documented tokens across **61** components in `token-meta.json` and full TypeScript typing in `ComponentTokenMap`). Component documentation pages (`#design-tokens`) now feature bilingual token descriptions, real-time search/filtering, click-to-copy names, and `@since` badges:

```vue
<template>
  <a-config-provider
    :theme="{
      components: {
        Button: { fontWeight: 600, primaryShadow: '0 4px 12px rgba(22, 119, 255, 0.25)' },
        Alert: { defaultPadding: '10px 14px' },
        Tag: { defaultBg: '#f5f7fa', solidTextColor: '#ffffff' },
        Form: { itemMarginBottom: 18, labelFontSize: 14 },
        Table: { headerBg: '#fafafa', rowHoverBg: '#f0f7ff' },
      },
    }"
  >
    <RouterView />
  </a-config-provider>
</template>
```

---

## 5. Backwards-Compatible v6 API Upgrades & Mapping Table

All legacy `4.2.6` props below remain **100% backwards-compatible in `4.3.0`** so you can migrate incrementally:

| Components | Legacy `4.2.6` Prop (Still Works) | Recommended `4.3.0` API | Notes |
| --- | --- | --- | --- |
| Modal / Drawer / Tooltip / Popover / Dropdown / Popconfirm / Image | `v-model:visible` / `:visible` | `v-model:open` / `:open` | Unified overlay visibility prop (`Image`: `preview.open` / `onOpenChange`) |
| Modal / Drawer / Tabs / Dropdown / Tooltip / Collapse / Splitter.Panel | `destroyOnClose` / `destroyInactiveTabPane` / `destroyPopupOnHide` / `destroyTooltipOnHide` / `destroyInactivePanel` | `destroyOnHidden` | Unified unmount-on-hide prop |
| Modal / Drawer / Card / Descriptions / Empty / Slider / Tooltip / Alert / Tag / Image / Divider | `bodyStyle` / `headStyle` / `headerStyle` / `footerStyle` / `maskStyle` / `imageStyle` / `wrapperStyle` / `orientationMargin` | `styles` + `classNames` (static object or `({ props }) => ...`) | Unified Semantic DOM styling |
| Input / InputNumber / Select / Cascader / TreeSelect / Mentions / AutoComplete / DatePicker / TimePicker / Card / Form | `:bordered="false"` | `variant="borderless"` (`outlined` / `filled` / `borderless` / `underlined`; `Card`: `outlined` / `borderless`) | Inheritable from `<a-form variant="...">` and `<a-config-provider variant="...">` |
| Select / TreeSelect / Cascader / AutoComplete / Dropdown | `dropdownRender` / `dropdownClassName` / `dropdownMatchSelectWidth` | `popupRender` / `popupClassName` (or `classNames.popup.root`) / `popupMatchSelectWidth` | **Signature note**: `popupRender` receives `menuNode` directly (`(menuNode) => VNode`); also adds `suffix` alias & `Select.loadingIcon` |
| Divider | `type="vertical"` / `orientation="left"` / `dashed` | `orientation="vertical"` (or `vertical`) / `titlePlacement="start"` / `variant="solid" \| "dashed" \| "dotted"` + `size` | RTL-aware `start`/`end` and semantic `rail`/`content` |
| Alert | `message` / `closeText` / `closeIcon` / `afterClose` | `title` / `:closable="{ closeIcon, disabled, afterClose, onClose }"` + `variant="filled"` + `action` + `Alert.ErrorBoundary` | `message` remains supported as fallback |
| Tag | `:bordered="false"` / `closeIcon` | `variant="filled" \| "solid" \| "outlined"` / `:closable="{ closeIcon, disabled }"` + `disabled` + `href`/`target` + `Tag.CheckableTagGroup` | `CheckableTag` also adds `icon` & `disabled` |
| Image | `preview.visible` / `onVisibleChange` / `toolbarRender` / `previewMask` | `preview.open` / `onOpenChange` / `actionsRender` / `imageRender` / `mask` (`{ enabled, blur, closable }`) / `cover` / `placeholder.progress` / `rootStyle` / `Image.PreviewGroup.items` | Adds loading progress overlay, `minScale`, `maxScale`, `scaleStep`, `movable`, `wheel`, `onTransform`, `countRender` |
| List | `<a-list :data-source="..." />` | `<a-listy :items="..." row-key="..." :group="..." sticky virtual :scroll-width="..." />` | Built-in virtualization, grouping, sticky headers, and pixel/key/index/group `scrollTo` |
| Drawer | `afterVisibleChange` / `maskClosable` | `afterOpenChange` + `resizable` (`boolean \| { onResizeStart, onResize, onResizeEnd }`) + `loading` + `focusable` + `closable`/`mask` objects | Edge resize, close focus restoration, `closable.placement` (`start`/`end`), `mask.blur`, numeric/string `size` |
| Modal | `maskClosable` / `closeIcon` | `loading` (Skeleton body) + `scrollLock` + `afterOpenChange` + `closable`/`mask` objects | Opt-out background scroll lock & `mask: { enabled, blur, closable }` |
| Notification | `btn` | `actions` + `stack` (`boolean \| { threshold }`) + `showProgress` + `pauseOnHover` + `closable` object | Collapsed card stack with hover expand & countdown bar |
| Timeline | `<a-timeline-item>` | `:items="timelineItems"` (`content`, `title`, `icon`, `placement`) + `orientation="horizontal" \| "vertical"` + `variant="filled" \| "outlined"` + `titleSpan` | Config-driven items & horizontal timeline |
| Breadcrumb / Descriptions | `routes` / `<a-descriptions-item>` | Config-driven `:items="..."` (`Breadcrumb` adds `dropdownIcon`; `Descriptions.items` supports numeric, `'filled'`, & responsive `span`) | Slot children remain fully supported |
| DatePicker / TimePicker | Single selection / immediate select | `variant`, `multiple` (`DatePicker` with `maxTagCount`), `needConfirm` | Inherits `Form.variant` |
| InputNumber / Radio / Rate | Manual suffix / full-width CSS / fixed star size | `InputNumber`: `suffix` + `changeOnWheel`; `Radio.Group`: `block` + `orientation`/`vertical`; `Rate`: `size` (`small`/`middle`/`medium`/`large`) | Native props with Component Tokens |
| Slider | `tooltipOpen` / `tipFormatter` / `tooltipPlacement` / `onAfterChange` | `:tooltip="{ open, formatter, placement, getPopupContainer, autoAdjustOverflow }"` + `startPoint` + `orientation` + `@change-complete` + `handleRender` + `ariaDescribedByForHandle` | Custom track origin & unified `tooltip` config object |
| Table | Non-virtual / manual column filtering | `virtual` (vertical & horizontal virtualization, fixed columns & `ellipsis`) + `column.hidden` (incl. nested groups) + `column.sortIcon` + `filterOnClose` + `filterDropdownProps` | Built-in virtualization, zero-rerender column resize & declarative column hiding |
| Space / Tooltip | `Space`: `direction` / `split` | `Space`: `orientation` / `vertical` / `separator` + `Space.Addon`; `Tooltip`: `Tooltip.UniqueProvider` + `defaultOpen` + `afterOpenChange` | Smooth sibling tooltip transitions |
| Steps / Splitter / Tabs | `Steps.direction` / `labelPlacement`; `Splitter.layout`; `Tabs.tabPosition` / `moreIcon` | `Steps`: `orientation` / `titlePlacement` / `variant` / `ellipsis` / `items[].content`; `Splitter`: `orientation` / `collapsibleIcon` / `draggerIcon` / `onDraggerDoubleClick`; `Tabs`: `items` / `tabPlacement` (`start`/`end`) / `more` / `indicator` | Consistent v6 naming across navigation & layout |
| Carousel / Progress / Button / Collapse | `Carousel.dotPosition`; `Progress.gapPosition` / `trailColor`; `Button.iconPosition`; `Collapse.expandIconPosition` | `Carousel`: `dotPlacement` + `:autoplay="{ dotDuration: true }"`; `Progress`: `gapPlacement` / `railColor` / `percentPosition` / `rounding`; `Button`: `variant` + `color` (13 presets) + `iconPlacement`; `Collapse`: `expandIconPlacement` + `size` | Full v6 prop aliases & styles |
| Spin / Segmented / Flex / Transfer / Watermark | `Spin.tip`; `Segmented`/`Flex` `vertical`; `Transfer.operations` | `Spin`: `description` + `percent="auto"` + `fullscreen`; `Segmented`/`Flex`: `orientation`; `Transfer`: `actions` + `deselectAll` + `selectionsIcon`; `Watermark`: `onRemove` + `{ text, font }` per-line `content` | Modernized props with full compatibility |
| FloatButton / BackTop / Dropdown / Tour / Avatar.Group / Input.Search | Standalone `<a-back-top>`; `FloatButton.description`; `Avatar.Group.maxCount` | `<a-float-button-back-top>` + `FloatButton.Group.placement` + `content`; `Dropdown.autoAdjustOverflow`; `Tour.indicatorsRender` + `keyboard`; `Avatar.Group`: `:max="{ count, style, popover }"`; `Input.Search`: `searchIcon` | Standalone `BackTop` deprecated in favor of `FloatButton.BackTop` |

### Before → After Migration Examples

#### 1. `Divider`, `Alert`, `Tag`, and `Image` v6 Upgrades

```vue
<!-- ❌ Before (4.2.6) -->
<template>
  <a-divider type="horizontal" orientation="left" dashed>Section</a-divider>
  <a-alert message="Notice" close-text="Dismiss" closable />
  <a-tag :bordered="false" color="blue">Beta</a-tag>
  <a-image
    src="/demo.png"
    :preview="{ visible: previewOpen, onVisibleChange: v => (previewOpen = v) }"
  />
</template>
```

```vue
<!-- ✅ After (4.3.0) -->
<template>
  <a-divider orientation="horizontal" title-placement="start" variant="dashed" size="small">
    Section
  </a-divider>
  <a-alert title="Notice" variant="filled" :closable="{ closeIcon: 'Dismiss' }" />
  <a-tag variant="filled" color="blue" href="https://antdv.com" target="_blank">Beta</a-tag>
  <a-image
    src="/demo.png"
    :preview="{
      open: previewOpen,
      onOpenChange: v => (previewOpen = v),
      mask: { blur: true },
    }"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
const previewOpen = ref(false);
</script>
```

#### 2. `Form.variant`, `DatePicker` (`multiple` / `needConfirm`), `InputNumber`, `Radio.Group.block`, `Rate.size`, `Slider`, and `Table`

```vue
<template>
  <a-form variant="filled" layout="vertical">
    <a-space orientation="vertical" :size="12" style="width: 100%">
      <!-- Inherits variant="filled" from Form -->
      <a-date-picker v-model:value="dates" multiple max-tag-count="responsive" />
      <a-time-picker v-model:value="time" need-confirm />
      <a-input-number v-model:value="price" prefix="$" suffix="USD" change-on-wheel />
      <a-select
        v-model:value="selected"
        popup-class-name="custom-dropdown"
        :popup-match-select-width="false"
        :popup-render="menuNode => h('div', { class: 'wrap' }, [menuNode])"
        :options="options"
      />
      <a-radio-group v-model:value="plan" block option-type="button" :options="planOptions" />
      <a-rate v-model:value="score" size="large" />
      <a-slider
        v-model:value="sliderVal"
        :tooltip="{ open: true, formatter: val => `${val}%` }"
        @change-complete="val => console.log('Done:', val)"
      />
    </a-space>
  </a-form>

  <!-- Table: virtual scrolling + column.hidden -->
  <a-table
    virtual
    :scroll="{ y: 360 }"
    :columns="columns"
    :data-source="rows"
    :pagination="false"
  />
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import type { Dayjs } from 'dayjs';
import type { TableColumnsType } from 'ant-design-vue';

const dates = ref<Dayjs[]>([]);
const time = ref<Dayjs>();
const price = ref(99);
const selected = ref<string>();
const options = [
  { label: 'Vue', value: 'vue' },
  { label: 'Vite', value: 'vite' },
];
const plan = ref('pro');
const planOptions = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
  { label: 'Enterprise', value: 'enterprise' },
];
const score = ref(4);
const sliderVal = ref(30);

const hideInternalId = ref(true);
const columns: TableColumnsType = [
  { title: 'Internal ID', dataIndex: 'id', key: 'id', hidden: hideInternalId.value },
  { title: 'Name', dataIndex: 'name', key: 'name' },
];
const rows = [{ id: 1, name: 'Ant Design Vue 4.3.0' }];
</script>
```

#### 3. `Drawer` (`resizable`), `Modal` (`loading` + `mask.blur`), `Notification` (`stack`), `Timeline` / `Breadcrumb` / `Descriptions` (`items`), `Button`, `Tabs`, `Carousel`, `Spin`, `Watermark`

```vue
<template>
  <a-space orientation="vertical" :size="16" style="width: 100%">
    <!-- Button: color (incl. 13 presets) + variant + iconPlacement -->
    <a-space wrap>
      <a-button color="purple" variant="solid">Purple Solid</a-button>
      <a-button color="cyan" variant="filled">Cyan Filled</a-button>
      <a-button color="danger" variant="outlined" icon-placement="end">Danger</a-button>
      <a-button @click="drawerOpen = true">Open Resizable Drawer</a-button>
      <a-button @click="modalOpen = true">Open Loading Modal</a-button>
      <a-button @click="openNotice">Stacked Notification</a-button>
    </a-space>

    <!-- Config-driven Breadcrumb, Descriptions, Timeline -->
    <a-breadcrumb :items="[{ title: 'Home', href: '/' }, { title: 'Migration 4.3.0' }]" />
    <a-descriptions
      bordered
      :items="[
        { key: '1', label: 'Version', children: '4.3.0' },
        { key: '2', label: 'Theme Mode', children: 'CSS Variables (default)', span: 'filled' },
      ]"
    />
    <a-timeline
      orientation="horizontal"
      variant="filled"
      :items="[
        { title: '4.2.6', content: 'Legacy hash mode' },
        { title: '4.3.0', content: 'Default cssVar + v6 APIs' },
      ]"
    />

    <!-- Tabs, Carousel dotDuration, Spin percent="auto" -->
    <a-tabs :items="tabItems" tab-placement="top" destroy-on-hidden />
    <a-carousel :autoplay="{ dotDuration: true }" dot-placement="bottom">
      <div>Slide 1</div>
      <div>Slide 2</div>
    </a-carousel>
    <a-spin description="Loading..." percent="auto" />

    <!-- Resizable Drawer & Loading Modal -->
    <a-drawer
      v-model:open="drawerOpen"
      title="Inspector"
      resizable
      :mask="{ blur: true }"
      :after-open-change="open => console.log('Drawer:', open)"
    >
      Drag the left edge to resize this drawer.
    </a-drawer>

    <a-modal
      v-model:open="modalOpen"
      title="Order Summary"
      :loading="modalLoading"
      destroy-on-hidden
      :mask="{ blur: true }"
      :styles="{ body: { padding: '24px' } }"
    >
      Loaded modal content.
    </a-modal>
  </a-space>
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import { App, Button } from 'ant-design-vue';

const drawerOpen = ref(false);
const modalOpen = ref(false);
const modalLoading = ref(false);

const tabItems = [
  { key: '1', label: 'Overview', children: 'Overview content' },
  { key: '2', label: 'Settings', children: 'Settings content' },
];

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

1. **Audit `theme.useToken()` usage**: Search for `${token.` and JS math/color operations on `token.value.*`. Use `token.value.*` directly in CSS styles, or switch to `realToken.value.*` for numeric/color computations and Canvas/SVG/ECharts (or temporarily pass `:theme="{ cssVar: false }"`).
2. **Verify `popupRender` callbacks**: When migrating from `dropdownRender` to `popupRender`, ensure the function receives `menuNode` directly as its first parameter.
3. **Check overlay props**: Ensure `Modal`, `Drawer`, `Tooltip`, `Popover`, `Dropdown`, and `Image` (`preview.open`) use `open` instead of `visible`.
4. **Inspect dev console warnings**: Visit primary pages in development mode and gradually migrate any deprecation warnings (`Listy` `data`/`itemKey`, `Select` `dropdownClassName`, `Divider` `type`, etc.).
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
