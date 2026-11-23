---
category: Components
type: Layout
title: Masonry
subtitle: Masonry
cols: 1
cover: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20180%20110%22%20fill%3D%22none%22%3E%3Crect%20x%3D%2220%22%20y%3D%2214%22%20width%3D%2242%22%20height%3D%2234%22%20rx%3D%226%22%20fill%3D%22%23e6f4ff%22%20stroke%3D%22%2391caff%22%2F%3E%3Crect%20x%3D%2220%22%20y%3D%2254%22%20width%3D%2242%22%20height%3D%2242%22%20rx%3D%226%22%20fill%3D%22%23f0f0f0%22%20stroke%3D%22%23e5e7eb%22%2F%3E%3Crect%20x%3D%2269%22%20y%3D%2214%22%20width%3D%2242%22%20height%3D%2248%22%20rx%3D%226%22%20fill%3D%22%231677ff%22%2F%3E%3Crect%20x%3D%2269%22%20y%3D%2268%22%20width%3D%2242%22%20height%3D%2228%22%20rx%3D%226%22%20fill%3D%22%23f0f0f0%22%20stroke%3D%22%23e5e7eb%22%2F%3E%3Crect%20x%3D%22118%22%20y%3D%2214%22%20width%3D%2242%22%20height%3D%2228%22%20rx%3D%226%22%20fill%3D%22%23f0f0f0%22%20stroke%3D%22%23e5e7eb%22%2F%3E%3Crect%20x%3D%22118%22%20y%3D%2248%22%20width%3D%2242%22%20height%3D%2248%22%20rx%3D%226%22%20fill%3D%22%23e6f4ff%22%20stroke%3D%22%2391caff%22%2F%3E%3C%2Fsvg%3E'
coverDark: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20180%20110%22%20fill%3D%22none%22%3E%3Crect%20x%3D%2220%22%20y%3D%2214%22%20width%3D%2242%22%20height%3D%2234%22%20rx%3D%226%22%20fill%3D%22%2315325b%22%20stroke%3D%22%2315417e%22%2F%3E%3Crect%20x%3D%2220%22%20y%3D%2254%22%20width%3D%2242%22%20height%3D%2242%22%20rx%3D%226%22%20fill%3D%22%23262626%22%20stroke%3D%22%23383838%22%2F%3E%3Crect%20x%3D%2269%22%20y%3D%2214%22%20width%3D%2242%22%20height%3D%2248%22%20rx%3D%226%22%20fill%3D%22%231668dc%22%2F%3E%3Crect%20x%3D%2269%22%20y%3D%2268%22%20width%3D%2242%22%20height%3D%2228%22%20rx%3D%226%22%20fill%3D%22%23262626%22%20stroke%3D%22%23383838%22%2F%3E%3Crect%20x%3D%22118%22%20y%3D%2214%22%20width%3D%2242%22%20height%3D%2228%22%20rx%3D%226%22%20fill%3D%22%23262626%22%20stroke%3D%22%23383838%22%2F%3E%3Crect%20x%3D%22118%22%20y%3D%2248%22%20width%3D%2242%22%20height%3D%2248%22%20rx%3D%226%22%20fill%3D%22%2315325b%22%20stroke%3D%22%2315417e%22%2F%3E%3C%2Fsvg%3E'
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
| columns | Column count, supports breakpoints | number \| `Record<Breakpoint, number>` | 2 | 4.3.0 |
| gutter | Gap: number, `[horizontal, vertical]`, or breakpoint map | number \| `[number, number]` \| `Record<Breakpoint, number>` | 16 | 4.3.0 |
| itemRender | Custom render | ({ key, data, index, ... }) => VueNode | - | 4.3.0 |
| onLayoutChange | Fired when layout changes (item key → column) | (info: { key, column }[]) => void | - | 4.3.0 |
| fresh | Force re-layout | boolean | false | 4.3.0 |
| classNames | Semantic class names `{ root, item }` | object | - | 4.3.0 |
| styles | Semantic styles `{ root, item }` | object | - | 4.3.0 |
| rootClassName | Root class name | string | - | 4.3.0 |

### MasonryItemType

| Property | Description                         | Type             | Default |
| -------- | ----------------------------------- | ---------------- | ------- |
| key      | Unique key                          | string \| number | -       |
| column   | Pin to a column                     | number           | -       |
| height   | Estimated height to avoid re-layout | number           | -       |
| children | Custom content                      | VueNode          | -       |
| data     | Business data                       | any              | -       |
