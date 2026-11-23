---
category: Components
type: Data Display
title: Tooltip
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*3u9eSZO_4c0AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*gwrhTozoTC4AAAAAAAAAAAAADrJ8AQ/original
---

A simple text popup tip.

## When To Use

- The tip is shown on mouse enter, and is hidden on mouse leave. The Tooltip doesn't support complex text or operations.
- To provide an explanation of a 'button/text/operation'. It's often used instead of the html 'title' attribute.

## API

| Property | Description                   | Type         | Default |
| -------- | ----------------------------- | ------------ | ------- |
| title    | The text shown in the tooltip | string\|slot | -       |

### Common API

The following APIs are shared by Tooltip, Popconfirm, Popover.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | this value will be merged into placement's config, please refer to the settings [dom-align](https://github.com/yiminghe/dom-align) | Object | - |  |
| arrowPointAtCenter | Whether the arrow is pointed at the center of target | boolean | `false` |  |
| arrow | Change arrow's visible state and change whether the arrow is pointed at the center of target. | boolean \| { pointAtCenter: boolean } | `true` | 4.2.0 |
| autoAdjustOverflow | Whether to adjust popup placement automatically when popup is off screen | boolean | `true` |  |
| classNames | Semantic DOM class | `{ root?: string; body?: string }` | - | 4.3.0 |
| color | The background color | string | - |  |
| defaultOpen | Whether the floating tooltip card is open by default | boolean | `false` | 4.3.0 |
| destroyOnHidden | Whether to destroy tooltip on hide | boolean | false | 4.3.0 |
| destroyTooltipOnHide | Whether to destroy tooltip on hide (deprecated, please use `destroyOnHidden`) | boolean | false |  |
| getPopupContainer | The DOM container of the tip, the default behavior is to create a `div` element in `body`. | (triggerNode: HTMLElement) => HTMLElement | () => document.body |  |
| mouseEnterDelay | Delay in seconds, before tooltip is shown on mouse enter | number | 0.1 |  |
| mouseLeaveDelay | Delay in seconds, before tooltip is hidden on mouse leave | number | 0.1 |  |
| open(v-model) | Whether the floating tooltip card is open or not, Use `visible` under 4.0.0 | boolean | `false` | 4.0.0 |
| overlayClassName | Class name of the tooltip card | string | - |  |
| overlayStyle | Style of the tooltip card | object | - |  |
| overlayInnerStyle | Style of the tooltip inner content | object | - | 4.0.0 |
| placement | The position of the tooltip relative to the target, which can be one of `top` `left` `right` `bottom` `topLeft` `topRight` `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom` | string | `top` |  |
| rootClassName | The class name of the root element | string | - | 4.3.0 |
| styles | Semantic DOM style | `{ root?: CSSProperties; body?: CSSProperties }` | - | 4.3.0 |
| trigger | Tooltip trigger mode | `hover` \| `focus` \| `click` \| `contextmenu` | `hover` |  |

### Events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| afterOpenChange | Callback executed when visibility of the tooltip card is changed (after transition) | (open: boolean) => void | 4.3.0 |
| openChange | Callback executed when visibility of the tooltip card is changed | (open: boolean) => void | 4.0 |

## Note

Please ensure that the child node of `Tooltip` accepts `mouseenter`, `mouseleave`, `focus`, `click` events.
