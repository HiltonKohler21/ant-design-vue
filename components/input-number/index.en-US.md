---
category: Components
type: Data Entry
title: InputNumber
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*JvWbSYhuNlIAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*1uH-R5kLAMIAAAAAAAAAAAAADrJ8AQ/original
---

Enter a number within certain range with the mouse or keyboard.

## When To Use

When a numeric value needs to be provided.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| ~~addonAfter~~ | The label text displayed after (on the right side of) the input field (use `Space.Compact` instead) | slot | - | 3.0 |
| ~~addonBefore~~ | The label text displayed before (on the left side of) the input field (use `Space.Compact` instead) | slot | - | 3.0 |
| allowClear | Whether to show a clear button (cleared value: `null`) | boolean \| [AllowClearConfig](#allowclearconfig) | `false` | 4.3.0 |
| autofocus | Get focus when component mounted | boolean | `false` |  |
| ~~bordered~~ | Whether has border style (deprecated, use `variant` instead) | boolean | `true` | 3.0 |
| changeOnBlur | Trigger `change` when blur (e.g. reset value in range by blur) | boolean | `true` | 4.3.0 |
| changeOnWheel | Allows to change value by wheel | boolean | `false` | 4.3.0 |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | `{ root?: string; prefix?: string; suffix?: string; input?: string; actions?: string; action?: string; clear?: string } \| ((info: { props: InputNumberProps }) => ...)` | - | 4.3.0 |
| controls | Whether to show `+-` controls, or set custom arrow icons | boolean \| { upIcon?: VueNode; downIcon?: VueNode } | `true` | 3.0 / object: 4.3.0 |
| decimalSeparator | Decimal separator | string | - |  |
| defaultValue | Initial value | number | - |  |
| disabled | Disable the input | boolean | `false` |  |
| downIcon | Custom down icon | slot | `<DownOutlined />` | 3.3.0 |
| formatter | Specifies the format of the value presented | function(value: number \| string, info: { userTyping: boolean, input: string }): string | - | info: 3.0 |
| keyboard | If enable keyboard behavior | boolean | `true` | 3.0 |
| max | Max value | number | Infinity |  |
| min | Min value | number | -Infinity |  |
| mode | Show input or spinner | `'input'` \| `'spinner'` | `'input'` | 4.3.0 |
| parser | Specifies the value extracted from formatter | function(string): number | - |  |
| placeholder | Placeholder of input | string | - |  |
| precision | Precision of input value | number | - |  |
| prefix | The prefix icon for the Input | string \| slot | - | 3.0 |
| readonly | If the input is readonly | boolean | `false` |  |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| size | Height of input box | `'large'` \| `'middle'` \| `'small'` | - |  |
| status | Set validation status | `'error'` \| `'warning'` | - | 3.3.0 |
| step | The number to which the current value is increased or decreased. It can be an integer or decimal. | number \| string | 1 |  |
| stringMode | Set value as string to support high precision decimals. Will return string value by `change` | boolean | `false` | 3.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | `{ root?: CSSProperties; prefix?: CSSProperties; suffix?: CSSProperties; input?: CSSProperties; actions?: CSSProperties; action?: CSSProperties; clear?: CSSProperties } \| ((info: { props: InputNumberProps }) => ...)` | - | 4.3.0 |
| suffix | The suffix icon for the Input | string \| slot | - | 4.3.0 |
| upIcon | Custom up icon | slot | `<UpOutlined />` | 3.3.0 |
| value(v-model) | Current value | number | - |  |
| variant | Variants of InputNumber | `'outlined'` \| `'borderless'` \| `'filled'` \| `'underlined'` | `'outlined'` | 4.3.0 |

### AllowClearConfig

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| clearIcon | Custom clear icon | VueNode | - | 4.3.0 |
| disabled | When `true`, equivalent to `allowClear={false}` | boolean | `false` | 4.3.0 |
| label | Accessible name of the clear button | string | `'Clear'` | 4.3.0 |
| tabIndex | Tab order of the clear button. `-1` excludes it from Tab navigation | number | `0` | 4.3.0 |

### Events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| change | The callback triggered when the value is changed. | function(value: number \| string \| null) |  |
| clear | Called when the clear button is activated | () => void | 4.3.0 |
| pressEnter | The callback function that is triggered when Enter key is pressed. | function(e) | 1.5.0 |
| step | The callback function that is triggered when click up or down buttons | (value: number, info: { offset: number, type: 'up' \| 'down' }) => void | 3.0 |

## Methods

| Name | Description | Parameters | Version |
| --- | --- | --- | --- |
| blur() | remove focus | - |  |
| focus() | get focus | (option?: { preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' }) | option: 4.3.0 |
| nativeElement | The native DOM element | - | 4.3.0 |

## FAQ

### Why `value` can exceed `min` or `max` in control?

Developer handle data by their own in control. It will make data out of sync if InputNumber changes display value. It also cause potential data issues when use in form.

### Why dynamic change `min` or `max` which makes `value` out of range will not trigger `change`?

`change` is user trigger event. Auto trigger will makes form lib can not detect data modify source.
