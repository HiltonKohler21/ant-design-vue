---
category: Components
type: Data Display
title: Card
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*VXtCTp93KPAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*a-8zR6rrupgAAAAAAAAAAAAADrJ8AQ/original
---

Simple rectangular container.

## When To Use

A card can be used to display content related to a single subject. The content can consist of multiple elements of varying types and sizes.

## API

### Card

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| activeTabKey | Current TabPane's key | string | - |  |
| ~~bodyStyle~~ | Inline style to apply to the card content (deprecated, use `styles.body` instead) | CSSProperties | - |  |
| ~~bordered~~ | Toggles rendering of the border around the card (deprecated, use `variant` instead) | boolean | `true` |  |
| classNames | Semantic DOM class names | { header?: string; body?: string; extra?: string; actions?: string; title?: string; cover?: string } | - | 4.3.0 |
| defaultActiveTabKey | Initial active TabPane's key, if `activeTabKey` is not set | string | - |  |
| extra | Content to render in the top-right corner of the card | string \| slot | - |  |
| ~~headStyle~~ | Inline style to apply to the card head (deprecated, use `styles.header` instead) | CSSProperties | - |  |
| hoverable | Lift up when hovering card | boolean | `false` |  |
| loading | Shows a loading indicator while the contents of the card are being fetched | boolean | `false` |  |
| rootClassName | Root element class name | string | - | 4.3.0 |
| size | Size of card | `default` \| `small` | `default` |  |
| styles | Semantic DOM inline styles | { header?: CSSProperties; body?: CSSProperties; extra?: CSSProperties; actions?: CSSProperties; title?: CSSProperties; cover?: CSSProperties } | - | 4.3.0 |
| tabList | List of TabPane's head; customize tabs with the `customTab` (v3.0) slot | Array&lt;{ key: string; tab: any; disabled?: boolean }&gt; | - |  |
| tabProps | Additional props passed to internal [Tabs](/components/tabs/#api) | TabsProps | - | 4.3.0 |
| title | Card title | string \| slot | - |  |
| type | Card style type, can be set to `inner` or not set | `inner` | - |  |
| variant | Variant style of card | `outlined` \| `borderless` | `outlined` | 4.3.0 |

### Card Slots

| Slot Name | Description | Type |
| --- | --- | --- |
| actions | The action list, shows at the bottom of the Card | - |
| cover | Card cover | - |
| customTab | Custom tabList tab | { item: tabList[number] } |
| extra | Content to render in the top-right corner of the card | - |
| tabBarExtraContent | Extra content in tab bar | - |
| title | Card title | - |

### Events

| Events Name | Description                   | Arguments             | Version |
| ----------- | ----------------------------- | --------------------- | ------- |
| tabChange   | Callback when tab is switched | (key: string) => void | -       |

### Card.Grid

| Property  | Description                     | Type    | Default | Version |
| --------- | ------------------------------- | ------- | ------- | ------- |
| hoverable | Lift up when hovering card grid | boolean | `true`  |         |

### Card.Meta

| Property    | Description         | Type            | Default | Version |
| ----------- | ------------------- | --------------- | ------- | ------- |
| avatar      | Avatar or icon      | VueNode \| slot | -       |         |
| description | Description content | string \| slot  | -       |         |
| title       | Title content       | string \| slot  | -       |         |
