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
| addonAfter | The label text displayed after (on the right side of) the input field | slot | - | 3.0 |
| addonBefore | The label text displayed before (on the left side of) the input field | slot | - | 3.0 |
| autofocus | Get focus when component mounted | boolean | false |  |
| ~~bordered~~ | Whether has border style (deprecated, please use `variant` instead) | boolean | true | 3.0 |
| changeOnWheel | Allows to change value by wheel | boolean | false | 4.3.0 |
| controls | Whether to show `+-` controls | boolean | true | 3.0 |
| decimalSeparator | Decimal separator | string | - |  |
| defaultValue | Initial value | number | - |  |
| disabled | Disable the input | boolean | false |  |
| downIcon | Custom down icon | slot | `<DownOutlined />` | 3.3.0 |
| formatter | Specifies the format of the value presented | function(value: number \| string, info: { userTyping: boolean, input: string }): string | - | info: 3.0 |
| keyboard | If enable keyboard behavior | boolean | true | 3.0 |
| max | Max value | number | Infinity |  |
| min | Min value | number | -Infinity |  |
| parser | Specifies the value extracted from formatter | function(string): number | - |  |
| placeholder | Placeholder of input | string | - |  |
| precision | Precision of input value | number | - |  |
| prefix | The prefix icon for the Input | slot | - | 3.0 |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| size | Height of input box | string | - |  |
| status | Set validation status | `'error'` \| `'warning'` | - | 3.3.0 |
| step | The number to which the current value is increased or decreased. It can be an integer or decimal. | number \| string | 1 |  |
| stringMode | Set value as string to support high precision decimals. Will return string value by `change` | boolean | false | 3.0 |
| suffix | The suffix icon for the Input | string \| slot | - | 4.3.0 |
| upIcon | Custom up icon | slot | `<UpOutlined />` | 3.3.0 |
| value(v-model) | Current value | number | - |  |
| variant | Variants of InputNumber | `'outlined'` \| `'borderless'` \| `'filled'` \| `'underlined'` | `'outlined'` | 4.3.0 |

### events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| change | The callback triggered when the value is changed. | function(value: number \| string) |  |
| pressEnter | The callback function that is triggered when Enter key is pressed. | function(e) | 1.5.0 |
| step | The callback function that is triggered when click up or down buttons | (value: number, info: { offset: number, type: 'up' \| 'down' }) => void | 3.0 |

## Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | remove focus |
| focus() | get focus    |

## FAQ

### Why `value` can exceed `min` or `max` in control?

Developer handle data by their own in control. It will make data out of sync if InputNumber change display value. It also cause potential data issues when use in form.

### Why dynamic change `min` or `max` which makes `value` out of range will not trigger `change`?

`change` is user trigger event. Auto trigger will makes form lib can not detect data modify source.
