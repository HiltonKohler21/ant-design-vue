---
category: Components
type: Layout
title: Divider
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*7sMiTbzvaDoAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*KPSEQ74PLg4AAAAAAAAAAAAADrJ8AQ/original
---

A divider line separates different content.

## When To Use

- Divide sections of article.
- Divide inline text and links such as the operation column of table.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<'root' \| 'rail' \| 'content', string> \| (info: { props }) => Record<'root' \| 'rail' \| 'content', string>` | - | 4.3.0 |
| dashed | Whether line is dashed (prefer `variant="dashed"`) | boolean | `false` |  |
| orientation | Direction of divider (`horizontal` \| `vertical`); also backwards-compatible with legacy title placement (`left` \| `right` \| `center` \| `start` \| `end`, prefer `titlePlacement`) | `'horizontal' \| 'vertical' \| 'left' \| 'right' \| 'center' \| 'start' \| 'end'` | `'horizontal'` | 4.3.0 |
| ~~orientationMargin~~ | The margin-left/right between the title and its closest border (prefer `styles.content`) | string \| number | - | 3.0 |
| plain | Divider text show as plain style | boolean | `false` | 2.2.0 |
| rootClassName | Root element class name | string | - | 4.3.0 |
| size | The size of divider spacing, only valid for horizontal divider | `'small' \| 'middle' \| 'medium' \| 'large'` | `'large'` | 4.3.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<'root' \| 'rail' \| 'content', CSSProperties> \| (info: { props }) => Record<'root' \| 'rail' \| 'content', CSSProperties>` | - | 4.3.0 |
| titlePlacement | Position of title inside divider | `'left' \| 'right' \| 'center' \| 'start' \| 'end'` | `'center'` | 4.3.0 |
| ~~type~~ | Direction type of divider, please use `orientation` or `vertical` instead | `'horizontal' \| 'vertical'` | `'horizontal'` |  |
| variant | Whether line is dashed, dotted or solid | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | 4.3.0 |
| vertical | Shorthand for vertical divider; `orientation` takes precedence when both are set | boolean | `false` | 4.3.0 |
