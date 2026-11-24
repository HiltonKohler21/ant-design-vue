---
category: Components
type: 布局
title: Masonry
subtitle: 瀑布流
cols: 1
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*cELTRrM5HpAAAAAAOGAAAAgAegCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*2CxJRYJmfbIAAAAAPqAAAAgAegCCAQ/original
tag: 4.3.0
---

瀑布流布局，把不等高的子项按「当前最短列」分配到多列中，支持响应式列数、图片加载自动重排以及平滑入场过渡。

## 何时使用

- 图片墙、卡片流等高度不一致的内容列表；
- 需要减少留白、让内容更紧凑地铺满多列时。

## API

### Masonry

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 数据源 | MasonryItemType[] | [] | 4.3.0 |
| columns | 列数，支持按断点配置 | number \| `Record<Breakpoint, number>` | 2 | 4.3.0 |
| gutter | 间距，支持数字、`[水平, 垂直]`、断点对象 | number \| `[number, number]` \| `Record<Breakpoint, number>` | 16 | 4.3.0 |
| itemRender | 自定义渲染（也可通过 `#item="{ item, index }"` 插槽自定义） | ({ key, data, index, ... }) => VueNode \| slot | - | 4.3.0 |
| onLayoutChange | 布局变化回调（返回每项所在列） | (info: { key, column }[]) => void | - | 4.3.0 |
| fresh | 是否持续监听子项尺寸变化（`ResizeObserver`）；设为 `false` 可关闭逐项监听以提升大列表性能 | boolean | true | 4.3.0 |
| classNames | 语义化类名，支持对象或函数式写法 | `Record<'root' \| 'item', string>` \| `(info: { props }) => Record<'root' \| 'item', string>` | - | 4.3.0 |
| styles | 语义化样式，支持对象或函数式写法 | `Record<'root' \| 'item', CSSProperties>` \| `(info: { props }) => Record<'root' \| 'item', CSSProperties>` | - | 4.3.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |

### MasonryItemType

| 参数     | 说明                         | 类型             | 默认值 |
| -------- | ---------------------------- | ---------------- | ------ |
| key      | 唯一标识                     | string \| number | -      |
| column   | 指定列（不指定按最短列分配） | number           | -      |
| height   | 预估高度，减少首帧重排       | number           | -      |
| children | 自定义内容                   | VueNode          | -      |
| data     | 业务数据                     | any              | -      |

### MasonryRef

| 属性          | 说明            | 类型                     | 版本  |
| ------------- | --------------- | ------------------------ | ----- |
| nativeElement | 根节点 DOM 元素 | `HTMLDivElement \| null` | 4.3.0 |

### Semantic DOM

`classNames` 与 `styles` 支持以下语义化节点（均支持静态对象或 `(info: { props }) => ...` 函数形式）：

- `root`：瀑布流根容器节点
- `item`：单个瀑布流子项包裹节点
