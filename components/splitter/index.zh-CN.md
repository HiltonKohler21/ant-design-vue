---
category: Components
type: 布局
title: Splitter
subtitle: 分隔面板
tag: 4.3.0
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*f0SISaETY0wAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*y92yRYhObU8AAAAAAAAAAAAADrJ8AQ/original
---

自由切分指定区域的面板布局。

## 何时使用

- 需要将一块区域切分成可拖拽调整大小的多个面板时。

## API

### Splitter

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 语义化结构 class，支持对象或函数 | `SplitterClassNamesType` | - | 4.3.0 |
| collapsible | `motion` 是否开启折叠动画，`icon` 自定义折叠图标 | `{ motion?: boolean; icon?: { start?: VueNode; end?: VueNode } }` | - | 4.3.0 |
| ~~collapsibleIcon~~ | （已废弃，请使用 `collapsible.icon`）自定义折叠图标 | `{ start?: VueNode; end?: VueNode }` | - | 4.3.0 |
| destroyOnHidden | 折叠时（size 为 0）销毁面板内容，应用于所有面板，可在单个面板上覆盖 | boolean | false | 4.3.0 |
| draggerClassName | 自定义拖拽条类名 | `string \| { default?: string; active?: string }` | - | 4.3.0 |
| draggerIcon | 自定义拖拽图标，传 `null` 隐藏默认图标 | `VueNode` | - | 4.3.0 |
| draggerStyle | 自定义拖拽条样式 | `CSSProperties \| { default?: CSSProperties; active?: CSSProperties }` | - | 4.3.0 |
| ~~layout~~ | 布局方向（已废弃，请使用 `orientation`） | `horizontal` \| `vertical` | `horizontal` | 4.3.0 |
| lazy | 拖拽时实时更新面板尺寸，设为 `true` 时拖拽结束后才更新 | boolean | false | 4.3.0 |
| orientation | 布局方向，优先级高于 `vertical` 与 `layout` | `horizontal` \| `vertical` | `horizontal` | 4.3.0 |
| rootClassName | 根节点 className | string | - | 4.3.0 |
| styles | 语义化结构 style，支持对象或函数 | `SplitterStylesType` | - | 4.3.0 |
| vertical | 排列方向，与 `orientation` 同时存在时以 `orientation` 优先 | boolean | false | 4.3.0 |
| onCollapse | 面板折叠时回调 | (collapsed: boolean[], sizes: number[]) => void | - | 4.3.0 |
| onDraggerDoubleClick | 双击拖拽条时回调（也可使用 `@dragger-double-click`） | (index: number) => void | - | 4.3.0 |
| onResize | 面板尺寸变化回调 | (sizes: number[]) => void | - | 4.3.0 |
| onResizeEnd | 拖拽结束时回调 | (sizes: number[]) => void | - | 4.3.0 |
| onResizeStart | 开始拖拽时回调 | (sizes: number[]) => void | - | 4.3.0 |

### Splitter.Panel

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultSize | 初始面板大小，支持数字（px）或百分比字符串 | number \| string | - | 4.3.0 |
| min | 最小阈值，支持数字（px）或百分比字符串 | number \| string | - | 4.3.0 |
| max | 最大阈值，支持数字（px）或百分比字符串 | number \| string | - | 4.3.0 |
| size | 受控面板大小，支持数字（px）或百分比字符串 | number \| string | - | 4.3.0 |
| collapsible | 是否可折叠，或分别控制首尾折叠 | boolean \| { start?, end?, showCollapsibleIcon? } | - | 4.3.0 |
| destroyOnHidden | 折叠隐藏时销毁子元素 | boolean | false | 4.3.0 |
| resizable | 是否可拖拽 | boolean | true | 4.3.0 |

### Semantic DOM

`classNames` 与 `styles` 支持以下语义化节点（均支持静态对象或 `(info: { props }) => ...` 函数形式）：

- `root`: 根容器节点
- `panel`: 面板节点
- `dragger`: 拖拽条节点（支持字符串 / `CSSProperties` 或 `{ default, active }` 状态对象）
