---
category: Components
type: Data Entry
title: Slider
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*_4heQaUrFn4AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*XkgXTaudeosAAAAAAAAAAAAADrJ8AQ/original
---

A Slider component for displaying current value and intervals in range.

## When To Use

To input a value in a range.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoAdjustOverflow | Whether to adjust popup placement automatically when popup is off screen | boolean | true |  |
| autofocus | get focus when component mounted | boolean | false |  |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| defaultValue | The default value of slider. When `range` is `false`, use `number`, otherwise, use `number[]` | number \| number\[] | 0 \| \[0, 0] |  |
| disabled | If true, the slider will not be interactive. Can also be a boolean array to disable specific handles in range mode | boolean \| boolean\[] | false | boolean\[]: 4.3.0 |
| dots | Whether the thumb can drag over tick only. | boolean | false |  |
| formatter | Slider will pass its value to `formatter`, and display its value in Tooltip, and hide Tooltip when return value is null (replaces `tipFormatter`) | (value?: number) => VueNode \| null | IDENTITY | 4.3.0 |
| handleRender | Custom handle render | (node: VNode, info: { index: number; value: number; dragging: boolean }) => VNode | - | 4.3.0 |
| handleStyle | The style of slider handle (Deprecated, please use `styles.handle` instead) | CSSProperties \| CSSProperties\[] | - |  |
| included | Make effect when `marks` not null, `true` means containment and `false` means coordinative | boolean | true |  |
| keyboard | Support using keyboard to move handlers | boolean | true |  |
| mark | Custom tick mark of Slider, | v-slot:mark | { point: number, label: any } | 3.0 |
| marks | Tick mark of Slider, type of key must be `number`, and must in closed interval \[min, max], each mark can declare its own style. | object | { number: string\|VNode } or { number: { style: object, label: string\|VNode } } or { number: () => VNode } |  |
| max | The maximum value the slider can slide to | number | 100 |  |
| min | The minimum value the slider can slide to. | number | 0 |  |
| orientation | Slider orientation (takes precedence over `vertical`) | `'horizontal'` \| `'vertical'` | `'horizontal'` | 4.3.0 |
| range | Dual/multiple thumb mode | boolean \| [range](#range) | false |  |
| reverse | reverse the component | boolean | false | 1.5.0 |
| rootClassName | Root class name | string | - | 4.3.0 |
| step | The granularity the slider can step through values. Must greater than 0, and be divided by (max - min) . When `marks` no null, `step` can be `null`. | number\|null | 1 |  |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| tooltip | The tooltip related props | [tooltip](#tooltip) | - | 4.3.0 |
| trackStyle | The style of slider track (Deprecated, please use `styles.track` instead) | CSSProperties \| CSSProperties\[] | - |  |
| value(v-model) | The value of slider. When `range` is `false`, use `number`, otherwise, use `number[]` | number\|number\[] | - |  |
| vertical | If true, the slider will be vertical. | Boolean | false |  |
| tipFormatter | Slider will pass its value to `tipFormatter`, and display its value in Tooltip, and hide Tooltip when return value is null (Deprecated, please use `formatter` instead). | Function\|null | IDENTITY |  |
| tooltipPlacement | Set Tooltip display position. Ref [`Tooltip`](/components/tooltip/). | string | - | 1.5.0 |
| tooltipOpen | If true, Tooltip will show always, or it will not show anyway, even if dragging or hovering. | Boolean | - | 4.0 |
| getTooltipPopupContainer | The DOM container of the Tooltip, the default behavior is to create a div element in body. | Function | () => document.body | 1.5.0 |

### range

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| draggableTrack | Whether range track can be dragged | boolean | false |  |
| editable | Dynamic edit nodes. Cannot be used with `draggableTrack` | boolean | false | 4.3.0 |
| minCount | The minimum count of nodes when `editable` is enabled | number | 0 | 4.3.0 |
| maxCount | The maximum count of nodes when `editable` is enabled | number | - | 4.3.0 |

### tooltip

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoAdjustOverflow | Whether to adjust popup placement automatically when popup is off screen | boolean | true | 4.3.0 |
| formatter | Slider will pass its value to `formatter`, and display its value in Tooltip, and hide Tooltip when return value is null | ((value?: number) => VueNode) \| null | IDENTITY | 4.3.0 |
| getPopupContainer | The DOM container of the Tooltip, the default behavior is to create a div element in body | (triggerNode: HTMLElement) => HTMLElement | () => document.body | 4.3.0 |
| open | If true, Tooltip will show always, or it will not show anyway, even if dragging or hovering | boolean | - | 4.3.0 |
| placement | Set Tooltip display position. Ref [`Tooltip`](/components/tooltip/) | string | - | 4.3.0 |
| prefixCls | Custom Tooltip prefixCls | string | - | 4.3.0 |

### events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| change | Callback function that is fired when the user changes the slider's value. | Function(value) |  |
| changeComplete | Fire when `mouseup` is fired. | Function(value) | 4.3.0 |
| afterChange | Fire when `mouseup` is fired (Deprecated, please use `changeComplete` instead). | Function(value) |  |

## Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | remove focus |
| focus() | get focus    |

## Semantic DOM

Supported slots: `root` (slider root), `rail` (background rail), `tracks` (range tracks container), `track` (selected track), `handle` (slider thumb handle).
