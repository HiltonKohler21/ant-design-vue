---
category: Components
type: 布局
subtitle: 间距
title: Space
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ZiJ3SbOH9SUAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*37T2R6O9oi0AAAAAAAAAAAAADrJ8AQ/original
---

设置组件之间的间距。

## 何时使用

避免组件紧贴在一起，拉开统一的空间。

- 适合行内元素的水平间距。
- 可以设置各种水平对齐方式。
- 需要表单组件之间紧凑连接且合并边框时，使用 `Space.Compact`（自 `ant-design-vue@4.0.0` 版本开始提供该组件）。
- 在 `Space.Compact` 中需要前置/后置附加标签时，使用 `Space.Addon`（自 `4.3.0` 版本开始提供）。

## API

### Space

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| align | 对齐方式 | `start` \| `end` \| `center` \| `baseline` \| `stretch` | - | 1.6.5 |
| classNames | 语义化结构 class，支持静态对象或函数 | `{ root?: string; item?: string; separator?: string }` \| `(info: { props: SpaceProps }) => ...` | - | 4.3.0 |
| direction | （已废弃，请使用 `orientation`）间距方向 | `vertical` \| `horizontal` | `horizontal` | 1.6.5 |
| orientation | 间距方向，优先级高于 `vertical` 与 `direction` | `vertical` \| `horizontal` | `horizontal` | 4.3.0 |
| rootClassName | 根节点 className | string | - | 4.3.0 |
| separator | 设置分隔符（替代 `split`） | VueNode \| v-slot | - | 4.3.0 |
| size | 间距大小 | `small` \| `middle` \| `large` \| `number` \| `[Size, Size]` | `small` | 1.6.5 |
| split | （已废弃，请使用 `separator`）设置分隔符 | VueNode \| v-slot | - | 2.2.0 |
| styles | 语义化结构 style，支持静态对象或函数 | `{ root?: CSSProperties; item?: CSSProperties; separator?: CSSProperties }` \| `(info: { props: SpaceProps }) => ...` | - | 4.3.0 |
| vertical | 是否垂直排列，与 `orientation` 同时设置时以 `orientation` 优先 | boolean | false | 4.3.0 |
| wrap | 是否自动换行，仅在 `horizontal` 时有效 | boolean | false | 2.2.0 |

### Space.Compact

> 自 ant-design-vue@4.0.0 版本开始提供该组件。

需要表单组件之间紧凑连接且合并边框时，使用 `Space.Compact`。支持的组件有：

- Button
- AutoComplete
- Cascader
- DatePicker
- Input / Input.Search
- InputNumber
- Select
- Space.Addon
- TimePicker
- TreeSelect

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| align | 对齐方式 | `start` \| `end` \| `center` \| `baseline` | - | 4.3.0 |
| block | 将宽度调整为父元素宽度的选项 | boolean | false | 4.0.0 |
| direction | （已废弃，请使用 `orientation`）指定排列方向 | `vertical` \| `horizontal` | `horizontal` | 4.0.0 |
| orientation | 指定排列方向 | `vertical` \| `horizontal` | `horizontal` | 4.3.0 |
| size | 子组件大小 | `large` \| `middle` \| `small` | `middle` | 4.0.0 |
| vertical | 是否垂直排列，与 `orientation` 同时设置时以 `orientation` 优先 | boolean | false | 4.3.0 |

### Space.Addon

> 自 `4.3.0` 版本开始提供。

用于在 `Space.Compact` 紧凑布局中创建自定义前后置标签单元格。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| disabled | 是否禁用 | boolean | false | 4.3.0 |
| size | 尺寸（未设置时自动继承 `Space.Compact` 尺寸） | `large` \| `middle` \| `small` | - | 4.3.0 |
| status | 校验状态 | `error` \| `warning` | - | 4.3.0 |
| variant | 形态变体 | `outlined` \| `filled` \| `borderless` \| `underlined` | `outlined` | 4.3.0 |
