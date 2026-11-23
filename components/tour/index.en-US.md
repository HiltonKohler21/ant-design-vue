---
category: Components
type: Data Display
title: Tour
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*8CC_Tbe3_e4AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*nF6hQpM0XtEAAAAAAAAAAAAADrJ8AQ/original
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
| placement | Position of the guide card relative to the target element | `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | `bottom` |  |
| mask | Whether to enable masking, change mask style and fill color by pass custom props | `boolean` \| `{ style?: CSSProperties; color?: string; }` | `true` |  |
| type | Type, affects the background color and text color | `default` \| `primary` | `default` |  |
| open | Open tour | `boolean` | - |  |
| current(v-model) | What is the current step | `number` | - |  |
| keyboard | Whether to enable keyboard shortcuts (`ArrowLeft` / `ArrowRight` / `Escape`) | `boolean` | `true` | 4.3.0 |
| rootClassName | The class name of the root element | `string` | - | 4.3.0 |
| scrollIntoViewOptions | support pass custom scrollIntoView options | `boolean` \| `ScrollIntoViewOptions` | `true` |  |
| indicatorsRender | custom indicator | `(current: number, total: number) => VueNode` \| `v-slot:indicatorsRender="{current, total}"` | - | 4.3.0 |
| zIndex | Tour's zIndex | `number` | `1001` |  |

### Tour events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| close | Callback function on shutdown | `Function` |  |
| finish | Callback function on finished | `Function` |  |
| change | Callback when the step changes. Current is the current step | `(current: number) => void` |  |

### TourStep

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actionsRender | Customize action buttons rendering, overrides `actionsRender` on Tour | `(originNode: VueNode, info: { current: number; total: number }) => VueNode` | - | 4.3.0 |
| target | Get the element the guide card points to. Empty makes it show in center of screen | `() => HTMLElement` \| `HTMLElement` | - |  |
| arrow | Whether to show the arrow, including the configuration whether to point to the center of the element | `boolean` \| `{ pointAtCenter: boolean }` | `true` |  |
| cover | Displayed pictures or videos | `VueNode` | - |  |
| title | title | `VueNode` | - |  |
| description | description | `VueNode` | - |  |
| placement | Position of the guide card relative to the target element | `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | `bottom` |  |
| mask | Whether to enable masking, change mask style and fill color by pass custom props, the default follows the `mask` property of Tour | `boolean` \| `{ style?: CSSProperties; color?: string; }` | `true` |  |
| type | Type, affects the background color and text color | `default` \| `primary` | `default` |  |
| nextButtonProps | Properties of the Next button | `{ children: VueNode; onClick: Function }` | - |  |
| prevButtonProps | Properties of the previous button | `{ children: VueNode; onClick: Function }` | - |  |
| scrollIntoViewOptions | support pass custom scrollIntoView options, the default follows the `scrollIntoViewOptions` property of Tour | `boolean` \| `ScrollIntoViewOptions` | `true` |  |

### TourStep events

| Events Name | Description                   | Arguments  | Version |
| ----------- | ----------------------------- | ---------- | ------- |
| close       | Callback function on shutdown | `Function` |         |
