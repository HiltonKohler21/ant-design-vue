---
category: Components
type: Other
title: BorderBeam
cols: 2
subtitle: BorderBeam
tag: 4.3.0
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*uae3QbkNCm8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*VcjGQLSrYdcAAAAAAAAAAAAADrJ8AQ/original
---

An animated gradient beam that travels along the border of a container, useful to highlight cards or panels.

## When To Use

- Highlight primary cards (AI results, featured items, ...).
- Add a low-distraction dynamic emphasis.

## API

### BorderBeam

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| color | Beam color (solid color, color array, or gradient stops) | string \| string[] \| { color: string; percent: number }[] | - | 4.3.0 |
| count | Number of beams | number | 1 | 4.3.0 |
| duration | Seconds per full turn | number | 6 | 4.3.0 |
| items | Per-beam configuration, takes precedence over count | BorderBeamItem[] | - | 4.3.0 |
| lineWidth | Border beam thickness | number \| string | `lineWidth` token (1px) | 4.3.0 |
| outset | Outward offset from the host padding box | number \| string | host border width | 4.3.0 |
| size | Beam length (CSS length) | number \| string | `100px` | 4.3.0 |
| rootClassName | Beam element class name | string | - | 4.3.0 |

### BorderBeamItem

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| color | Beam color | string \| string[] \| { color: string; percent: number }[] | - |
| lineWidth | Border thickness | number \| string | - |
| outset | Outward offset | number \| string | - |
| size | Beam length (CSS length) | number \| string | - |
