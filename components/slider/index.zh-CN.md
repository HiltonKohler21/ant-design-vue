---
category: Components
subtitle: 滑动输入条
type: 数据录入
title: Slider
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*_4heQaUrFn4AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*XkgXTaudeosAAAAAAAAAAAAADrJ8AQ/original
---

滑动型输入器，展示当前值和可选范围。

## 何时使用

当用户需要在数值区间/自定义区间内进行选择时，可为连续或离散值。

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoAdjustOverflow | 气泡被遮挡时自动调整位置 | boolean | true |  |
| autofocus | 自动获取焦点 | boolean | false |  |
| classNames | 用于自定义 Slider 组件内部各语义化结构的 class，支持对象或函数 | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| defaultValue | 设置初始取值。当 `range` 为 `false` 时，使用 `number`，否则用 `number[]` | number \| number\[] | 0 \| \[0, 0] |  |
| disabled | 值为 `true` 时，滑块为禁用状态；也可传入布尔数组按索引单独禁用 range 模式下的指定滑块 | boolean \| boolean\[] | false | boolean\[]: 4.3.0 |
| dots | 是否只能拖拽到刻度上 | boolean | false |  |
| formatter | Slider 会把当前值传给 `formatter`，并在 Tooltip 中显示 `formatter` 的返回值，若为 null，则隐藏 Tooltip（替代 `tipFormatter`） | (value?: number) => VueNode \| null | IDENTITY | 4.3.0 |
| handleRender | 自定义滑块节点渲染 | (node: VNode, info: { index: number; value: number; dragging: boolean }) => VNode | - | 4.3.0 |
| handleStyle | 滑块样式（已废弃，请使用 `styles.handle` 替代） | CSSProperties \| CSSProperties\[] | - |  |
| included | `marks` 不为空对象时有效，值为 true 时表示值为包含关系，false 表示并列 | boolean | true |  |
| keyboard | 支持使用键盘操作 handler | boolean | true |  |
| mark | 自定义刻度标记 | v-slot:mark | { point: number, label: any } | 3.0 |
| marks | 刻度标记，key 的类型必须为 `number` 且取值在闭区间 \[min, max] 内，每个标签可以单独设置样式 | object | { number: string\|VNode } or { number: { style: object, label: string\|VNode } } or { number: () => VNode } |  |
| max | 最大值 | number | 100 |  |
| min | 最小值 | number | 0 |  |
| orientation | 滑动输入条方向（优先于 `vertical`） | `'horizontal'` \| `'vertical'` | `'horizontal'` | 4.3.0 |
| range | 双滑块/多滑块模式 | boolean \| [range](#range) | false |  |
| reverse | 反向坐标轴 | boolean | false | 1.5.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| startPoint | 单滑块模式下高亮轨道的起始值 | number | `min` | 4.3.0 |
| step | 步长，取值必须大于 0，并且可被 (max - min) 整除。当 `marks` 不为空对象时，可以设置 `step` 为 `null`，此时 Slider 的可选值仅有 marks 标出来的部分。 | number\|null | 1 |  |
| styles | 用于自定义 Slider 组件内部各语义化结构的行内 style，支持对象或函数 | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| tooltip | 设置 Tooltip 相关属性 | [tooltip](#tooltip) | - | 4.3.0 |
| trackStyle | 选中部分轨道样式（已废弃，请使用 `styles.track` 替代） | CSSProperties \| CSSProperties\[] | - |  |
| value(v-model) | 设置当前取值。当 `range` 为 `false` 时，使用 `number`，否则用 `[number, number]` | number\|number\[] | - |  |
| vertical | 值为 `true` 时，Slider 为垂直方向 | Boolean | false |  |
| tipFormatter | Slider 会把当前值传给 `tipFormatter`，并在 Tooltip 中显示 `tipFormatter` 的返回值，若为 null，则隐藏 Tooltip（已废弃，请使用 `formatter` 替代）。 | Function\|null | IDENTITY |  |
| tooltipPlacement | 设置 Tooltip 展示位置。参考 [`Tooltip`](/components/tooltip/)。 | string | - | 1.5.0 |
| tooltipOpen | 值为`true`时，Tooltip 将会始终显示；否则始终不显示，哪怕在拖拽及移入时。 | Boolean | - | 4.0 |
| getTooltipPopupContainer | Tooltip 渲染父节点，默认渲染到 body 上。 | Function | () => document.body | 1.5.0 |

### range

| 参数           | 说明                                               | 类型    | 默认值 | 版本  |
| -------------- | -------------------------------------------------- | ------- | ------ | ----- |
| draggableTrack | 范围刻度是否可被拖拽                               | boolean | false  |       |
| editable       | 启动动态增减节点，不能和 `draggableTrack` 一同使用 | boolean | false  | 4.3.0 |
| minCount       | 配置 `editable` 时，最小节点数量                   | number  | 0      | 4.3.0 |
| maxCount       | 配置 `editable` 时，最大节点数量                   | number  | -      | 4.3.0 |

### tooltip

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoAdjustOverflow | 气泡被遮挡时自动调整位置 | boolean | true | 4.3.0 |
| formatter | Slider 会把当前值传给 `formatter`，并在 Tooltip 中显示 `formatter` 的返回值，若为 null，则隐藏 Tooltip | ((value?: number) => VueNode) \| null | IDENTITY | 4.3.0 |
| getPopupContainer | Tooltip 渲染父节点，默认渲染到 body 上 | (triggerNode: HTMLElement) => HTMLElement | () => document.body | 4.3.0 |
| open | 值为 `true` 时，Tooltip 将会始终显示；否则始终不显示，哪怕在拖拽及移入时 | boolean | - | 4.3.0 |
| placement | 设置 Tooltip 展示位置。参考 [`Tooltip`](/components/tooltip/) | string | - | 4.3.0 |
| prefixCls | 自定义 Tooltip 类名前缀 | string | - | 4.3.0 |

### 事件

| 事件名称 | 说明 | 回调参数 | 版本 |
| --- | --- | --- | --- |
| change | 当 Slider 的值发生改变时，会触发 change 事件，并把改变后的值作为参数传入。 | Function(value) |  |
| changeComplete | 与 `mouseup` 触发时机一致，把当前值作为参数传入。 | Function(value) | 4.3.0 |
| afterChange | 与 `mouseup` 触发时机一致，把当前值作为参数传入（已废弃，请使用 `changeComplete` 替代）。 | Function(value) |  |

## 方法

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |

## Semantic DOM

支持：`root`（根元素）、`rail`（底轨）、`tracks`（多段轨道容器）、`track`（已选轨道）、`handle`（滑块手柄）。
