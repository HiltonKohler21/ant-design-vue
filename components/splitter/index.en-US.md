---
category: Components
type: Layout
title: Splitter
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
