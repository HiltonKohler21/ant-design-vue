---
category: Components
type: 布局
title: Splitter
subtitle: 分隔面板
tag: 4.3.0
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
| layout | 布局方向 | `horizontal` \| `vertical` | `horizontal` | 4.3.0 |
| lazy | 拖拽时实时更新面板尺寸，设为 `true` 时拖拽结束后才更新 | boolean | false | 4.3.0 |
| onResize | 面板尺寸变化回调 | (sizes: number[]) => void | - | 4.3.0 |
| onResizeStart | 开始拖拽时回调 | (sizes: number[]) => void | - | 4.3.0 |
| onResizeEnd | 拖拽结束时回调 | (sizes: number[]) => void | - | 4.3.0 |
| onCollapse | 面板折叠时回调 | (collapsed: boolean[], sizes: number[]) => void | - | 4.3.0 |
| rootClassName | 根节点 className | string | - | 4.3.0 |

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
