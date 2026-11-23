---
category: Components
type: Data Display
title: Descriptions
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*fHdlTpif6XQAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*d27AQJrowGAAAAAAAAAAAAAADrJ8AQ/original
---

Display multiple read-only fields in groups.

## When To Use

Commonly displayed on the details page.

## API

### Descriptions props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| bordered | Whether to display the border | boolean | false |  |
| classNames | Customize class for each semantic structure inside the component | `{ root?: string; header?: string; title?: string; extra?: string; label?: string; content?: string }` | - | 4.3.0 |
| colon | Change default props `colon` value of `Descriptions.Item` | boolean | true |  |
| column | The number of `DescriptionItems` in a row, could be a number or an object like `{ xs: 8, sm: 16, md: 24}` | number \| object | 3 |  |
| ~~contentStyle~~ | Customize content style (deprecated, please use `styles.content` instead) | CSSProperties | - | 2.2.0 |
| extra | The action area of the description list, placed at the top-right | string \| VNode \| slot | - | 2.0.0 |
| ~~labelStyle~~ | Customize label style (deprecated, please use `styles.label` instead) | CSSProperties | - | 2.2.0 |
| layout | Define description layout | `horizontal` \| `vertical` | `horizontal` |  |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| size | Set the size of the list. Can be set to `middle`, `small`, or not filled (only takes effect when `bordered={true}`) | `default` \| `middle` \| `small` | `default` |  |
| styles | Customize inline style for each semantic structure inside the component | `{ root?: CSSProperties; header?: CSSProperties; title?: CSSProperties; extra?: CSSProperties; label?: CSSProperties; content?: CSSProperties }` | - | 4.3.0 |
| title | The title of the description list, placed at the top | string \| VNode \| slot | - |  |

### Item props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for item label and content | `{ label?: string; content?: string }` | - | 4.3.0 |
| ~~contentStyle~~ | Customize content style (deprecated, please use `styles.content` instead) | CSSProperties | - | 2.2.0 |
| label | Description of the content | string \| VNode \| slot | - |  |
| ~~labelStyle~~ | Customize label style (deprecated, please use `styles.label` instead) | CSSProperties | - | 2.2.0 |
| span | The number of columns included | number | 1 |  |
| styles | Customize inline style for item label and content | `{ label?: CSSProperties; content?: CSSProperties }` | - | 4.3.0 |

> The number of span Descriptions.Item. span={2} takes up the width of two DescriptionsItems.
