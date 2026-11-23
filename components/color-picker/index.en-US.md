---
category: Components
type: Data Entry
title: ColorPicker
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*PpY4RYNM8UcAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*EHL-QYJofZsAAAAAAAAAAAAADrJ8AQ/original
tag: 4.3.0
---

Provide color selection input, supporting solid colors, gradients, preset palettes, alpha channels, and multiple color formats.

## When To Use

- When the user needs to select a color, such as theme customization, canvas styling, and tag coloring.
- Supports switching between solid and gradient colors, ideal for design tools and multimedia editing panels.

## API

### ColorPicker

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| value(v-model:value) | The color value (controlled) | string | - | 4.3.0 |
| defaultValue | The default color value | string | `#1677ff` | 4.3.0 |
| open(v-model:open) | Whether the popup is open (controlled) | boolean | - | 4.3.0 |
| allowClear | Allow clearing the selected color | boolean | false | 4.3.0 |
| arrow | Configuration for popup arrow | boolean \| { pointAtCenter: boolean } | false | 4.3.0 |
| defaultFormat | Default color format | `'hex' \| 'rgb' \| 'hsb'` | `'hex'` | 4.3.0 |
| disabled | Whether disabled | boolean | false | 4.3.0 |
| disabledAlpha | Disable alpha channel adjustment | boolean | false | 4.3.0 |
| disabledFormat | Disable format switching | boolean | false | 4.3.0 |
| format | Color format (controlled) | `'hex' \| 'rgb' \| 'hsb'` | - | 4.3.0 |
| formatter | Custom formatter for output color string | `(color: string) => string` | - | 4.3.0 |
| mode | Color mode: single or gradient | `'single' \| 'gradient' \| ('single' \| 'gradient')[]` | `'single'` | 4.3.0 |
| panelRender | Customize panel content layout | `(panel: VNode) => VNode` | - | 4.3.0 |
| placement | The position of the popup | `top` \| `left` \| `right` \| `bottom` \| `topLeft` \| `topRight` \| `bottomLeft` \| `bottomRight` \| `leftTop` \| `leftBottom` \| `rightTop` \| `rightBottom` | `bottomLeft` | 4.3.0 |
| prefix | Trigger prefix content | VNode | - | 4.3.0 |
| presets | Preset color options | `{ label: string; colors: string[] }[]` | - | 4.3.0 |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| showText | Show color text or provide a custom render function | boolean \| `(color: AggregationColor) => VNode \| string` | false | 4.3.0 |
| size | Trigger size | `'large' \| 'middle' \| 'small'` | `'middle'` | 4.3.0 |
| status | Validation status | `'error' \| 'warning'` | - | 4.3.0 |
| trigger | Trigger event of popup | `'click' \| 'hover'` | `'click'` | 4.3.0 |

### Events

| Event Name | Description | Arguments |
| --- | --- | --- |
| change | Callback when color changes in real-time | `(color: string) => void` |
| changeComplete | Callback when color selection completes | `(color: string) => void` |
| clear | Callback when clear button is clicked | `() => void` |
| formatChange | Callback when color format changes | `(format: 'hex' \| 'rgb' \| 'hsb') => void` |
| modeChange | Callback when mode changes | `(mode: 'single' \| 'gradient') => void` |
| openChange | Callback when popup open state changes | `(open: boolean) => void` |

### Slots

| Slot Name | Description            | Arguments |
| --------- | ---------------------- | --------- |
| default   | Custom trigger element | -         |
