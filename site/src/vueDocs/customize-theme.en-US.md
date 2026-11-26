# Customize Theme

Ant Design Vue supports flexible design token customization to match brand and product requirements, including primary colors, border radius, typography, Dark/Compact themes, and per-component overrides.

In `4.x`, theming is powered by **Design Tokens + CSS-in-JS + native CSS Variables (enabled by default since 4.3.0)**:

1. Zero-recompilation dynamic theme switching via native `--ant-*` CSS variables;
2. Multiple concurrent themes sharing a single set of component CSS rules;
3. Granular per-component Component Token overrides;
4. Optional `zeroRuntime` mode paired with pre-extracted static CSS.

## Configure Theme via `ConfigProvider`

The smallest unit controlling visual appearance is a **Design Token**. Pass `:theme` to `<a-config-provider>` at your app root to customize the theme.

> Note: `ConfigProvider` does not apply to static methods like `message.xxx`, `Modal.xxx`, or `notification.xxx` because they render outside your component tree. Wrap your app in [`<a-app>`](/components/app) and use `App.useApp()`, or use `Modal.useModal()` / `message.useMessage()` / `notification.useNotification()`.

### Customize Design Tokens

Override Seed Tokens in `theme.token` and Ant Design Vue derives the full color palette, spacing, and radius scales automatically:

```vue
<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#00b96b',
        borderRadius: 4,
      },
    }"
  >
    <a-button type="primary">Brand Button</a-button>
  </a-config-provider>
</template>
```

This creates a theme centered on <ColorChunk color="#00b96b"></ColorChunk>:

![themed button](https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*CbF_RJfKEiwAAAAAAAAAAAAAARQnAQ)

### Use Preset Algorithms

Switch visual modes rapidly with `theme.algorithm`. Three preset algorithms are built in and can be combined as an array:

- Default algorithm: `theme.defaultAlgorithm`
- Dark algorithm: `theme.darkAlgorithm`
- Compact algorithm: `theme.compactAlgorithm`

```vue
<template>
  <a-config-provider
    :theme="{
      algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
    }"
  >
    <a-button type="primary">Dark + Compact</a-button>
  </a-config-provider>
</template>

<script setup lang="ts">
import { theme } from '@hiltonkohler21/ant-design-vue';
</script>
```

### Customize Component Tokens & Subtree Algorithms

Each component exposes its own Component Tokens (and allows overriding Alias Tokens scoped to that component) without affecting other components:

```vue
<template>
  <a-config-provider
    :theme="{
      components: {
        Radio: {
          colorPrimary: '#00b96b',
        },
        Splitter: {
          splitBarSize: 4,
        },
      },
    }"
  >
    <a-radio>Radio</a-radio>
    <a-checkbox>Checkbox</a-checkbox>
  </a-config-provider>
</template>
```

Only `Radio` adopts <ColorChunk color="#00b96b"></ColorChunk>, leaving `Checkbox` unchanged:

![component token](https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*EMY0QrHFDjsAAAAAAAAAAAAAARQnAQ)

> **Per-component algorithm derivation (`components[X].algorithm`)**: By default, `theme.components[Component]` directly overrides tokens without running Seed → Map algorithm derivation. When you want full derived palette calculation for a subset of components (comparable to `components[X].algorithm` in React `antd`), wrap that subtree in a nested `<a-config-provider :theme="{ token: { colorPrimary: '#00b96b' }, algorithm: theme.defaultAlgorithm }">`, which derives full Map Tokens while automatically isolating CSS scope.

### Disable Motion (`token.motion: false`)

For performance-critical views, automated tests, or reduced-motion preferences, set `motion: false` together with zeroed duration base tokens and optionally disable click waves:

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

## Dynamic Theming & Consuming Tokens

### Dynamic Theme Switching

Bind `:theme` to a reactive Vue `ref` or `computed` to switch themes at runtime without reloading:

