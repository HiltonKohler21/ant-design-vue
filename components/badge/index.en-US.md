---
category: Components
type: Data Display
title: Badge
subtitle: Badge
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*e0qITYqF394AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*v8EQT7KoGbcAAAAAAAAAAAAADrJ8AQ/original
---

Small numerical value or status descriptor for UI elements.

## When To Use

- Show a small count (e.g. unread messages) at the corner of an icon.
- Show a status dot with optional text.

## API

### Badge

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| color | Customize Badge dot color | string | - | 1.5.0 |
| count | Number to show; shows `${overflowCount}+` when greater, hidden when 0 | number \| string \| slot |  |  |
| dot | Show a red dot instead of a number | boolean | false |  |
| numberStyle | Style of the count | object | '' |  |
| offset | Offset of the badge, `[x, y]` | [number\|string, number\|string] | - |  |
| overflowCount | Max count to show | number | 99 |  |
| showZero | Whether to show badge when count is 0 | boolean | false |  |
| status | Set Badge as a status dot | Enum{ 'success', 'processing', 'default', 'error', 'warning' } | '' |  |
| text | Text beside the status dot (requires `status`) | string | '' |  |
| title | Tooltip text of the status dot | string | `count` |  |

### Badge.Ribbon

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| color | Customize ribbon color | string | - |  |
| placement | Position of the ribbon, `start` and `end` follow text direction | `start` \| `end` | `end` |  |
| text | Content of the ribbon | string \| VNode \| slot | - |  |
