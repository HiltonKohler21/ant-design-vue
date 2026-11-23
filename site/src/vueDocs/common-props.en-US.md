# Common Props

`ant-design-vue@4.3.0` standardizes a shared set of cross-component props and customization protocols, covering root container classes, semantic DOM styling, visual `variant` options, unified unmount-on-hide behavior, and `ConfigProvider` per-component defaults.

> These props apply to most components. Check individual component API tables for exceptions or component-specific semantic slot names.

## Core Common Props

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| `class` | Custom class name on the primary container (standard Vue attribute fallthrough) | `string \| Record<string, boolean> \| Array<any>` | - | - |
| `style` | Inline styles on the primary container (standard Vue attribute fallthrough) | `CSSProperties` | - | - |
| `rootClassName` | Class name applied to the outermost root element (including teleported overlay roots) | `string` | - | `4.2.7` |
| `classNames` | Semantic class name map for styling internal sub-elements | `Record<SemanticName, string>` or function | - | `4.2.7` / `4.3.0` |
| `styles` | Semantic inline style map replacing scattered legacy props (`bodyStyle`, `headStyle`, etc.) | `Record<SemanticName, CSSProperties>` or function | - | `4.2.7` / `4.3.0` |
| `variant` | Visual style variant replacing legacy boolean `bordered` / `dashed` props | See [Visual `variant`](#visual-variant) | `outlined` | `4.2.7` |
| `destroyOnHidden` | Unmount child DOM nodes when hidden/closed (replaces `destroyOnClose`, `destroyInactiveTabPane`, etc.) | `boolean` | `false` | `4.2.7` |
| `prefixCls` | Custom CSS class prefix (usually configured globally via `ConfigProvider`) | `string` | `ant-<component>` | - |

## `rootClassName` vs `class`

For multi-layer or portal-rendered components (such as `Drawer`, `Modal`, `Tooltip`, and `Select`):

- **`class`** attaches to the main content wrapper or trigger element.
- **`rootClassName`** always attaches to the outermost root element (e.g., `.ant-drawer`, `.ant-modal-root`), making root-level overrides resilient to internal DOM changes.

```vue
<template>
  <a-modal v-model:open="open" root-class-name="my-order-modal" title="Order Details">
    <p>rootClassName reliably targets the outermost .ant-modal-root container.</p>
  </a-modal>
</template>
```

## Semantic `classNames` and `styles`

The `classNames` and `styles` props expose structured slots for internal DOM nodes, replacing legacy props such as `bodyStyle`, `headStyle`, `maskStyle`, `dropdownStyle`, and `imageStyle`.

### Common Semantic Slots Reference

| Components | Semantic Slot Keys (`classNames` / `styles`) |
| --- | --- |
| `Modal` / `Drawer` | `mask`, `wrapper`, `content`, `header`, `body`, `footer` |
| `Card` | `header`, `body`, `extra`, `actions`, `title`, `cover` |
| `Descriptions` | `root`, `header`, `title`, `extra`, `label`, `content` |
| `Input` / `Input.TextArea` | `prefix`, `suffix`, `input`, `count` |
| `Select` / `TreeSelect` / `Cascader` / `AutoComplete` | `root`, `popup: { root }` |
| `Slider` | `root`, `tracks`, `track`, `rail`, `handle` |
| `Button` | `icon` |
| `Listy` | `root`, `item`, `groupHeader`, `groupSection`, `holder`, `scrollbar` (also supports function `({ props }) => ...`) |
| `Masonry` | `root`, `item` |
| `Empty` / `Badge` / `Space` / `Tooltip` / `List` | See each component's API page |

### Example

```vue
<template>
  <a-card
    title="Billing Summary"
    :class-names="{ header: 'billing-header', body: 'billing-body' }"
    :styles="{
      header: { borderBottom: 'none', paddingBottom: '0' },
      body: { paddingTop: '12px' },
    }"
  >
    Target internal elements cleanly with semantic classNames and styles.
  </a-card>
</template>
```

Components that support functional semantic props (such as `Listy`) can also derive styles dynamically from current `props`:

```vue
<template>
  <a-listy
    :items="items"
    row-key="id"
    :height="240"
    :styles="({ props }) => ({ item: { fontWeight: props.rowHoverable ? 500 : 400 } })"
  />
</template>
```

## Visual `variant`

`variant` unifies styling options across form controls, containers, buttons, and dividers:

- **Form inputs** (`Input`, `InputNumber`, `Input.OTP`, `Select`, `Cascader`, `TreeSelect`, `Mentions`, `AutoComplete`, `DatePicker`, `TimePicker`, `RangePicker`):
  - `'outlined'` (default), `'filled'`, `'borderless'`, `'underlined'`
- **`Card`**: `'outlined'` (default), `'borderless'`
- **`Button`**: `'outlined'`, `'dashed'`, `'solid'`, `'filled'`, `'text'`, `'link'` (paired with `color`)
- **`Divider`**: `'solid'` (default), `'dashed'`, `'dotted'`

```vue
<template>
  <a-space direction="vertical" style="width: 320px">
    <a-input variant="outlined" placeholder="Outlined (default)" />
    <a-input variant="filled" placeholder="Filled" />
    <a-input variant="borderless" placeholder="Borderless" />
    <a-input variant="underlined" placeholder="Underlined" />
  </a-space>
</template>
```

You can set a default `variant` globally on `<a-config-provider variant="filled">` or per form on `<a-form variant="filled">`, while component-level `variant` takes precedence.

## Unified `destroyOnHidden`

`Modal`, `Drawer`, `Tabs`, `Dropdown`, `Tooltip`, `Collapse`, and `Splitter.Panel` support `destroyOnHidden` to unmount inactive content when hidden, replacing `destroyOnClose`, `destroyInactiveTabPane`, `destroyPopupOnHide`, `destroyTooltipOnHide`, and `destroyInactivePanel`:

```vue
<template>
  <a-modal v-model:open="open" title="Edit Order" destroy-on-hidden>
    <OrderForm />
  </a-modal>
</template>
```

## `ConfigProvider` Component Defaults

In `4.3.0`, `ConfigProvider` supports **72 per-component default configs**. Global `className`, `style`, `classNames`, and `styles` are merged automatically with component-level props (classes concatenated, style objects merged with component-level props taking precedence):

```vue
<template>
  <a-config-provider
    variant="filled"
    :button="{ autoInsertSpace: false, className: 'brand-btn' }"
    :card="{ variant: 'borderless', styles: { body: { padding: '20px' } } }"
    :modal="{ centered: true, styles: { header: { paddingBottom: '12px' } } }"
    :space="{ size: 'middle' }"
    :pagination="{ showSizeChanger: true }"
    :divider="{ variant: 'dashed' }"
  >
    <App />
  </a-config-provider>
</template>
```

See [ConfigProvider](/components/config-provider) for the complete reference of all 72 component configs.