```vue
<template>
  <a-config-provider :theme="themeConfig">
    <a-button @click="isDark = !isDark">Switch to {{ isDark ? 'Light' : 'Dark' }}</a-button>
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { theme } from '@hiltonkohler21/ant-design-vue';

const isDark = ref(false);
const themeConfig = computed(() => ({
  algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
}));
</script>
```

### Local / Nested Themes

Nest `<a-config-provider>` to override tokens for a subtree; unchanged tokens inherit from the parent. Under `4.3.0`'s default CSS Variables mode, nested providers with local `token`, `components`, or `algorithm` overrides **automatically isolate into scoped hashed mode** so they never overwrite global `:root` variables:

```vue
<template>
  <a-config-provider :theme="{ token: { colorPrimary: '#1677ff' } }">
    <a-button type="primary">Global Blue</a-button>
    <a-config-provider :theme="{ token: { colorPrimary: '#00b96b' } }">
      <a-button type="primary">Scoped Green (Auto-Isolated)</a-button>
    </a-config-provider>
  </a-config-provider>
</template>
```

### Consuming Tokens in Components: `token` vs `realToken` (4.3.0 Important)

Use `theme.useToken()` to read tokens inside Vue components:

```vue
<template>
  <div :style="boxStyle">Styled with Design Tokens</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { theme } from '@hiltonkohler21/ant-design-vue';

const { token, realToken } = theme.useToken();

// ✅ Assign token directly to CSS styles (in 4.3.0 cssVar mode these are var(--ant-*) with units)
const boxStyle = computed(() => ({
  color: token.value.colorPrimary,
  backgroundColor: token.value.colorBgContainer,
  borderRadius: token.value.borderRadius,
  padding: `calc(${token.value.padding} * 1.5)`,
}));

// ✅ Use realToken for JS arithmetic, explicit px suffixes, color libs, or Canvas/SVG/ECharts
const chartPrimaryColor = computed(() => realToken.value.colorPrimary); // "#1677ff"
const radiusNumber = computed(() => realToken.value.borderRadius); // 6
</script>
```

> **⚠️ 4.3.0 CSS Variables Warning**: Because `cssVar: true` is enabled by default in `4.3.0`, `token.value.borderRadius` evaluates to `'var(--ant-border-radius)'` instead of the number `6`. **Never** write `` `${token.value.borderRadius}px` `` (invalid CSS `var(--ant-border-radius)px`) or `token.value.padding * 2` (`NaN`). Assign `token.value.*` directly to CSS properties, or destructure **`realToken`** for raw numbers and color strings.

### Static Consumption Outside Vue Lifecycle

To compute tokens outside Vue components (e.g., build scripts, Canvas helpers, or Less `modifyVars`), run the exported algorithms against `defaultSeed` (equivalent to `theme.getDesignToken(config)` in React `antd`):

```ts
import { theme } from '@hiltonkohler21/ant-design-vue';
import type { SeedToken, MapToken } from '@hiltonkohler21/ant-design-vue/es/theme/interface';

const { defaultAlgorithm, darkAlgorithm, compactAlgorithm, defaultSeed } = theme;

// Pure helper equivalent to getDesignToken
function getDesignToken(config?: {
  token?: Partial<SeedToken>;
  algorithm?: ((t: SeedToken) => MapToken) | ((t: SeedToken) => MapToken)[];
}) {
  const mergedSeed: SeedToken = { ...defaultSeed, ...config?.token };
  const algorithms = config?.algorithm
    ? Array.isArray(config.algorithm)
      ? config.algorithm
      : [config.algorithm]
    : [defaultAlgorithm];
  return algorithms.reduce<any>((acc, fn) => fn(acc), mergedSeed);
}

const lightToken = getDesignToken({ token: { colorPrimary: '#00b96b' } });
const darkCompactToken = getDesignToken({
  token: { colorPrimary: '#00b96b' },
  algorithm: [darkAlgorithm, compactAlgorithm],
});
```

You can pass derived tokens to `less-loader`'s `modifyVars`. For converting tokens to legacy v3 Less variables, see the [V3 to V4 Migration Guide](/docs/vue/migration-v4).

## CSS Variables & Zero-Runtime Modes (4.3.0+)

