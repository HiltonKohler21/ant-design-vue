---
category: Components
type: 其他
title: BorderBeam
cols: 2
subtitle: 边框流光
tag: 4.3.0
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*uae3QbkNCm8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*VcjGQLSrYdcAAAAAAAAAAAAADrJ8AQ/original
---

在容器边框上循环流动的渐变光束，用于强调卡片、面板等元素。

## 何时使用

- 需要突出展示的重点卡片（AI 生成结果、推荐位等）；
- 需要低干扰的动态强调效果时。

## API

### BorderBeam

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| color | 光束颜色，支持纯色、颜色数组或渐变色标 | string \| string[] \| { color: string; percent: number }[] | - | 4.3.0 |
| count | 光束数量 | number | 1 | 4.3.0 |
| duration | 单圈动画时长（秒） | number | 6 | 4.3.0 |
| items | 逐条光束配置，优先于 count | BorderBeamItem[] | - | 4.3.0 |
| lineWidth | 边框光束厚度 | number \| string | `lineWidth` token (1px) | 4.3.0 |
| outset | 光束向外偏移量 | number \| string | 宿主元素边框宽度 | 4.3.0 |
| size | 光束长度（CSS 长度） | number \| string | `100px` | 4.3.0 |
| rootClassName | 光束节点类名 | string | - | 4.3.0 |

### BorderBeamItem

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| color | 该条光束颜色 | string \| string[] \| { color: string; percent: number }[] | - |
| lineWidth | 该条光束边框厚度 | number \| string | - |
| outset | 该条光束向外偏移 | number \| string | - |
| size | 该条光束长度（CSS 长度） | number \| string | - |
