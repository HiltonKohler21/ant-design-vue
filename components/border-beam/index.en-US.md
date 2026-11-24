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

Decorative component that renders a moving beam along a container border.

## When To Use

- Use when a container needs stronger visual emphasis without introducing business state semantics.
- Suitable for login panels, recommendation cards, AI modules, and key CTA blocks.
- As a decorative effect, it should not replace focus rings, validation borders, or status feedback.

## API

### BorderBeam

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| color | Beam color configuration. Supports a single color string, color array, or gradient stops. `percent` uses the `0 ~ 100` input range and BorderBeam reserves tail space for the transparent fade | `string \| string[] \| { color: string; percent: number }[]` | - | 4.3.0 |
| count | Number of evenly distributed beams. It should be a positive integer | number | 1 | 4.3.0 |
| duration | Time in seconds for the beam to complete one loop | number | 6 | 4.3.0 |
| items | Per-beam configurations. The array length determines the number of beams and takes precedence over `count`. Omitted item properties inherit the top-level `color`, `lineWidth`, `outset`, and `size` | `BorderBeamItem[]` | - | 4.3.0 |
| lineWidth | Width of the beam line. Numbers are treated as pixels | `number \| string` | `lineWidth` token (`1px`) | 4.3.0 |
| outset | Outset distance of the beam layer from the container edge. Set to `0` for clipped containers | `number \| string` | host border width | 4.3.0 |
| rootClassName | Beam element class name | string | - | 4.3.0 |
| size | Size of the visible beam segment. Numbers are treated as pixels | `number \| string` | `100` | 4.3.0 |

### BorderBeamItem

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| color | Color configuration for this beam | `string \| string[] \| { color: string; percent: number }[]` | - | 4.3.0 |
| lineWidth | Line width for this beam. Numbers are treated as pixels | `number \| string` | - | 4.3.0 |
| outset | Outset distance for this beam | `number \| string` | - | 4.3.0 |
| size | Size of this beam's visible segment. Numbers are treated as pixels | `number \| string` | - | 4.3.0 |

## FAQ

### How does BorderBeam behave when reduced motion is enabled?

`BorderBeam` treats the beam as a decorative effect. When `prefers-reduced-motion: reduce` is active or `theme.token.motion` is `false`, the beam effect is hidden.

### What does `percent` mean in `color`?

`percent` represents the authored stop position and accepts values from `0` to `100`. BorderBeam maps those stops into the visible beam segment and reserves the trailing area for transparent fade-out so the moving tail stays visible.

### `size` limits

`BorderBeam` creates the beam with a square gradient layer whose side length is `size`. Keep `size` well below twice the shorter side of the mask overlay: `size < 2 × min(width, height)`.

### How do I keep the beam radius aligned with my container?

`BorderBeam` renders the beam layer as a child of the actual container and directly inherits its radius through `border-radius: inherit`, including non-uniform multi-value radii.
