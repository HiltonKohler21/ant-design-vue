---
category: Components
type: Layout
title: Splitter
tag: 4.3.0
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*f0SISaETY0wAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*y92yRYhObU8AAAAAAAAAAAAADrJ8AQ/original
---

A panel layout that freely splits the specified area.

## When To Use

- When you need to split an area into multiple resizable panels.

## API

### Splitter

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Semantic DOM class names (object or function) | `SplitterClassNamesType` | - | 4.3.0 |
| collapsibleIcon | Customize collapsible icons | `{ start?: VueNode; end?: VueNode }` | - | 4.3.0 |
| draggerClassName | Customize dragger class name | `string \| { default?: string; active?: string }` | - | 4.3.0 |
| draggerIcon | Customize dragger icon | `VueNode` | - | 4.3.0 |
| draggerStyle | Customize dragger style | `CSSProperties \| { default?: CSSProperties; active?: CSSProperties }` | - | 4.3.0 |
| layout | The layout direction (deprecated, please use `orientation`) | `horizontal` \| `vertical` | `horizontal` | 4.3.0 |
| lazy | Update panel sizes during dragging, set `true` to only update after drag ends | boolean | false | 4.3.0 |
| orientation | The layout direction, takes precedence over `layout` | `horizontal` \| `vertical` | `horizontal` | 4.3.0 |
| rootClassName | The class name of the root element | string | - | 4.3.0 |
| styles | Semantic DOM styles (object or function) | `SplitterStylesType` | - | 4.3.0 |
| onCollapse | Callback when a panel collapses | (collapsed: boolean[], sizes: number[]) => void | - | 4.3.0 |
| onDraggerDoubleClick | Callback when double-clicking a dragger (also emits `draggerDoubleClick`) | (index: number) => void | - | 4.3.0 |
| onResize | Callback when panel size changes | (sizes: number[]) => void | - | 4.3.0 |
| onResizeEnd | Callback when drag ends | (sizes: number[]) => void | - | 4.3.0 |
| onResizeStart | Callback when drag starts | (sizes: number[]) => void | - | 4.3.0 |

### Splitter.Panel

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultSize | Initial panel size, number (px) or percentage string | number \| string | - | 4.3.0 |
| min | Minimum threshold, number (px) or percentage string | number \| string | - | 4.3.0 |
| max | Maximum threshold, number (px) or percentage string | number \| string | - | 4.3.0 |
| size | Controlled panel size, number (px) or percentage string | number \| string | - | 4.3.0 |
| collapsible | Whether collapsible, or control start/end separately | boolean \| { start?, end?, showCollapsibleIcon? } | - | 4.3.0 |
| destroyOnHidden | Destroy child elements when collapsed and hidden | boolean | false | 4.3.0 |
| resizable | Whether resizable | boolean | true | 4.3.0 |

### Semantic DOM

`classNames` and `styles` support the following semantic keys (static object or `(info: { props }) => ...`):

- `root`: Root container element
- `panel`: Panel element
- `dragger`: Dragger element (string / `CSSProperties` or `{ default, active }`)
