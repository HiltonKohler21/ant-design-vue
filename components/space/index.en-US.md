---
category: Components
type: Layout
title: Space
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ZiJ3SbOH9SUAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*37T2R6O9oi0AAAAAAAAAAAAADrJ8AQ/original
---

Set components spacing.

## When To Use

- Avoid components clinging together and set a unified space.
- Use `Space.Compact` when child form components are compactly connected and the border is collapsed (After version `ant-design-vue@4.0.0` Supported).
- Use `Space.Addon` inside `Space.Compact` to create custom prefix/suffix cells with `variant`, `status`, `size`, and `disabled` styling (Supported since `4.3.0`).

## API

### Space

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | Align items | `start` \| `end` \| `center` \| `baseline` \| `stretch` | - | 1.6.5 \| stretch: 4.3.0 |
| classNames | Semantic DOM class, supports static object or function | `{ root?: string; item?: string; separator?: string }` \| `(info: { props: SpaceProps }) => ...` | - | 4.3.0 |
| direction | (Deprecated, please use `orientation`) The space direction | `vertical` \| `horizontal` | `horizontal` | 1.6.5 |
| orientation | The space orientation, takes precedence over `vertical` and `direction` | `vertical` \| `horizontal` | `horizontal` | 4.3.0 |
| rootClassName | The class name of the root element | string | - | 4.3.0 |
| separator | Set separator between items (replaces `split`) | VueNode \| v-slot | - | 4.3.0 |
| size | The space size | `small` \| `middle` \| `large` \| `number` \| `[Size, Size]` | `small` | 1.6.5 |
| split | (Deprecated, please use `separator`) Set split | VueNode \| v-slot | - | 2.2.0 |
| styles | Semantic DOM style, supports static object or function | `{ root?: CSSProperties; item?: CSSProperties; separator?: CSSProperties }` \| `(info: { props: SpaceProps }) => ...` | - | 4.3.0 |
| vertical | Shorthand for vertical direction (overridden by `orientation`) | boolean | false | 4.3.0 |
| wrap | Auto wrap line, when `horizontal` effective | boolean | false | 2.2.0 |

### Space.Compact

Use `Space.Compact` when child form components are compactly connected and the border is collapsed. The supported components are:

- Button
- AutoComplete
- Cascader
- DatePicker
- Input / Input.Search
- InputNumber
- Select
- Space.Addon
- TimePicker
- TreeSelect

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | Align items | `start` \| `end` \| `center` \| `baseline` | - | 4.3.0 |
| block | Option to fit width to its parent's width | boolean | false | 4.0.0 |
| direction | (Deprecated, please use `orientation`) Set direction of layout | `vertical` \| `horizontal` | `horizontal` | 4.0.0 |
| orientation | Set orientation of layout | `vertical` \| `horizontal` | `horizontal` | 4.3.0 |
| size | Set child component size | `large` \| `middle` \| `small` | `middle` | 4.0.0 |
| vertical | Shorthand for vertical direction (overridden by `orientation`) | boolean | false | 4.3.0 |

### Space.Addon

> Available since `4.3.0`.

Used to create styled addon cells inside `Space.Compact`.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| disabled | Whether the addon is disabled | boolean | false | 4.3.0 |
| size | Size of the addon (inherits from `Space.Compact` when omitted) | `large` \| `middle` \| `small` | - | 4.3.0 |
| status | Validation status | `error` \| `warning` | - | 4.3.0 |
| variant | Visual variant matching form controls | `outlined` \| `filled` \| `borderless` \| `underlined` | `outlined` | 4.3.0 |

### Semantic DOM

`classNames` and `styles` support the following semantic slots (static object or `(info: { props }) => ...` function):

- `root`: Root container element
- `item`: Wrapper element for each child item
- `separator`: Separator element between items
