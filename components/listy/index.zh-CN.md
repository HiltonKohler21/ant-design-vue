---
category: Components
type: 数据展示
title: Listy
cols: 1
subtitle: 虚拟列表
tag: 4.3.0
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*EYuhSpw1iSwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*tBzwQ7raKX8AAAAAAAAAAAAADrJ8AQ/original
---

高性能列表组件，内置行悬浮、分组吸顶、横向滚动与可选虚拟滚动，推荐用于替代传统 `List` 处理长列表与轻量列表场景。

## 何时使用

- 需要渲染长列表，又不想为每一行付出挂载成本时 —— 开启 `virtual` 并配合 `height` 仅渲染视口内的行。
- 列表需要分组展示，并让分组标题吸顶（`group` + `sticky`）时。
- 需要以命令式方式控制滚动位置（跳到某一项、某个分组或某个像素位置）时。

## API

### Listy

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record\<`root` \| `item` \| `groupHeader` \| `groupSection` \| `holder` \| `scrollbar`, string\> \| (info: { props: ListyProps }) => Record\<string, string\> | - | 4.3.0 |
| group | 分组配置，见下方 [Group](#group) | [ListyGroupConfig](#group) | - | 4.3.0 |
| height | 滚动容器高度，内容超出后滚动（虚拟与非虚拟模式均生效） | number | - | 4.3.0 |
| itemHeight | 行高覆写（可选；未传入时自动基于主题 Token 计算） | number | - | 4.3.0 |
| itemRender | 渲染单行内容，也支持 `#item="{ item, index }"` 插槽 | (item: T, index: number) => VueNode | - | 4.3.0 |
| items | 列表数据源 | T[] | `[]` | 4.3.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| rowHoverable | 列表行是否开启 hover 交互 | boolean | `true` | 4.3.0 |
| rowKey | 每一项的唯一键，字段名或取值函数 | string \| (item: T, index?: number) => Key | - | 4.3.0 |
| scrollWidth | 内容的横向滚动宽度，超出容器宽度时可横向滚动 | number | - | 4.3.0 |
| sticky | 分组标题是否吸顶 | boolean | `false` | 4.3.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record\<`root` \| `item` \| `groupHeader` \| `groupSection` \| `holder` \| `scrollbar`, CSSProperties\> \| (info: { props: ListyProps }) => Record\<string, CSSProperties\> | - | 4.3.0 |
| virtual | 是否开启虚拟滚动，仅渲染视口内的行，需配合 `height` 使用（未指定时回退到 `ConfigProvider.virtual`） | boolean | `false` | 4.3.0 |
| ~~data~~ | 已废弃，请使用 `items` 替代 | T[] | - | 4.3.0 |
| ~~itemKey~~ | 已废弃，请使用 `rowKey` 替代 | string \| (item: T, index?: number) => Key | - | 4.3.0 |

### 事件

| 事件名称 | 说明                                       | 回调参数             | 版本  |
| -------- | ------------------------------------------ | -------------------- | ----- |
| scroll   | 原生滚动事件回调（也支持 `onScroll` 属性） | (e: UIEvent) => void | 4.3.0 |

### 插槽

| 插槽名称 | 说明 | 参数 | 版本 |
| --- | --- | --- | --- |
| item | 自定义渲染单行内容（优先级低于 `itemRender`） | { item: T, index: number } | 4.3.0 |
| groupTitle | 自定义渲染分组标题（优先级低于 `group.title`） | { groupKey: K, items: T[] } | 4.3.0 |

### Group

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 计算每条数据所属的分组键（字段名或函数），返回值相同的数据归为一组 | string \| (item: T) => K | - |
| title | 渲染分组标题，入参为分组键与该组数据 | (groupKey: K, items: T[]) => VueNode | - |

### Ref

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| nativeElement | 组件根 DOM 节点 | HTMLElement |
| scrollTo | 滚动到某个像素位置、某一项或某个分组 | (config?: ListyScrollToConfig) => void |
| scrollToIndex | 快捷滚动到指定下标项（等价于 `scrollTo({ index })`） | (index: number) => void |

`ListyScrollToConfig` 为以下之一：

| 形态                            | 说明                                |
| ------------------------------- | ----------------------------------- |
| number                          | 滚动到某个像素位置（`scrollTop`）   |
| `{ top?, left? }`               | 滚动到绝对像素坐标                  |
| `{ key, align?, offset? }`      | 滚动到 `rowKey` 等于 `key` 的数据项 |
| `{ groupKey, align?, offset? }` | 滚动到某个分组标题                  |
| `{ index, align?, offset? }`    | 滚动到指定下标数据项                |

`align` 可选 `'top' | 'bottom' | 'auto'`；`offset` 为对齐后额外的像素偏移。
