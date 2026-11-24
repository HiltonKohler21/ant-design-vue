---
category: Components
type: Navigation
cols: 1
title: Anchor
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ufP1TLS5VvIAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*_9_eTrgvHNQAAAAAAAAAAAAADrJ8AQ/original
---

Hyperlinks to scroll on one page.

## When To Use

For displaying anchor hyperlinks on page and jumping between them.

## API

### Anchor Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| affix | Fixed mode of Anchor | boolean \| Omit<AffixProps, 'offsetTop' \| 'target' \| 'children'> | true | object: 4.3.0 |
| bounds | Bounding distance of anchor area | number | 5(px) |  |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<SemanticDOM, string> \| (info: { props: AnchorProps }) => Record<SemanticDOM, string> | - | 4.3.0 |
| customTitle | Custom option title by slot | v-slot="AnchorItem" | - | 4.0 |
| direction | Set Anchor direction | `vertical` \| `horizontal` | `vertical` | 4.0 |
| getContainer | Scrolling container | () => HTMLElement | () => window |  |
| getCurrentAnchor | Customize the anchor highlight | (activeLink: string) => string | - | activeLink(3.3) |
| items | Data configuration option content, support nesting through children | { key, href, title, target, children, replace, targetOffset }\[] [see](#anchoritem) | - | 4.0 |
| offsetBottom | Pixels to offset from bottom when calculating position of scroll | number | - |  |
| offsetTop | Pixels to offset from top when calculating position of scroll | number | 0 |  |
| replace | Replace items' href in browser history instead of pushing it | boolean | false | 4.3.0 |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| showInkInFixed | Whether show ink-square when `:affix="false"` | boolean | false |  |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<SemanticDOM, CSSProperties> \| (info: { props: AnchorProps }) => Record<SemanticDOM, CSSProperties> | - | 4.3.0 |
| targetOffset | Anchor scroll offset, default as `offsetTop`, [example](#components-anchor-demo-targetoffset) | number | `offsetTop` | 1.5.0 |
| wrapperClass | The class name of the container | string | - |  |
| wrapperStyle | The style of the container | object | - |  |

> `SemanticDOM` slots: `root` \| `item` \| `itemTitle` \| `indicator`.

### AnchorItem

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| key | The unique identifier of the Anchor Link | string \| number | - |  |
| href | The target of hyperlink | string |  |  |
| target | Specifies where to display the linked URL | string |  |  |
| title | The content of hyperlink | VueNode \| (item: AnchorItem) => VueNode |  |  |
| children | Nested Anchor Link, `Attention: This attribute does not support horizontal orientation` | [AnchorItem](#anchoritem)\[] | - |  |
| replace | Replace item href in browser history instead of pushing it | boolean | false | 4.3.0 |
| targetOffset | Customize scroll offset for this anchor link. It takes precedence over the `targetOffset` prop of the Anchor component | number | - | 4.3.0 |

### Events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| change | Listening for anchor link change | (currentActiveLink: string) => void | 1.5.0 |
| click | set the handler to handle `click` event | Function(e: MouseEvent, link: Object) |  |

### Link Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| href | target of hyperlink | string | - |  |
| replace | Replace item href in browser history instead of pushing it | boolean | false | 4.3.0 |
| target | Specifies where to display the linked URL | string | - | 1.5.0 |
| targetOffset | Customize scroll offset for this anchor link. It takes precedence over the `targetOffset` prop of the Anchor component | number | - | 4.3.0 |
| title | content of hyperlink | string \| slot | - |  |
