# Ant Design Vue Design Specification (DESIGN.md)

> This document defines the core visual design language, token hierarchy (317+ Component Design Tokens), Semantic DOM styling architecture, and UI architectural rules of Ant Design Vue `4.3.0`. It serves as an authoritative specification for AI coding agents, design tools, and developers building user interfaces with `@hiltonkohler21/ant-design-vue`.

---

## 1. Design Values

Ant Design is guided by four core values:

- **Natural (自然)**: Interfaces should feel intuitive, reducing cognitive load with visual rhythms aligned with human perception.
- **Certain (确定)**: Interfaces should offer clear cause-and-effect, predictable layout behavior, and definite affordances.
- **Meaningful (意义)**: Visual elements and motions must carry intent, guiding user attention toward the most relevant tasks.
- **Growing (生长)**: System architectures must be scalable, composable, and adaptable across diverse enterprise business contexts.

---

## 2. Design Token System

Ant Design Vue 4.x (with native `--ant-*` CSS Variables enabled by default and optional `zeroRuntime` static extraction in `4.3.0+`) adopts a four-tier token architecture powered by CSS-in-JS:

```
Seed Token  --->  Map Token  --->  Alias Token  --->  Component Token
(Atomic values)   (Theme gradients) (Semantic bindings) (317+ component overrides)
```

### 2.1 Seed Tokens (Base Units)

Seed tokens define raw atomic values for brand color, sizing, spacing, and typography:

| Token Name | Default Value | Description |
| :-- | :-- | :-- |
| `colorPrimary` | `#1677ff` | Brand primary color |
| `colorSuccess` | `#52c41a` | Functional success indicator |
| `colorWarning` | `#faad14` | Functional warning indicator |
| `colorError` | `#ff4d4f` | Functional danger/error indicator |
| `colorInfo` | `#1677ff` | Functional informative indicator |
| `colorTextBase` | `#000000` | Base text color |
| `colorBgBase` | `#ffffff` | Base background color |
| `fontFamily` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` | System typography stack |
| `fontSize` | `14` | Base font size (px) |
| `lineWidth` | `1` | Base border width (px) |
| `borderRadius` | `6` | Base border radius (px) |
| `sizeUnit` | `4` | Fundamental layout size unit (px) |
| `sizeStep` | `4` | Sizing step multiplier |
| `motionUnit` | `0.1` | Base motion duration unit (s) |

### 2.2 Color Palette

#### Functional & Semantic Colors

- **Primary (`#1677ff`)**: Key interactive actions, focus states, selected items.
- **Success (`#52c41a`)**: Positive confirmation, operation success, active state.
- **Warning (`#faad14`)**: Caution, non-blocking alert, pending status.
- **Error (`#ff4d4f`)**: Blocking errors, destructive actions, validation failures.

#### Neutral Palette & Layering

Neutral colors establish visual depth and reading hierarchy:

- `colorText`: `#000000e0` (88% opacity) - Primary content, body text, titles.
- `colorTextSecondary`: `#000000a6` (65% opacity) - Secondary labels, descriptions.
- `colorTextTertiary`: `#00000073` (45% opacity) - Disabled text, hints, placeholders.
- `colorTextQuaternary`: `#00000040` (25% opacity) - Table borders, decorative lines.
- `colorBgContainer`: `#ffffff` - Component containers (Cards, Modals, Popovers).
- `colorBgElevated`: `#ffffff` - Elevated floating dropdowns, tooltips, menus.
- `colorBgLayout`: `#f5f5f5` - Main application page background.
- `colorBorder`: `#d9d9d9` - Component boundary strokes.
- `colorBorderSecondary`: `#f0f0f0` - Subtle dividers, table inner borders.

### 2.3 Preset Palettes

Ant Design Vue includes 13 preset color palettes accessible via theme tokens and component props (including `Button.color` and `Tag.color`):

