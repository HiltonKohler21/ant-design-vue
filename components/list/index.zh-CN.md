---
category: Components
type: 数据展示
title: List
subtitle: 列表
tag: DEPRECATED
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*EYuhSpw1iSwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*tBzwQ7raKX8AAAAAAAAAAAAADrJ8AQ/original
---

通用列表。

> **提示：** 对于长列表、虚拟滚动、分组吸顶或更轻量的列表展示场景，推荐使用全新的 [Listy](/components/listy-cn/) 组件（`4.3.0+`）。`List` 将逐步进入维护模式。

## 何时使用

最基础的列表展示，可承载文字、列表、图片、段落，常用于后台数据展示页面。

## API

### List

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| bordered | 是否展示边框 | boolean | `false` |  |
| dataSource | 列表数据源 | any\[] | - | 1.5.0 |
| footer | 列表底部 | string \| slot | - |  |
| grid | 列表栅格配置 | object | - |  |
| header | 列表头部 | string \| slot | - |  |
| itemLayout | 设置 `List.Item` 布局, 设置成 `vertical` 则竖直样式显示, 默认横排 | `horizontal` \| `vertical` | `horizontal` |  |
| loading | 当卡片内容还在加载中时，可以用 `loading` 展示一个占位 | boolean \| [SpinProps](/components/spin-cn/#api) | `false` |  |
| loadMore | 加载更多 | string \| slot | - |  |
| locale | 默认文案设置，目前包括空数据文案 | object | `emptyText: '暂无数据'` |  |
| pagination | 对应的 `pagination` [配置](/components/pagination-cn/#api), 设置 `false` 不显示 | boolean \| object | `false` |  |
| renderItem | 自定义 `Item` 函数，也可使用 `#renderItem="{ item, index }"` | ({ item, index }) => VueNode | - |  |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| rowKey | 各项 key 的取值，可以是字符串或一个函数 | string \| number \| (item: any) => Key | - |  |
| size | list 的尺寸 | `default` \| `large` \| `small` | `default` |  |
| split | 是否展示分割线 | boolean | `true` |  |

### pagination

分页的配置项。

| 参数     | 说明               | 类型                         | 默认值   | 版本  |
| -------- | ------------------ | ---------------------------- | -------- | ----- |
| position | 指定分页显示的位置 | `top` \| `bottom` \| `both`  | `bottom` |       |
| align    | 指定分页对齐的位置 | `start` \| `center` \| `end` | `end`    | 4.3.0 |

更多配置项，请查看 [`Pagination`](/components/pagination-cn/#api)。

### List grid props

| 参数   | 说明                 | 类型                                     | 默认值 | 版本 |
| ------ | -------------------- | ---------------------------------------- | ------ | ---- |
| column | 列数                 | number oneOf [ 1, 2, 3, 4, 6, 8, 12, 24] | -      |      |
| gutter | 栅格间隔             | number                                   | 0      |      |
| xxxl   | `≥2000px` 展示的列数 | number                                   | -      | 3.0  |
| xs     | `<576px` 展示的列数  | number                                   | -      |      |
| sm     | `≥576px` 展示的列数  | number                                   | -      |      |
| md     | `≥768px` 展示的列数  | number                                   | -      |      |
| lg     | `≥992px` 展示的列数  | number                                   | -      |      |
| xl     | `≥1200px` 展示的列数 | number                                   | -      |      |
| xxl    | `≥1600px` 展示的列数 | number                                   | -      |      |

### List.Item

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actions | 列表操作组，根据 `itemLayout` 的不同，位置在卡片底部或者最右侧 | VueNode[] \| slot | - |  |
| classNames | 语义化结构 className，支持对象或函数，并自动合并 `ConfigProvider.list` 配置 | Record\<`actions` \| `extra`, string\> \| (info: { props: ListItemProps }) => Record\<`actions` \| `extra`, string\> | - | 4.3.0 |
| extra | 额外内容，通常用在 `itemLayout` 为 `vertical` 的情况下展示右侧内容；`horizontal` 展示在列表元素最右侧 | string \| slot | - |  |
| styles | 语义化结构 style，支持对象或函数，并自动合并 `ConfigProvider.list` 配置 | Record\<`actions` \| `extra`, CSSProperties\> \| (info: { props: ListItemProps }) => Record\<`actions` \| `extra`, CSSProperties\> | - | 4.3.0 |

### List.Item.Meta

| 参数        | 说明               | 类型           | 默认值 |
| ----------- | ------------------ | -------------- | ------ |
| avatar      | 列表元素的图标     | slot           | -      |
| description | 列表元素的描述内容 | string \| slot | -      |
| title       | 列表元素的标题     | string \| slot | -      |

## FAQ

### List 组件废弃后，有替代方案吗？

有，请使用 `4.3.0` 起提供的 [Listy](/components/listy-cn/) 组件，它是 List 的继任者，内置了虚拟滚动、分组吸顶、程序化滚动等能力，并且支持灵活的自定义渲染方式。

### 如何从 List 迁移？

- **数据与渲染**：`dataSource` 对应 `items`，`renderItem` 对应 `itemRender`（或 `#item` 插槽）；`rowKey` 含义不变。列表数据量较大时配合 `height` 开启 `virtual` 即可实现虚拟滚动。
- **行内的预设结构**：`List.Item`、`List.Item.Meta`、`actions`、`extra` 等均可在 `itemRender` / `#item` 中自行组合。
- **列表外的结构**：`header` 与 `footer` 直接写在 Listy 外层，`loading` 用 [Spin](/components/spin-cn/) 包裹，`pagination` 自行切片后传入 `items` 并搭配 [Pagination](/components/pagination-cn/) 使用，`loadMore` 可参考 [Listy 无限加载](/components/listy-cn/) 示例。
- **样式相关**：`bordered`、`split`、`size` 通过语义化 DOM 的 `classNames`、`styles` 与主题变量调整；`grid` 场景建议直接使用 [Row / Col](/components/grid-cn/) 搭配 [Card](/components/card-cn/) 实现卡片墙布局。
