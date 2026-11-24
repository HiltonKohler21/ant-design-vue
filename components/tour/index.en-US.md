---
category: Components
type: Data Display
title: Tour
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*NMvqRZpuJfQAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*D70qQJJmzhgAAAAAAAAAAAAADrJ8AQ/original
---

A popup component for guiding users through a product. Available since `4.0.0`.

## When To Use

Use when you want to guide users through a product.

## API

### Tour

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actionsRender | Customize action buttons rendering | `(originNode: VueNode, info: { current: number; total: number }) => VueNode` | - | 4.3.0 |
| arrow | Whether to show the arrow, including the configuration whether to point to the center of the element | `boolean` \| `{ pointAtCenter: boolean }` | `true` |  |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, string> \| (info: { props: TourProps }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| closeIcon | Customize close icon | `VueNode \| boolean` | `true` | 4.3.0 |
| current(v-model) | What is the current step | `number` | - |  |
| disabledInteraction | Disable interaction on highlighted area | `boolean` | `false` | 4.3.0 |
| gap | Control the radius of the highlighted area and the offset between highlighted area and the element | `{ offset?: number \| [number, number]; radius?: number }` | `{ offset: 6, radius: 2 }` | array `offset`: 4.3.0 |
| getPopupContainer | Set the rendering node of Tour floating layer | `(node: HTMLElement) => HTMLElement` | `() => document.body` | 4.3.0 |
| indicatorsRender | Custom indicator | `(current: number, total: number) => VueNode` \| `v-slot:indicatorsRender="{current, total}"` | - | 4.3.0 |
| keyboard | Whether to enable keyboard shortcuts (`ArrowLeft` / `ArrowRight` / `Escape`) | `boolean` | `true` | 4.3.0 |
| mask | Whether to enable masking, change mask style and fill color by pass custom props | `boolean` \| `{ style?: CSSProperties; color?: string; }` | `true` |  |
| open | Open tour | `boolean` | - |  |
| placement | Position of the guide card relative to the target element | `center` `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | `bottom` |  |
| rootClassName | The class name of the root element | `string` | - | 4.3.0 |
| scrollIntoViewOptions | Support pass custom scrollIntoView options | `boolean` \| `ScrollIntoViewOptions` | `true` |  |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, CSSProperties> \| (info: { props: TourProps }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| type | Type, affects the background color and text color | `default` \| `primary` | `default` |  |
| zIndex | Tour's zIndex | `number` | `1001` |  |

> Supported `SemanticDOM` keys: `root` \| `mask` \| `section` \| `cover` \| `close` \| `header` \| `title` \| `description` \| `footer` \| `actions` \| `indicators` \| `indicator`.

### Tour events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| close | Callback function on shutdown | `(current: number) => void` |  |
| finish | Callback function on finished | `() => void` |  |
| change | Callback when the step changes. Current is the current step | `(current: number) => void` |  |

### TourStep

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actionsRender | Customize action buttons rendering, overrides `actionsRender` on Tour | `(originNode: VueNode, info: { current: number; total: number }) => VueNode` | - | 4.3.0 |
| arrow | Whether to show the arrow, including the configuration whether to point to the center of the element | `boolean` \| `{ pointAtCenter: boolean }` | `true` |  |
| closeIcon | Customize close icon | `VueNode \| boolean` | `true` | 4.3.0 |
| cover | Displayed pictures or videos | `VueNode` | - |  |
| description | Description | `VueNode` | - |  |
| mask | Whether to enable masking, change mask style and fill color by pass custom props, the default follows the `mask` property of Tour | `boolean` \| `{ style?: CSSProperties; color?: string; }` | `true` |  |
| nextButtonProps | Properties of the Next button | `{ children: VueNode; onClick: Function; className?: string; style?: CSSProperties }` | - |  |
| placement | Position of the guide card relative to the target element | `center` `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | `bottom` |  |
| prevButtonProps | Properties of the previous button | `{ children: VueNode; onClick: Function; className?: string; style?: CSSProperties }` | - |  |
| scrollIntoViewOptions | Support pass custom scrollIntoView options, the default follows the `scrollIntoViewOptions` property of Tour | `boolean` \| `ScrollIntoViewOptions` | `true` |  |
| target | Get the element the guide card points to. Empty makes it show in center of screen | `() => HTMLElement` \| `HTMLElement` | - |  |
| title | Title | `VueNode` | - |  |
| type | Type, affects the background color and text color | `default` \| `primary` | `default` |  |

### TourStep events

| Events Name | Description                   | Arguments  | Version |
| ----------- | ----------------------------- | ---------- | ------- |
| close       | Callback function on shutdown | `Function` |         |
