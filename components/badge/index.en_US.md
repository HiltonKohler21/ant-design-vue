---
category: Components
type: Data Display
title: Badge
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*e0qITYqF394AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*v8EQT7KoGbcAAAAAAAAAAAAADrJ8AQ/original
---

Small numerical value or status descriptor for UI elements.

## When To Use

Badge normally appears in proximity to notifications or user avatars with eye-catching appeal, typically displaying unread messages count.

## API

```html
<a-badge :count="5">
  <a href="#" class="head-example" />
</a-badge>
```

```html
<a-badge :count="5" />
```

### Badge

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<'root' \| 'indicator', string> \| (info: { props }) => Record<'root' \| 'indicator', string>` | - | 4.3.0 |
| color | Customize Badge dot color | string | - | 1.5.0 |
| count | Number to show; shows `${overflowCount}+` when greater, hidden when 0 | number \| string \| slot | - |  |
| dot | Show a red dot instead of a number | boolean | false |  |
| numberStyle | Style of the count | object | '' |  |
| offset | Offset of the badge, `[x, y]` | [number \| string, number \| string] | - |  |
| overflowCount | Max count to show | number | 99 |  |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| showZero | Whether to show badge when count is 0 | boolean | false |  |
| size | If `count` is set, `size` sets the size of badge | `'default'` \| `'small'` | `'default'` |  |
| status | Set Badge as a status dot | Enum{ 'success', 'processing', 'default', 'error', 'warning' } | '' |  |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<'root' \| 'indicator', CSSProperties> \| (info: { props }) => Record<'root' \| 'indicator', CSSProperties>` | - | 4.3.0 |
| text | Text beside the status dot (requires `status`) | string | '' |  |
| title | Text to show when hovering over the badge. Set to `null` or `false` to remove the native tooltip | `string \| null \| false` | `count` | 4.3.0 |

### Badge.Ribbon (2.0.1+)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<'root' \| 'content' \| 'indicator', string> \| (info: { props }) => Record<'root' \| 'content' \| 'indicator', string>` | - | 4.3.0 |
| color | Customize ribbon color | string | - |  |
| placement | Position of the ribbon, `start` and `end` follow text direction | `start` \| `end` | `end` |  |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<'root' \| 'content' \| 'indicator', CSSProperties> \| (info: { props }) => Record<'root' \| 'content' \| 'indicator', CSSProperties>` | - | 4.3.0 |
| text | Content of the ribbon | string \| VNode \| slot | - |  |