- `blue`: `#1677ff`
- `purple`: `#722ed1`
- `cyan`: `#13c2c2`
- `green`: `#52c41a`
- `magenta`: `#eb2f96`
- `pink`: `#eb2f96`
- `red`: `#f5222d`
- `orange`: `#fa8c16`
- `yellow`: `#fadb14`
- `volcano`: `#fa541c`
- `geekblue`: `#2f54eb`
- `gold`: `#faad14`
- `lime`: `#a0d911`

### 2.4 Component Design Tokens (317+ Tokens) & Semantic DOM

`@hiltonkohler21/ant-design-vue@4.3.0` exposes **317+ runtime Component Design Tokens** (341 documented in `token-meta.json` across 61 components with full `ComponentTokenMap` TypeScript types), allowing scoped component styling via `theme.components` without mutating global seed tokens (e.g., `Button` 25 tokens, `Table` 31 tokens, `Input` 17 tokens, `Radio` 14 tokens, `Card` 13 tokens, `Switch` 13 tokens, `Form` 10 tokens, `Descriptions` 9 tokens, `Pagination` 9 tokens, `Badge` 8 tokens, `Breadcrumb` 7 tokens, `Modal` 7 tokens, `Segmented` 7 tokens, `Rate` 6 tokens, `Timeline` 6 tokens, `Progress` 5 tokens, `Alert` 4 tokens, `Collapse` 4 tokens, `Tour` 4 tokens, `Tag` 3 tokens). Every component documentation page includes a searchable `#design-tokens` table with descriptions and click-to-copy names.

