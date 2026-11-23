---
category: Components
type: 布局
title: Divider
subtitle: 分割线
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*7sMiTbzvaDoAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*KPSEQ74PLg4AAAAAAAAAAAAADrJ8AQ/original
---

区隔内容的分割线。

## 何时使用

- 对不同章节的文本段落进行分割。
- 对行内文字/链接进行分割，例如表格的操作列。

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `Record<'root' \| 'rail' \| 'content', string> \| (info: { props }) => Record<'root' \| 'rail' \| 'content', string>` | - | 4.3.0 |
| dashed | 是否虚线（推荐使用 `variant="dashed"`） | boolean | `false` |  |
| orientation | 分割线方向（`horizontal` \| `vertical`），同时兼容历史标题位置用法（`left` \| `right` \| `center` \| `start` \| `end`，推荐使用 `titlePlacement`） | `'horizontal' \| 'vertical' \| 'left' \| 'right' \| 'center' \| 'start' \| 'end'` | `'horizontal'` | 4.3.0 |
| ~~orientationMargin~~ | 标题和最近 left/right 边框之间的距离，去除了分割线，推荐使用 `styles.content` | string \| number | - | 3.0 |
| plain | 文字是否显示为普通正文样式 | boolean | `false` | 2.2.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| size | 间距大小，仅对水平分割线有效 | `'small' \| 'middle' \| 'medium' \| 'large'` | `'large'` | 4.3.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `Record<'root' \| 'rail' \| 'content', CSSProperties> \| (info: { props }) => Record<'root' \| 'rail' \| 'content', CSSProperties>` | - | 4.3.0 |
| titlePlacement | 分割线标题的位置 | `'left' \| 'right' \| 'center' \| 'start' \| 'end'` | `'center'` | 4.3.0 |
| ~~type~~ | 水平还是垂直类型，请使用 `orientation` 或 `vertical` 替代 | `'horizontal' \| 'vertical'` | `'horizontal'` |  |
| variant | 分割线是虚线、点线还是实线 | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | 4.3.0 |
| vertical | 是否为垂直分割线，与 `orientation` 同时配置时以 `orientation` 优先 | boolean | `false` | 4.3.0 |
