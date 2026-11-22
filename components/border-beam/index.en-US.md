---
category: Components
type: Other
title: BorderBeam
subtitle: BorderBeam
---

An animated gradient beam that travels along the border of a container, useful to highlight cards or panels.

## When To Use

- Highlight primary cards (AI results, featured items, ...).
- Add a low-distraction dynamic emphasis.

## API

### BorderBeam

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| color | Beam color (solid or gradient stops) | string \| { color, percent }[] | - | 4.3.0 |
| count | Number of beams | number | 1 | 4.3.0 |
| duration | Seconds per full turn | number | 6 | 4.3.0 |
| items | Per-beam configuration, takes precedence over count | BorderBeamItem[] | - | 4.3.0 |
| lineWidth | Border thickness | number \| string | 1 | 4.3.0 |
| outset | Beam offset outside the border | number \| string | lineWidth | 4.3.0 |
| size | Beam length (percentage of gradient angle) | number \| string | - | 4.3.0 |
| rootClassName | Root class name | string | - | 4.3.0 |

### BorderBeamItem

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| color | Beam color | string \| { color, percent }[] | - |
| lineWidth | Border thickness | number \| string | - |
| outset | Offset | number \| string | - |
| size | Beam length | number \| string | - |
