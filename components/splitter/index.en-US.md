---
category: Components
type: Layout
title: Splitter
cover: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20180%20110%22%20fill%3D%22none%22%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22144%22%20height%3D%2274%22%20rx%3D%228%22%20fill%3D%22%23ffffff%22%20stroke%3D%22%23e5e7eb%22%20stroke-width%3D%221.5%22%2F%3E%3Crect%20x%3D%2226%22%20y%3D%2226%22%20width%3D%2252%22%20height%3D%2258%22%20rx%3D%225%22%20fill%3D%22%23e6f4ff%22%2F%3E%3Crect%20x%3D%2294%22%20y%3D%2226%22%20width%3D%2260%22%20height%3D%2258%22%20rx%3D%225%22%20fill%3D%22%23f0f0f0%22%2F%3E%3Cline%20x1%3D%2286%22%20y1%3D%2220%22%20x2%3D%2286%22%20y2%3D%2290%22%20stroke%3D%22%231677ff%22%20stroke-width%3D%222%22%2F%3E%3Crect%20x%3D%2282%22%20y%3D%2245%22%20width%3D%228%22%20height%3D%2220%22%20rx%3D%224%22%20fill%3D%22%231677ff%22%2F%3E%3C%2Fsvg%3E'
coverDark: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20180%20110%22%20fill%3D%22none%22%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22144%22%20height%3D%2274%22%20rx%3D%228%22%20fill%3D%22%231f1f1f%22%20stroke%3D%22%23383838%22%20stroke-width%3D%221.5%22%2F%3E%3Crect%20x%3D%2226%22%20y%3D%2226%22%20width%3D%2252%22%20height%3D%2258%22%20rx%3D%225%22%20fill%3D%22%2315325b%22%2F%3E%3Crect%20x%3D%2294%22%20y%3D%2226%22%20width%3D%2260%22%20height%3D%2258%22%20rx%3D%225%22%20fill%3D%22%23262626%22%2F%3E%3Cline%20x1%3D%2286%22%20y1%3D%2220%22%20x2%3D%2286%22%20y2%3D%2290%22%20stroke%3D%22%231668dc%22%20stroke-width%3D%222%22%2F%3E%3Crect%20x%3D%2282%22%20y%3D%2245%22%20width%3D%228%22%20height%3D%2220%22%20rx%3D%224%22%20fill%3D%22%231668dc%22%2F%3E%3C%2Fsvg%3E'
---

A panel layout that freely splits the specified area.

## When To Use

- When you need to split an area into multiple resizable panels.

## API

### Splitter

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| layout | The layout direction | `horizontal` \| `vertical` | `horizontal` | 4.3.0 |
| lazy | Update panel sizes during dragging, set `true` to only update after drag ends | boolean | false | 4.3.0 |
| onResize | Callback when panel size changes | (sizes: number[]) => void | - | 4.3.0 |
| onResizeStart | Callback when drag starts | (sizes: number[]) => void | - | 4.3.0 |
| onResizeEnd | Callback when drag ends | (sizes: number[]) => void | - | 4.3.0 |
| onCollapse | Callback when a panel collapses | (collapsed: boolean[], sizes: number[]) => void | - | 4.3.0 |
| rootClassName | The class name of the root element | string | - | 4.3.0 |

### Splitter.Panel

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultSize | Initial panel size, number (px) or percentage string | number \| string | - | 4.3.0 |
| min | Minimum threshold, number (px) or percentage string | number \| string | - | 4.3.0 |
| max | Maximum threshold, number (px) or percentage string | number \| string | - | 4.3.0 |
| size | Controlled panel size, number (px) or percentage string | number \| string | - | 4.3.0 |
| collapsible | Whether collapsible, or control start/end separately | boolean \| { start?, end?, showCollapsibleIcon? } | - | 4.3.0 |
| resizable | Whether resizable | boolean | true | 4.3.0 |
