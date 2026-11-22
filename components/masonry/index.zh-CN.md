---
category: Components
type: 布局
title: Masonry
subtitle: 瀑布流
---

瀑布流布局，把不等高的子项按「当前最短列」分配到多列中，支持响应式列数与间距。

## 何时使用

- 图片墙、卡片流等高度不一致的内容列表；
- 需要减少留白、让内容更紧凑地铺满多列时。

## API

### Masonry

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 数据源 | MasonryItemType[] | [] | 4.3.0 |
| columns | 列数，支持按断点配置 | number \| Record<Breakpoint, number> | 2 | 4.3.0 |
| gutter | 间距，支持数字、`[水平, 垂直]`、断点对象 | number \| [number, number] \| Record<Breakpoint, number> | 16 | 4.3.0 |
| itemRender | 自定义渲染 | ({ key, data, index, ... }) => VueNode | - | 4.3.0 |
| onLayoutChange | 布局变化回调（返回每项所在列） | (info: { key, column }[]) => void | - | 4.3.0 |
| fresh | 强制重新布局 | boolean | false | 4.3.0 |
| classNames | 语义化类名 `{ root, item }` | object | - | 4.3.0 |
| styles | 语义化样式 `{ root, item }` | object | - | 4.3.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |

### MasonryItemType

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识 | string \| number | - |
| column | 指定列（不指定按最短列分配） | number | - |
| height | 预估高度，减少首帧重排 | number | - |
| children | 自定义内容 | VueNode | - |
| data | 业务数据 | any | - |
