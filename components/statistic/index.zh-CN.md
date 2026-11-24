---
category: Components
type: 数据展示
title: Statistic
subtitle: 统计数值
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YL7PRYNtH-4AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*BPWDRbSYxJ4AAAAAAAAAAAAADrJ8AQ/original
---

展示统计数值。

## 何时使用

- 当需要突出某个或某组数字时
- 当需要展示带描述的统计类数据时使用

## API

### Statistic

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 用于自定义 Statistic 组件内部各语义化结构的 class，支持对象或函数 | Record<SemanticDOM, string> \| (info: { props: StatisticProps }) => Record<SemanticDOM, string> | - | 4.3.0 |
| decimalSeparator | 设置小数点 | string | . |  |
| formatter | 自定义数值展示 | v-slot \| ({value}) => VNode | - |  |
| groupSeparator | 设置千分位标识符 | string | , |  |
| loading | 数值是否加载中 | boolean | false |  |
| precision | 数值精度 | number | - |  |
| prefix | 设置数值的前缀 | string \| v-slot | - |  |
| rootClassName | 根节点 className | string | - | 4.3.0 |
| styles | 用于自定义 Statistic 组件内部各语义化结构的行内 style，支持对象或函数 | Record<SemanticDOM, CSSProperties> \| (info: { props: StatisticProps }) => Record<SemanticDOM, CSSProperties> | - | 4.3.0 |
| suffix | 设置数值的后缀 | string \| v-slot | - |  |
| title | 数值的标题 | string \| v-slot | - |  |
| value | 数值内容 | string \| number | - |  |
| ~~valueStyle~~ | 设置数值区域的样式（已废弃，请使用 `styles.content` 替代） | style | - |  |

> 语义化结构 `SemanticDOM` 支持：`root` \| `header` \| `title` \| `content` \| `value` \| `prefix` \| `suffix`。

### Statistic.Countdown

| 参数       | 说明                                                | 类型             | 默认值     |
| ---------- | --------------------------------------------------- | ---------------- | ---------- |
| format     | 格式化倒计时展示，参考 [dayjs](https://day.js.org/) | string           | 'HH:mm:ss' |
| prefix     | 设置数值的前缀                                      | string \| v-slot | -          |
| suffix     | 设置数值的后缀                                      | string \| v-slot | -          |
| title      | 数值的标题                                          | string \| v-slot | -          |
| value      | 数值内容                                            | number \| dayjs  | -          |
| valueStyle | 设置数值的样式                                      | style            | -          |

#### Statistic.Countdown 事件

| 事件名称 | 说明                 | 回调参数                 |
| -------- | -------------------- | ------------------------ |
| change   | 倒计时时间变化时触发 | (value?: number) => void |
| finish   | 倒计时完成时触发     | () => void               |

### Statistic.Timer `4.3.0`

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| format | 格式化计时展示，参考 [dayjs](https://day.js.org/) | string | 'HH:mm:ss' |
| prefix | 设置数值的前缀 | string \| v-slot | - |
| suffix | 设置数值的后缀 | string \| v-slot | - |
| title | 数值的标题 | string \| v-slot | - |
| type | 计时器类型，支持倒计时和正计时 | `'countdown'` \| `'countup'` | `'countdown'` |
| value | 目标时间戳 | number \| string \| dayjs | - |
| valueStyle | 设置数值的样式 | style | - |

#### Statistic.Timer 事件

| 事件名称 | 说明                                               | 回调参数                 |
| -------- | -------------------------------------------------- | ------------------------ |
| change   | 计时时间变化时触发                                 | (value?: number) => void |
| finish   | 倒计时完成时触发（仅在 `type="countdown"` 时触发） | () => void               |
