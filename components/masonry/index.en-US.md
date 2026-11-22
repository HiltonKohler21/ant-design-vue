---
category: Components
type: Layout
title: Masonry
subtitle: Masonry
---

A masonry layout that distributes variable-height items into multiple columns (always into the currently shortest column). Supports responsive column count and gutters.

## When To Use

- Image walls or card feeds whose items have different heights.
- When you need to reduce empty space and pack content tightly into columns.

## API

### Masonry

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | Data source | MasonryItemType[] | [] | 4.3.0 |
| columns | Column count, supports breakpoints | number \| Record<Breakpoint, number> | 2 | 4.3.0 |
| gutter | Gap: number, `[horizontal, vertical]`, or breakpoint map | number \| [number, number] \| Record<Breakpoint, number> | 16 | 4.3.0 |
| itemRender | Custom render | ({ key, data, index, ... }) => VueNode | - | 4.3.0 |
| onLayoutChange | Fired when layout changes (item key → column) | (info: { key, column }[]) => void | - | 4.3.0 |
| fresh | Force re-layout | boolean | false | 4.3.0 |
| classNames | Semantic class names `{ root, item }` | object | - | 4.3.0 |
| styles | Semantic styles `{ root, item }` | object | - | 4.3.0 |
| rootClassName | Root class name | string | - | 4.3.0 |

### MasonryItemType

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| key | Unique key | string \| number | - |
| column | Pin to a column | number | - |
| height | Estimated height to avoid re-layout | number | - |
| children | Custom content | VueNode | - |
| data | Business data | any | - |
