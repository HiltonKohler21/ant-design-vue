# Common Props

`ant-design-vue@4.3.0` standardizes a shared set of cross-component props and customization protocols, covering root container classes, static & functional **Semantic DOM (`classNames` / `styles`)** styling across 31 components, visual `variant` options, unified unmount-on-hide behavior, and **72 `ConfigProvider` per-component defaults**.

> These props apply to most components. Check individual component API tables (and the interactive `#semantic-dom` previewer) for exceptions or component-specific semantic slot names.

## Core Common Props

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| `class` | Custom class name on the primary container (standard Vue attribute fallthrough) | `string \| Record<string, boolean> \| Array<any>` | - | - |
| `style` | Inline styles on the primary container (standard Vue attribute fallthrough) | `CSSProperties` | - | - |
| `rootClassName` | Class name applied to the outermost root element (including teleported overlay roots) | `string` | - | `4.2.7` |
| `classNames` | Semantic class name map (or dynamic function) for styling internal sub-elements | `Record<SemanticName, string> \| ((info: { props }) => Record<SemanticName, string>)` | - | `4.2.7` / `4.3.0` |
| `styles` | Semantic inline style map (or dynamic function) replacing legacy props (`bodyStyle`, `headStyle`, etc.) | `Record<SemanticName, CSSProperties> \| ((info: { props }) => Record<SemanticName, CSSProperties>)` | - | `4.2.7` / `4.3.0` |
| `variant` | Visual style variant replacing legacy boolean `bordered` / `dashed` props | See [Visual `variant`](#visual-variant) | `outlined` | `4.2.7` / `4.3.0` |
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

## Semantic DOM (`classNames` and `styles`)

The `classNames` and `styles` props expose structured slots for internal DOM nodes, replacing legacy props such as `bodyStyle`, `headStyle`, `headerStyle`, `footerStyle`, `maskStyle`, `dropdownStyle`, `imageStyle`, `wrapperStyle`, and `orientationMargin`.

> **Interactive Semantic DOM Previewer**: Every semantic-enabled component page now includes an interactive **`Semantic DOM` (`#semantic-dom`)** previewer right above `#design-tokens` (for example, try [Alert Semantic DOM](/components/alert#semantic-dom), [Card Semantic DOM](/components/card#semantic-dom), or [Button Semantic DOM](/components/button#semantic-dom)). Hover or click any slot name to highlight the exact live DOM element and copy its key or usage snippet.

### Static Object Usage

Pass a plain object mapping each semantic slot key to a class name or `CSSProperties` object:

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

### Functional `classNames` and `styles` (`({ props }) => ...`)

In `4.3.0`, `classNames` and `styles` also accept a **callback function** receiving `{ props }`, allowing you to compute classes and styles dynamically from the component's current props (and merge cleanly with global `ConfigProvider` defaults):

```vue
<template>
  <a-space orientation="vertical" :size="16" style="width: 100%">
    <a-alert
      title="Dynamic Semantic Styling"
      description="Adjust padding and title weight dynamically based on alert props."
      type="info"
      variant="filled"
      show-icon
      :class-names="({ props }) => ({ root: props.variant === 'filled' ? 'alert-filled-box' : '' })"
      :styles="
        ({ props }) => ({
          root: { borderRadius: '10px' },
          title: { fontWeight: props.variant === 'filled' ? 600 : 500 },
        })
      "
    />

    <a-listy
      :items="items"
      row-key="id"
      :height="200"
      :styles="({ props }) => ({ item: { fontWeight: props.rowHoverable ? 500 : 400 } })"
    >
      <template #item="{ item }">
        <div>{{ item.name }}</div>
      </template>
    </a-listy>
  </a-space>
</template>

<script setup lang="ts">
const items = [
  { id: 1, name: 'Functional classNames' },
  { id: 2, name: 'Functional styles' },
];
</script>
```

### All 31 Semantic-Enabled Components

Click any component below to inspect its live **`Semantic DOM` (`#semantic-dom`)** previewer:

| Component | Semantic Slot Keys (`classNames` / `styles`) | Interactive Previewer |
| --- | --- | --- |
| `Alert` | `root`, `icon`, `section`, `title`, `description`, `actions`, `close` | [Alert `#semantic-dom`](/components/alert#semantic-dom) |
| `AutoComplete` | `root`, `prefix`, `suffix`, `popup: { root }` | [AutoComplete `#semantic-dom`](/components/auto-complete#semantic-dom) |
| `Badge` | `root`, `indicator` | [Badge `#semantic-dom`](/components/badge#semantic-dom) |
| `Button` | `root`, `icon`, `content` | [Button `#semantic-dom`](/components/button#semantic-dom) |
| `Card` | `root`, `header`, `title`, `extra`, `body`, `actions`, `cover` | [Card `#semantic-dom`](/components/card#semantic-dom) |
| `Cascader` | `root`, `prefix`, `suffix`, `popup: { root }` | [Cascader `#semantic-dom`](/components/cascader#semantic-dom) |
| `Collapse` | `root`, `header`, `title`, `body`, `icon` | [Collapse `#semantic-dom`](/components/collapse#semantic-dom) |
| `Descriptions` | `root`, `header`, `title`, `extra`, `label`, `content` | [Descriptions `#semantic-dom`](/components/descriptions#semantic-dom) |
| `Divider` | `root`, `rail`, `content` | [Divider `#semantic-dom`](/components/divider#semantic-dom) |
| `Drawer` | `mask`, `wrapper`, `content`, `header`, `body`, `footer` | [Drawer `#semantic-dom`](/components/drawer#semantic-dom) |
| `Empty` | `root`, `image`, `description`, `footer` | [Empty `#semantic-dom`](/components/empty#semantic-dom) |
| `Image` | `root`, `image`, `cover`, `popup: { root, mask, body, footer, actions, close }` | [Image `#semantic-dom`](/components/image#semantic-dom) |
| `Input` | `root`, `prefix`, `suffix`, `input`, `count` (covers `Input`, `TextArea`, `Password`, `Search`, `OTP`) | [Input `#semantic-dom`](/components/input#semantic-dom) |
| `List` | `root`, `header`, `item`, `actions`, `extra`, `footer` | [List `#semantic-dom`](/components/list#semantic-dom) |
| `Listy` | `root`, `item`, `groupHeader`, `groupSection`, `holder`, `scrollbar` | [Listy `#semantic-dom`](/components/listy#semantic-dom) |
| `Masonry` | `root`, `item` | [Masonry `#semantic-dom`](/components/masonry#semantic-dom) |
| `Modal` | `mask`, `wrapper`, `content`, `header`, `body`, `footer` | [Modal `#semantic-dom`](/components/modal#semantic-dom) |
| `Popconfirm` | `root`, `container` (`body`), `title`, `content`, `arrow` | [Popconfirm `#semantic-dom`](/components/popconfirm#semantic-dom) |
| `Popover` | `root`, `container` (`body`), `title`, `content`, `arrow` | [Popover `#semantic-dom`](/components/popover#semantic-dom) |
| `Progress` | `root`, `rail`, `track`, `indicator` | [Progress `#semantic-dom`](/components/progress#semantic-dom) |
| `Segmented` | `root`, `item`, `label`, `icon` | [Segmented `#semantic-dom`](/components/segmented#semantic-dom) |
| `Select` | `root`, `prefix`, `suffix`, `popup: { root }` | [Select `#semantic-dom`](/components/select#semantic-dom) |
| `Slider` | `root`, `tracks`, `track`, `rail`, `handle` | [Slider `#semantic-dom`](/components/slider#semantic-dom) |
| `Space` | `root`, `item`, `separator` | [Space `#semantic-dom`](/components/space#semantic-dom) |
| `Spin` | `root`, `wrapper`, `mask`, `section`, `indicator`, `description` (`tip`) | [Spin `#semantic-dom`](/components/spin#semantic-dom) |
| `Splitter` | `root`, `panel`, `dragger` | [Splitter `#semantic-dom`](/components/splitter#semantic-dom) |
| `Steps` | `root`, `item`, `itemIcon`, `itemTitle`, `itemContent`, `itemRail` | [Steps `#semantic-dom`](/components/steps#semantic-dom) |
| `Tag` | `root`, `icon`, `content`, `close` (`CheckableTagGroup`: `root`, `item`) | [Tag `#semantic-dom`](/components/tag#semantic-dom) |
| `Tooltip` | `root`, `container` (`body`), `arrow` | [Tooltip `#semantic-dom`](/components/tooltip#semantic-dom) |
| `Transfer` | `root`, `section`, `header`, `title`, `list`, `item`, `footer`, `actions` | [Transfer `#semantic-dom`](/components/transfer#semantic-dom) |
| `TreeSelect` | `root`, `prefix`, `suffix`, `popup: { root }` | [TreeSelect `#semantic-dom`](/components/tree-select#semantic-dom) |

## Visual `variant`

`variant` unifies styling options across form controls, containers, buttons, feedback, and display components:

- **Form inputs** (`Input`, `InputNumber`, `Input.OTP`, `Select`, `Cascader`, `TreeSelect`, `Mentions`, `AutoComplete`, `DatePicker`, `TimePicker`, `RangePicker`, `Space.Addon`):
  - `'outlined'` (default), `'filled'`, `'borderless'`, `'underlined'`
- **`Card`**: `'outlined'` (default), `'borderless'`
- **`Button`**: `'outlined'`, `'dashed'`, `'solid'`, `'filled'`, `'text'`, `'link'` (paired with `color`)
- **`Divider`**: `'solid'` (default), `'dashed'`, `'dotted'`
- **`Alert` / `Steps` / `Timeline`**: `'outlined'` (default), `'filled'`
- **`Tag`**: `'outlined'` (default), `'filled'`, `'solid'`

```vue
<template>
  <a-space orientation="vertical" style="width: 320px">
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

## `ConfigProvider` Component Defaults (72 Component Configs)

In `4.3.0`, `ConfigProvider` supports **72 per-component default configs**. Global `className`, `style`, `classNames`, and `styles` (including functional semantic callbacks) are merged automatically with component-level props (classes concatenated, style objects merged with component-level props taking precedence):

```vue
<template>
  <a-config-provider
    variant="filled"
    :button="{ autoInsertSpace: false, className: 'brand-btn' }"
    :card="{ variant: 'borderless', styles: { body: { padding: '20px' } } }"
    :alert="{ variant: 'filled' }"
    :modal="{ centered: true, styles: { header: { paddingBottom: '12px' } } }"
    :space="{ size: 'middle' }"
    :pagination="{ showSizeChanger: true }"
    :divider="{ variant: 'dashed' }"
  >
    <App />
  </a-config-provider>
</template>
```

See [ConfigProvider](/components/config-provider) for the complete reference of all 72 component configs and [4.2.6 → 4.3.0 Migration Guide](/docs/vue/migration-v43) for upgrade patterns.
