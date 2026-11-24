---
category: Components
type: 数据录入
title: InputNumber
subtitle: 数字输入框
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*JvWbSYhuNlIAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*1uH-R5kLAMIAAAAAAAAAAAAADrJ8AQ/original
---

通过鼠标或键盘，输入范围内的数值。

## 何时使用

当需要获取标准数值时。

## API

属性如下

| 成员 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| ~~addonAfter~~ | 带标签的 input，设置后置标签（请使用 `Space.Compact` 替换） | slot | - | 3.0 |
| ~~addonBefore~~ | 带标签的 input，设置前置标签（请使用 `Space.Compact` 替换） | slot | - | 3.0 |
| allowClear | 是否显示清除按钮，清空后的值为 `null` | boolean \| [AllowClearConfig](#allowclearconfig) | `false` | 4.3.0 |
| autofocus | 自动获取焦点 | boolean | `false` |  |
| ~~bordered~~ | 是否有边框（已废弃，请使用 `variant`） | boolean | `true` | 3.0 |
| changeOnBlur | 是否在失去焦点时触发 `change` 事件（例如值超出范围时重新限制回范围并触发事件） | boolean | `true` | 4.3.0 |
| changeOnWheel | 允许鼠标滚轮改变数值 | boolean | `false` | 4.3.0 |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `{ root?: string; prefix?: string; suffix?: string; input?: string; actions?: string; action?: string; clear?: string } \| ((info: { props: InputNumberProps }) => ...)` | - | 4.3.0 |
| controls | 是否显示增减按钮，也可通过对象自定义上下箭头图标 | boolean \| { upIcon?: VueNode; downIcon?: VueNode } | `true` | 3.0 / object: 4.3.0 |
| decimalSeparator | 小数点 | string | - |  |
| defaultValue | 初始值 | number | - |  |
| disabled | 禁用 | boolean | `false` |  |
| downIcon | 自定义下箭头图标 | slot | `<DownOutlined />` | 3.3.0 |
| formatter | 指定输入框展示值的格式 | function(value: number \| string, info: { userTyping: boolean, input: string }): string | - | info: 3.0 |
| keyboard | 是否启用键盘快捷行为 | boolean | `true` | 3.0 |
| max | 最大值 | number | Infinity |  |
| min | 最小值 | number | -Infinity |  |
| mode | 展示输入框或拨轮 | `'input'` \| `'spinner'` | `'input'` | 4.3.0 |
| parser | 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用 | function(string): number | - |  |
| placeholder | 输入框占位文本 | string | - |  |
| precision | 数值精度 | number | - |  |
| prefix | 带有前缀图标的 input | string \| slot | - | 3.0 |
| readonly | 只读 | boolean | `false` |  |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| size | 输入框大小 | `'large'` \| `'middle'` \| `'small'` | - |  |
| status | 设置校验状态 | `'error'` \| `'warning'` | - | 3.3.0 |
| step | 每次改变步数，可以为小数 | number \| string | 1 |  |
| stringMode | 字符值模式，开启后支持高精度小数。同时 `change` 事件将返回 string 类型 | boolean | `false` | 3.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `{ root?: CSSProperties; prefix?: CSSProperties; suffix?: CSSProperties; input?: CSSProperties; actions?: CSSProperties; action?: CSSProperties; clear?: CSSProperties } \| ((info: { props: InputNumberProps }) => ...)` | - | 4.3.0 |
| suffix | 带有后缀图标的 input | string \| slot | - | 4.3.0 |
| upIcon | 自定义上箭头图标 | slot | `<UpOutlined />` | 3.3.0 |
| value(v-model) | 当前值 | number | - |  |
| variant | 形态变体 | `'outlined'` \| `'borderless'` \| `'filled'` \| `'underlined'` | `'outlined'` | 4.3.0 |

### AllowClearConfig

| 参数      | 说明                                              | 类型    | 默认值    | 版本  |
| --------- | ------------------------------------------------- | ------- | --------- | ----- |
| clearIcon | 自定义清除图标                                    | VueNode | -         | 4.3.0 |
| disabled  | `true` 时等同于 `allowClear={false}`              | boolean | `false`   | 4.3.0 |
| label     | 清除按钮的无障碍名称                              | string  | `'Clear'` | 4.3.0 |
| tabIndex  | 清除按钮的 Tab 键顺序。`-1` 表示不参与 Tab 键导航 | number  | `0`       | 4.3.0 |

### 事件

| 事件名称 | 说明 | 回调参数 | 版本 |
| --- | --- | --- | --- |
| change | 变化回调 | Function(value: number \| string \| null) |  |
| clear | 点击清除按钮时的回调 | () => void | 4.3.0 |
| pressEnter | 按下回车的回调 | function(e) |  |
| step | 点击上下箭头的回调 | (value: number, info: { offset: number, type: 'up' \| 'down' }) => void | 3.0 |

## 方法

| 名称 | 描述 | 参数 | 版本 |
| --- | --- | --- | --- |
| blur() | 移除焦点 | - |  |
| focus() | 获取焦点 | (option?: { preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' }) | option: 4.3.0 |
| nativeElement | 获取原生 DOM 元素 | - | 4.3.0 |

## FAQ

### 为何受控模式下，`value` 可以超出 `min` 和 `max` 范围？

在受控模式下，开发者可能自行存储相关数据。如果组件将数据约束回范围内，会导致展示数据与实际存储数据不一致的情况。这使得一些如表单场景存在潜在的数据问题。

### 为何动态修改 `min` 和 `max` 让 `value` 超出范围不会触发 `change` 事件？

`change` 事件为用户触发事件，自行触发会导致表单库误以为变更来自用户操作。我们以错误样式展示超出范围的数值。