### CSS Variables Mode (Default)

Starting in `4.3.0`, `theme.cssVar` defaults to `true`. Component rules are emitted once using `--ant-*` variables, cutting 3-theme CSS size by 50.5% and multi-theme incremental growth by 86.8%. Customize the variable prefix or key if needed:

```vue
<template>
  <a-config-provider
    :theme="{
      cssVar: { prefix: 'my', key: 'brand-theme' },
      token: { colorPrimary: '#00b96b' },
    }"
  >
    <a-button type="primary">Custom CSS Variable Prefix</a-button>
  </a-config-provider>
</template>
```

Pass `:theme="{ cssVar: false }"` to opt back into legacy hashed mode.

### Zero-Runtime Mode (`zeroRuntime: true`)

Pair pre-extracted static CSS (`npm run static-style-extract` → `dist/static-style/antdv.css`) with `zeroRuntime: true` to skip all runtime `<style>` injection:

```vue
<template>
  <a-config-provider :theme="{ cssVar: true, zeroRuntime: true }">
    <App />
  </a-config-provider>
</template>
```

See [SSR & Static Style Extraction](/docs/vue/ssr-extract-ssr) for full extraction workflows.

## Three-Tier Design Token Architecture

Ant Design structures Design Tokens into a three-tier derivation pipeline: **Seed Token → Map Token → Alias Token**.

![token](https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*uF3kTrY4InUAAAAAAAAAAAAAARQnAQ)

- **Seed Token**: The origin of design intent (`colorPrimary`, `borderRadius`, `fontSize`). Changing a Seed Token triggers `algorithm` to derive full scales.
- **Map Token**: Gradient scales derived from Seed Tokens (`colorPrimaryBg`, `colorPrimaryHover`, spacing & radius tiers). Best customized via `algorithm`, or individually overridden in `theme.token`.
- **Alias Token**: Semantic aliases shared across related components (`colorLink`, `colorTextHeading`, `paddingContentHorizontal`).

## API

### ThemeConfig

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| `token` | Override global Design Tokens (Seed / Map / Alias) | `Partial<AliasToken>` | - | `4.0.0` |
| `components` | Override per-component Component Tokens and component-scoped Alias Tokens | `OverrideToken` | - | `4.0.0` |
| `algorithm` | Derivation algorithm(s) from Seed Token to Map Token | `MappingAlgorithm \| MappingAlgorithm[]` | `theme.defaultAlgorithm` | `4.0.0` |
| `inherit` | Inherit theme config from parent `ConfigProvider` | `boolean` | `true` | `4.0.0` |
| `hashed` | Attach hash class name to component styles | `boolean` | `true` | `4.0.0` |
| `cssVar` | CSS Variables config; enabled by default in `4.3.0`; pass `false` for hashed mode | `boolean \| CssVarConfig` | `true` | `4.3.0` |
| `zeroRuntime` | Zero-runtime mode; skips runtime `<style>` injection when paired with static CSS | `boolean` | `false` | `4.3.0` |

### CssVarConfig

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| `prefix` | Prefix for generated CSS custom properties (e.g. `'ant'` → `--ant-color-primary`) | `string` | `'ant'` | `4.3.0` |
| `key` | Unique cache key for the CSS variable theme | `string` | Auto-generated | `4.3.0` |

### OverrideToken

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| `Component` (any component name such as `Button`, `Splitter`) | Override Component Tokens or Alias Tokens consumed by that component | `Partial<ComponentToken> & Partial<AliasToken>` | - |

### SeedToken

<TokenTable type="seed"></TokenTable>

### MapToken

> Inherits all SeedToken properties

<TokenTable type="map"></TokenTable>

### AliasToken

> Inherits all SeedToken and MapToken properties

<TokenTable type="alias"></TokenTable>

## Debug Your Theme

Use the visual [Theme Editor](/theme-editor) to experiment with Seed, Map, Alias, and Component Tokens in real time across Light and Dark modes.

## Legacy Browser Compatibility

See [Compatible Style](/docs/vue/compatible-style).
