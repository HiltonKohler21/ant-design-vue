---
category: Components
type: 布局
title: Splitter
subtitle: 分隔面板
cover: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20180%20110%22%20fill%3D%22none%22%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22144%22%20height%3D%2274%22%20rx%3D%228%22%20fill%3D%22%23ffffff%22%20stroke%3D%22%23e5e7eb%22%20stroke-width%3D%221.5%22%2F%3E%3Crect%20x%3D%2226%22%20y%3D%2226%22%20width%3D%2252%22%20height%3D%2258%22%20rx%3D%225%22%20fill%3D%22%23e6f4ff%22%2F%3E%3Crect%20x%3D%2294%22%20y%3D%2226%22%20width%3D%2260%22%20height%3D%2258%22%20rx%3D%225%22%20fill%3D%22%23f0f0f0%22%2F%3E%3Cline%20x1%3D%2286%22%20y1%3D%2220%22%20x2%3D%2286%22%20y2%3D%2290%22%20stroke%3D%22%231677ff%22%20stroke-width%3D%222%22%2F%3E%3Crect%20x%3D%2282%22%20y%3D%2245%22%20width%3D%228%22%20height%3D%2220%22%20rx%3D%224%22%20fill%3D%22%231677ff%22%2F%3E%3C%2Fsvg%3E'
coverDark: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20180%20110%22%20fill%3D%22none%22%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22144%22%20height%3D%2274%22%20rx%3D%228%22%20fill%3D%22%231f1f1f%22%20stroke%3D%22%23383838%22%20stroke-width%3D%221.5%22%2F%3E%3Crect%20x%3D%2226%22%20y%3D%2226%22%20width%3D%2252%22%20height%3D%2258%22%20rx%3D%225%22%20fill%3D%22%2315325b%22%2F%3E%3Crect%20x%3D%2294%22%20y%3D%2226%22%20width%3D%2260%22%20height%3D%2258%22%20rx%3D%225%22%20fill%3D%22%23262626%22%2F%3E%3Cline%20x1%3D%2286%22%20y1%3D%2220%22%20x2%3D%2286%22%20y2%3D%2290%22%20stroke%3D%22%231668dc%22%20stroke-width%3D%222%22%2F%3E%3Crect%20x%3D%2282%22%20y%3D%2245%22%20width%3D%228%22%20height%3D%2220%22%20rx%3D%224%22%20fill%3D%22%231668dc%22%2F%3E%3C%2Fsvg%3E'
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
| resizable | 是否可拖拽 | boolean | true | 4.3.0 |
