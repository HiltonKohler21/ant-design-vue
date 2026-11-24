---
category: Components
type: Data Entry
title: Radio
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*mrPVRope68wAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*xPfTSphsiA0AAAAAAAAAAAAADrJ8AQ/original
---

Radio.

## When To Use

- Used to select a single state from multiple options.
- The difference from Select is that Radio is visible to the user and can facilitate the comparison of choice, which means there shouldn't be too many of them.

## API

### Radio/Radio.Button

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autofocus | get focus when component mounted | boolean | false |  |
| checked(v-model) | Specifies whether the radio is selected. | boolean | false |  |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| defaultChecked | Specifies the initial checked state | boolean | false | 4.3.0 |
| disabled | Disable radio | boolean | false |  |
| id | The `id` property of Radio | string | - |  |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| value | According to value for comparison, to determine whether the selected | any | - |  |

### RadioGroup

Radio group can wrap a group of `Radio`.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| block | Option to fit RadioGroup width to its parent width | boolean | false | 4.3.0 |
| buttonStyle | style type of radio button | `outline` \| `solid` | `outline` |  |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<GroupSemanticDOM, string> \| (info: { props }) => Record<GroupSemanticDOM, string>` | - | 4.3.0 |
| defaultValue | Default selected value | any | - | 4.3.0 |
| disabled | Disable all radio buttons | boolean | false |  |
| id | The `id` property of RadioGroup | string | - |  |
| name | The `name` property of all `input[type="radio"]` children | string | - |  |
| options | set children optional | string\[] \| number\[] \| Array&lt;{ label: string, value: string, disabled?: boolean, className?: string, style?: CSSProperties, title?: string }> | - |  |
| optionType | Set Radio optionType | `default` \| `button` | `default` | 3.0.0 |
| orientation | Orientation of RadioGroup | `'horizontal'` \| `'vertical'` | `'horizontal'` | 4.3.0 |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| size | size for radio button style | `large` \| `default` \| `small` | `default` |  |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<GroupSemanticDOM, CSSProperties> \| (info: { props }) => Record<GroupSemanticDOM, CSSProperties>` | - | 4.3.0 |
| value(v-model) | Used for setting the currently selected value. | any | - |  |
| vertical | If true, RadioGroup will be vertical | boolean | false | 4.3.0 |

### RadioGroup Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| change | The callback function that is triggered when the state changes. | Function(e:Event) |

## Methods

### Radio

| Name    | Description  |
| ------- | ------------ |
| blur()  | remove focus |
| focus() | get focus    |

## Semantic DOM

- **Radio**: `root` (wrapper element), `icon` (radio dot icon element), `label` (label text element).
- **Radio.Group**: `root` (group wrapper), `item` (option wrapper), `itemIcon` (option radio icon), `itemLabel` (option label text).
