---
category: Components
type: Data Display
title: Listy
cols: 1
subtitle: Listy
tag: 4.3.0
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*EYuhSpw1iSwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*tBzwQ7raKX8AAAAAAAAAAAAADrJ8AQ/original
---

A high-performance list container with row hover, grouped sticky headers, horizontal scrolling, and optional virtual scrolling. Recommended over legacy `List` for long or lightweight lists.

## When To Use

- When you need to render a long list without paying the cost of mounting every row — enable `virtual` with `height` to render only the rows in view.
- When the list needs grouped sections with sticky headers (`group` + `sticky`).
- When you need imperative control over scroll position (jump to an item, a group, or a pixel offset).

## API

### Listy

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | Record\<`root` \| `item` \| `groupHeader` \| `groupSection` \| `holder` \| `scrollbar`, string\> \| (info: { props: ListyProps }) => Record\<string, string\> | - | 4.3.0 |
| group | Grouping config, see [Group](#group) below | [ListyGroupConfig](#group) | - | 4.3.0 |
| height | Height of the scroll container; content scrolls when it overflows (works in both virtual and non-virtual modes) | number | - | 4.3.0 |
| itemHeight | Optional row height override; auto-calculated from theme tokens when omitted | number | - | 4.3.0 |
| itemRender | Render a single row; also supports `#item="{ item, index }"` slot | (item: T, index: number) => VueNode | - | 4.3.0 |
| items | Data source of the list | T[] | `[]` | 4.3.0 |
| rootClassName | Root element class name | string | - | 4.3.0 |
| rowHoverable | Whether rows are hoverable | boolean | `true` | 4.3.0 |
| rowKey | Unique key of an item, a field name or a getter function | string \| (item: T, index?: number) => Key | - | 4.3.0 |
| scrollWidth | Horizontal scroll width of the content; scrolls horizontally when it exceeds the container | number | - | 4.3.0 |
| sticky | Whether group headers stick to the top | boolean | `false` | 4.3.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | Record\<`root` \| `item` \| `groupHeader` \| `groupSection` \| `holder` \| `scrollbar`, CSSProperties\> \| (info: { props: ListyProps }) => Record\<string, CSSProperties\> | - | 4.3.0 |
| virtual | Whether to enable virtual scrolling, rendering only rows in view, requires `height` (falls back to `ConfigProvider.virtual`) | boolean | `false` | 4.3.0 |
| ~~data~~ | Deprecated, please use `items` instead | T[] | - | 4.3.0 |
| ~~itemKey~~ | Deprecated, please use `rowKey` instead | string \| (item: T, index?: number) => Key | - | 4.3.0 |

### Events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| scroll | Native scroll event handler (also accepts `onScroll` prop) | (e: UIEvent) => void | 4.3.0 |

### Slots

| Slot Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| item | Custom single row renderer (lower priority than `itemRender`) | { item: T, index: number } | 4.3.0 |
| groupTitle | Custom group header renderer (lower priority than `group.title`) | { groupKey: K, items: T[] } | 4.3.0 |

### Group

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| key | Compute the group key an item belongs to (field name or function); items with the same key are grouped together | string \| (item: T) => K | - |
| title | Render the group header; receives the group key and its items | (groupKey: K, items: T[]) => VueNode | - |

### Ref

| Name | Description | Type |
| --- | --- | --- |
| nativeElement | Root DOM element of the component | HTMLElement |
| scrollTo | Scroll to a pixel offset, an item, or a group | (config?: ListyScrollToConfig) => void |
| scrollToIndex | Shortcut to scroll to an item by index (equivalent to `scrollTo({ index })`) | (index: number) => void |

`ListyScrollToConfig` is one of:

| Shape                           | Description                                     |
| ------------------------------- | ----------------------------------------------- |
| number                          | Scroll to a pixel offset (`scrollTop`)          |
| `{ top?, left? }`               | Scroll to an absolute pixel position            |
| `{ key, align?, offset? }`      | Scroll to the item whose `rowKey` matches `key` |
| `{ groupKey, align?, offset? }` | Scroll to a group header                        |
| `{ index, align?, offset? }`    | Scroll to the item at `index`                   |

`align` is `'top' | 'bottom' | 'auto'`; `offset` is an extra pixel offset applied after alignment.