For structural DOM customization beyond tokens, **31 components** expose unified **Semantic DOM (`classNames` & `styles`)** props supporting both static maps and dynamic functions `({ props }) => ({ ... })`, paired with interactive `#semantic-dom` previewers on component pages and global merging via **72 `ConfigProvider` per-component configs**. See [Common Props & Semantic DOM](https://hiltonkohler21.github.io/ant-design-vue/docs/vue/common-props).

---

## 3. Layout & Spacing System

### 3.1 Base Spacing Scale

All layout margins, paddings, and gaps derive from a **4px base grid**:

| Token / Key   | Value  | Typical Usage                                           |
| :------------ | :----- | :------------------------------------------------------ |
| `sizeXXS`     | `4px`  | Fine internal icon padding, compact tags                |
| `sizeXS`      | `8px`  | Space between related elements, tight buttons           |
| `sizeSM`      | `12px` | Form field internal horizontal padding                  |
| `size` (base) | `16px` | Standard element gap (`Space :size="16"`), card padding |
| `sizeMD`      | `20px` | Medium section padding                                  |
| `sizeLG`      | `24px` | Standard page container padding, modal body             |
| `sizeXL`      | `32px` | Large section dividers, complex layouts                 |
| `sizeXXL`     | `48px` | Major hero sections, spacious empty states              |

### 3.2 24-Column Grid System

Use `<a-row>` and `<a-col>` for structured responsive layouts:

- Columns sum to `24` per row (`span="12"` + `span="12"`, `span="8"` \* 3).
- Gutter spacing: `:gutter="[16, 16]"` (horizontal and vertical).
- Responsive breakpoints:
  - `xs`: `< 576px` (Mobile)
  - `sm`: `>= 576px` (Large mobile / small tablet)
  - `md`: `>= 768px` (Tablet)
  - `lg`: `>= 992px` (Desktop)
  - `xl`: `>= 1200px` (Large desktop)
  - `xxl`: `>= 1600px` (Ultra-wide displays)

### 3.3 Flexbox, Masonry & Split Layouts

- **`<a-flex>`**: Modern CSS Flexbox (`gap`, `justify`, `align`, `orientation`).
- **`<a-space>` / `<a-space-compact>` / `<a-space-addon>`**: Consistent inline/vertical spacing and compact input addons (`Space.Addon`, new in `4.3.0`).
- **`<a-masonry>`**: Responsive multi-column waterfall layout with shortest-column packing and image load reflow.
- **`<a-splitter>`**: Resizable, collapsible split panes (`orientation`, `draggerIcon`, `onDraggerDoubleClick`).

---

## 4. Typography System

| Token              | Size   | Line Height | Usage                                    |
| :----------------- | :----- | :---------- | :--------------------------------------- |
| `fontSizeSM`       | `12px` | `20px`      | Auxiliary text, badges, secondary hints  |
| `fontSize` (base)  | `14px` | `22px`      | Main body text, form inputs, table data  |
| `fontSizeLG`       | `16px` | `24px`      | Section sub-titles, card titles          |
| `fontSizeXL`       | `20px` | `28px`      | Level 4 headings (`<h4>`), modal titles  |
| `fontSizeHeading3` | `24px` | `32px`      | Level 3 headings (`<h3>`)                |
| `fontSizeHeading2` | `30px` | `38px`      | Level 2 headings (`<h2>`), drawer titles |
| `fontSizeHeading1` | `38px` | `46px`      | Level 1 headings (`<h1>`), page banners  |

Font weights:

- Regular: `400` (`fontWeightNormal`)
- Medium: `500`
- Semi-bold / Bold: `600` (`fontWeightStrong`)

---

## 5. Shape, Elevation & Motion

### 5.1 Border Radius

- `borderRadiusXS`: `2px` (inner elements, tiny indicators)
- `borderRadiusSM`: `4px` (tags, small buttons, tooltips)
- `borderRadius`: `6px` (standard buttons, inputs, cards)
- `borderRadiusLG`: `8px` (modals, drawers, notifications)

### 5.2 Elevation & Shadows

- `boxShadow`: Standard elevation for floating dropdowns, popovers.
- `boxShadowSecondary`: Soft elevation for cards, hover states.
- `boxShadowTertiary`: High elevation for modals, notifications, full overlays.

### 5.3 Motion Curves

All interactive transitions utilize cubic-bezier curves matching natural physics:

- Enter/Opening: `motionEaseOutCirc = cubic-bezier(0.08, 0.82, 0.17, 1)`
- Exit/Closing: `motionEaseInOutCirc = cubic-bezier(0.78, 0.14, 0.15, 0.86)`
- Bounce/Accent: `motionEaseOutBack = cubic-bezier(0.12, 0.4, 0.29, 1.46)`

---

## 6. Component Archetypes & Guidelines for AI Agents

### 6.1 Action Controls (Buttons)

- **Primary (`type="primary"` or `color="primary" variant="solid"`)**: Exactly one primary action per view or modal footer.
- **Default (`type="default"`)**: Secondary actions, cancellations, neutral interactions.
- **Semantic Color + Variant (`4.3.0`)**: Combine `variant` (`outlined`, `dashed`, `solid`, `filled`, `text`, `link`) with `color` (`default`, `primary`, `danger`, or 13 presets) and `iconPlacement`.
- **Danger (`danger` / `color="danger"`)**: Destructive operations (delete, remove, revoke); always pair with confirmation (`<a-popconfirm>`).

### 6.2 Forms & Data Entry

- Standardize layout: `layout="vertical"` is preferred for modern enterprise forms and compact screens; use `<a-form variant="filled">` to propagate a unified visual `variant` across child inputs (`Input`, `InputNumber`, `Select`, `Cascader`, `TreeSelect`, `DatePicker`, `TimePicker`, `Mentions`, `AutoComplete`).
- Bind form controls with `v-model:value` (e.g. `<a-input v-model:value="state.name" />`).
- Use specialized 4.3.0 controls when applicable: `Input.OTP` (`<a-input-otp>`), `ColorPicker`, `Cascader.Panel` (`<a-cascader-panel>`), `DatePicker` (`multiple`, `needConfirm`), `Space.Addon` (`<a-space-addon>`), `Radio.Group` (`block`), and `Rate` (`size`).
- Field validation: Define rules with `async-validator` schema on `<a-form-item :rules="[...]">`.

### 6.3 Data Display & Tables

- **Data Tables (`<a-table>`)**: Always supply unique `row-key="id"`, use typed columns (`TableColumnsType`), enable `virtual` with `:scroll="{ y: 360 }"` for large datasets, and use `column.hidden` for declarative column toggles.
- **Virtualized Lists (`<a-listy>`)**: Prefer `<a-listy>` over legacy `<a-list>` for long or grouped lists (`items`, `rowKey`, `group`, `sticky`, `scrollWidth`, imperative `scrollTo`).
- **Modern Display Subcomponents (`4.3.0`)**: Use `Tag.CheckableTagGroup` (`<a-checkable-tag-group>`) for tag filters, `Statistic.Timer` (`<a-statistic-timer>`) for countdown/countup KPIs, `Image.PreviewGroup.items` for galleries, `Tooltip.UniqueProvider` (`<a-tooltip-unique-provider>`) for smooth sibling tooltips, and `BorderBeam` for highlighted AI/featured cards.

### 6.4 Feedback & Overlays

- **Modals (`<a-modal v-model:open="isOpen">`)**: Reserved for critical, focused tasks; supports `loading` skeleton, `destroyOnHidden`, and `mask: { blur: true }`.
- **Drawers (`<a-drawer v-model:open="isOpen">`)**: Ideal for detail inspectors or secondary forms; supports `resizable`, `loading`, `afterOpenChange`, and `mask: { blur: true }`.
- **Error Boundaries & Alerts**: Use `<a-alert title="..." variant="filled">` and wrap unstable subtrees in `<a-alert-error-boundary>` (`Alert.ErrorBoundary`).
- **Contextual Notifications**: Always use `const { message, modal, notification } = App.useApp()` inside `<a-app>` rather than raw static singletons (`Notification` supports `stack`, `showProgress`, `pauseOnHover`, and `actions`).

---

## 7. Dynamic Theming & Token Consumption in Vue 3

### 7.1 Applying Global & Component Tokens in ConfigProvider

```html
<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#722ed1',
        borderRadius: 8,
      },
      components: {
        Button: { fontWeight: 600 },
        Card: { bodyPadding: 20 },
      },
      algorithm: theme.defaultAlgorithm,
    }"
  >
    <a-app>
      <slot />
    </a-app>
  </a-config-provider>
</template>

<script setup lang="ts">
  import { theme } from '@hiltonkohler21/ant-design-vue';
</script>
```

### 7.2 Consuming Tokens in Custom Components

AI agents can consume the current theme tokens reactively:

```html
<template>
  <div :style="customStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { theme } from '@hiltonkohler21/ant-design-vue';

  const { useToken } = theme;
  const { token, realToken } = useToken();

  const customStyle = computed(() => ({
    backgroundColor: token.value.colorBgContainer,
    color: token.value.colorText,
    borderRadius: token.value.borderRadius,
    border: `1px solid ${token.value.colorBorder}`,
    padding: token.value.padding,
    boxShadow: token.value.boxShadowSecondary,
    // For numeric JS math, use raw values from realToken:
    minHeight: `${realToken.value.controlHeight * 2}px`,
  }));
</script>
```

> **Note**: Since `4.3.0`, `cssVar: true` is enabled by default, so `token.value.borderRadius` and `token.value.padding` resolve to CSS variable references that already include units (e.g., `var(--ant-border-radius)`). Assign them directly without appending `px`; destructure `realToken` from `theme.useToken()` whenever JS numeric or color calculations are needed.

### 7.3 Related Guides

- [4.2.6 → 4.3.0 Migration Guide](https://hiltonkohler21.github.io/ant-design-vue/docs/vue/migration-v43)
- [Use in Vite](https://hiltonkohler21.github.io/ant-design-vue/docs/vue/use-with-vite)
- [Common Props & Semantic DOM](https://hiltonkohler21.github.io/ant-design-vue/docs/vue/common-props)
- [For AI Agents](https://hiltonkohler21.github.io/ant-design-vue/docs/vue/for-agents)
