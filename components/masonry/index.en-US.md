---
category: Components
type: Layout
title: Masonry
subtitle: Masonry
cols: 1
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*cELTRrM5HpAAAAAAOGAAAAgAegCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*2CxJRYJmfbIAAAAAPqAAAAgAegCCAQ/original
tag: 4.3.0
---

A masonry layout that distributes variable-height items into multiple columns (always into the currently shortest column). Supports responsive column count, automatic image-load reflow, and smooth transitions.

## When To Use

- Image walls or card feeds whose items have different heights.
- When you need to reduce empty space and pack content tightly into columns.

## API

### Masonry

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | Data source | MasonryItemType[] | [] | 4.3.0 |
| columns | Column count, supports breakpoints | number \| `Record<Breakpoint, number>` | 2 | 4.3.0 |
| gutter | Gap: number, `[horizontal, vertical]`, or breakpoint map | number \| `[number, number]` \| `Record<Breakpoint, number>` | 16 | 4.3.0 |
| itemRender | Custom render (also supports `#item="{ item, index }"` slot) | ({ key, data, index, ... }) => VueNode \| slot | - | 4.3.0 |
| onLayoutChange | Fired when layout changes (item key → column) | (info: { key, column }[]) => void | - | 4.3.0 |
| fresh | Observe per-item size changes via `ResizeObserver`; set `false` to disable per-item observation | boolean | true | 4.3.0 |
| classNames | Semantic class names (static object or function) | `Record<'root' \| 'item', string>` \| `(info: { props }) => Record<'root' \| 'item', string>` | - | 4.3.0 |
| styles | Semantic styles (static object or function) | `Record<'root' \| 'item', CSSProperties>` \| `(info: { props }) => Record<'root' \| 'item', CSSProperties>` | - | 4.3.0 |
| rootClassName | Root class name | string | - | 4.3.0 |

### MasonryItemType

| Property | Description                         | Type             | Default |
| -------- | ----------------------------------- | ---------------- | ------- |
| key      | Unique key                          | string \| number | -       |
| column   | Pin to a column                     | number           | -       |
| height   | Estimated height to avoid re-layout | number           | -       |
| children | Custom content                      | VueNode          | -       |
| data     | Business data                       | any              | -       |

### MasonryRef

| Property      | Description      | Type                     | Version |
| ------------- | ---------------- | ------------------------ | ------- |
| nativeElement | Root DOM element | `HTMLDivElement \| null` | 4.3.0   |
