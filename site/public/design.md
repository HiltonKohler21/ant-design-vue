# Ant Design Vue Design Specification (DESIGN.md)

> This document defines the core visual design language, token hierarchy, and UI architectural rules of Ant Design Vue. It serves as an authoritative specification for AI coding agents, design tools, and developers building user interfaces with `ant-design-vue`.

---

## 1. Design Values

Ant Design is guided by four core values:

- **Natural (自然)**: Interfaces should feel intuitive, reducing cognitive load with visual rhythms aligned with human perception.
- **Certain (确定)**: Interfaces should offer clear cause-and-effect, predictable layout behavior, and definite affordances.
- **Meaningful (意义)**: Visual elements and motions must carry intent, guiding user attention toward the most relevant tasks.
- **Growing (生长)**: System architectures must be scalable, composable, and adaptable across diverse enterprise business contexts.

---

## 2. Design Token System

Ant Design Vue 4.x (with native `--ant-*` CSS Variables enabled by default and optional zero-runtime mode in 4.3.0+) adopts a four-tier token architecture powered by CSS-in-JS:

```
Seed Token  --->  Map Token  --->  Alias Token  --->  Component Token
(Atomic values)   (Theme gradients) (Semantic bindings) (Component overrides)
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

Ant Design Vue includes 13 preset color palettes accessible via theme tokens and component props:

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

### 3.3 Flexbox Layout (`<a-flex>`)

Use `<a-flex>` for modern CSS Flexbox arrangements:

- `gap`: `'small' | 'middle' | 'large'` or direct pixel numbers.
- `justify`: `'start' | 'end' | 'center' | 'space-between' | 'space-around'`.
- `align`: `'start' | 'end' | 'center' | 'baseline' | 'stretch'`.

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

- **Primary (`type="primary"`)**: Exactly one primary action per view or modal footer.
- **Default (`type="default"`)**: Secondary actions, cancellations, neutral interactions.
- **Dashed (`type="dashed"`)**: Common for adding new items to dynamic lists.
- **Link (`type="link"`)**: Inline navigational actions, table row actions.
- **Text (`type="text"`)**: Low-emphasis toolbar buttons, icon triggers.
- **Danger (`danger`)**: Destructive operations (delete, remove, revoke); always pair with confirmation (`<a-popconfirm>`).

### 6.2 Forms

- Standardize layout: `layout="vertical"` is preferred for modern enterprise forms and compact screens; `layout="horizontal"` is reserved for simple search bars or settings panels.
- Bind form controls with `v-model:value` (e.g. `<a-input v-model:value="state.name" />`).
- Field validation: Define rules with `async-validator` schema on `<a-form-item :rules="[...]">`.

### 6.3 Data Tables

- Always supply unique `row-key="id"` (or field name).
- Use typed columns (`TableColumnsType`).
- Position actions column last with fixed right alignment (`fixed: 'right'`) when horizontal scrolling is expected.

### 6.4 Feedback & Overlays

- **Modals (`<a-modal v-model:open="isOpen">`)**: Reserved for critical, focused tasks requiring full attention.
- **Drawers (`<a-drawer v-model:open="isOpen">`)**: Ideal for viewing details, complex multi-step forms, or secondary side panels without breaking the page context.
- **Contextual Notifications**: Always use `const { message, modal, notification } = App.useApp()` inside `<a-app>` rather than raw static singletons.

---

## 7. Dynamic Theming & Token Consumption in Vue 3

### 7.1 Applying Global Theme in ConfigProvider

```html
<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#722ed1',
        borderRadius: 8,
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
  import { theme } from 'ant-design-vue';
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
  import { theme } from 'ant-design-vue';

  const { useToken } = theme;
  const { token } = useToken();

  const customStyle = computed(() => ({
    backgroundColor: token.value.colorBgContainer,
    color: token.value.colorText,
    borderRadius: `${token.value.borderRadius}px`,
    border: `1px solid ${token.value.colorBorder}`,
    padding: `${token.value.padding}px`,
    boxShadow: token.value.boxShadowSecondary,
  }));
</script>
```
