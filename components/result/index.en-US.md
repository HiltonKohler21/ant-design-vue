---
category: Components
type: Feedback
title: Result
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-e2IRroDJyEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-0kxQrbHx2kAAAAAAAAAAAAADrJ8AQ/original
---

Used to feed back the results of a series of operational tasks.

## When To Use

Use when important operations need to inform the user to process the results and the feedback is more complicated.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| extra | operating area | slot | - |  |
| icon | custom icon | slot | - |  |
| rootClassName | Root class name | string | - | 4.3.0 |
| status | result status, decide icons and colors | `success` \| `error` \| `info` \| `warning` \| `404` \| `403` \| `500` | `'info'` |  |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| subTitle | subTitle string | string \| VNode \| slot | - |  |
| title | title string | string \| VNode \| slot | - |  |

> Supported `SemanticDOM` keys: `root` \| `icon` \| `title` \| `subTitle` \| `extra` \| `body`.
