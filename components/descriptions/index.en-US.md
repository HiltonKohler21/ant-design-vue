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
| classNames | Customize class for each semantic structure inside the component. Supports object or function | Record<SemanticDOM, string> \| (info: { props: DescriptionsProps }) => Record<SemanticDOM, string> | - | 4.3.0 |
| colon | Change default props `colon` value of `Descriptions.Item` | boolean | true |  |
| column | The number of `DescriptionItems` in a row, could be a number or an object like `{ xs: 8, sm: 16, md: 24}` | number \| object | 3 |  |
| ~~contentStyle~~ | Customize content style (deprecated, please use `styles.content` instead) | CSSProperties | - | 2.2.0 |
| extra | The action area of the description list, placed at the top-right | string \| VNode \| slot | - | 2.0.0 |
| items | Describe the contents of the list item | [DescriptionsItemType\[\]](#descriptionsitemtype) | - | 4.3.0 |
| ~~labelStyle~~ | Customize label style (deprecated, please use `styles.label` instead) | CSSProperties | - | 2.2.0 |
| layout | Define description layout | `horizontal` \| `vertical` | `horizontal` |  |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| size | Set the size of the list. Can be set to `large`, `medium`, `middle`, `small`, or `default` | `large` \| `medium` \| `default` \| `middle` \| `small` | `default` | `large`/`medium`: 4.3.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | Record<SemanticDOM, CSSProperties> \| (info: { props: DescriptionsProps }) => Record<SemanticDOM, CSSProperties> | - | 4.3.0 |
| title | The title of the description list, placed at the top | string \| VNode \| slot | - |  |

> Supported `SemanticDOM` slots: `root` \| `header` \| `title` \| `extra` \| `label` \| `content`.

### DescriptionsItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| children | Description item content | string \| VNode | - | 4.3.0 |
| class | Additional css class of the item cell | string | - | 4.3.0 |
| classNames | Customize class for item label and content | `{ label?: string; content?: string }` | - | 4.3.0 |
| ~~contentStyle~~ | Customize content style (deprecated, please use `styles.content` instead) | CSSProperties | - | 4.3.0 |
| key | Unique key of the item | string \| number | - | 4.3.0 |
| label | Description of the content | string \| VNode | - | 4.3.0 |
| ~~labelStyle~~ | Customize label style (deprecated, please use `styles.label` instead) | CSSProperties | - | 4.3.0 |
| span | The number of columns included; supports `'filled'` or responsive object `{ xs, sm, md, lg, xl, xxl }` | number \| `'filled'` \| `{ xs?: number; sm?: number; md?: number; lg?: number; xl?: number; xxl?: number }` | 1 | 4.3.0 |
| style | Inline style of the item cell | CSSProperties | - | 4.3.0 |
| styles | Customize inline style for item label and content | `{ label?: CSSProperties; content?: CSSProperties }` | - | 4.3.0 |

### Item props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for item label and content | `{ label?: string; content?: string }` | - | 4.3.0 |
| ~~contentStyle~~ | Customize content style (deprecated, please use `styles.content` instead) | CSSProperties | - | 2.2.0 |
| label | Description of the content | string \| VNode \| slot | - |  |
| ~~labelStyle~~ | Customize label style (deprecated, please use `styles.label` instead) | CSSProperties | - | 2.2.0 |
| span | The number of columns included | number \| `'filled'` \| object | 1 |  |
| styles | Customize inline style for item label and content | `{ label?: CSSProperties; content?: CSSProperties }` | - | 4.3.0 |

> The number of span Descriptions.Item. span={2} takes up the width of two DescriptionsItems.
