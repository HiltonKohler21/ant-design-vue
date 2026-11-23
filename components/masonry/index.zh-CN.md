---
category: Components
type: 布局
title: Masonry
subtitle: 瀑布流
cols: 1
cover: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20180%20110%22%20fill%3D%22none%22%3E%3Crect%20x%3D%2220%22%20y%3D%2214%22%20width%3D%2242%22%20height%3D%2234%22%20rx%3D%226%22%20fill%3D%22%23e6f4ff%22%20stroke%3D%22%2391caff%22%2F%3E%3Crect%20x%3D%2220%22%20y%3D%2254%22%20width%3D%2242%22%20height%3D%2242%22%20rx%3D%226%22%20fill%3D%22%23f0f0f0%22%20stroke%3D%22%23e5e7eb%22%2F%3E%3Crect%20x%3D%2269%22%20y%3D%2214%22%20width%3D%2242%22%20height%3D%2248%22%20rx%3D%226%22%20fill%3D%22%231677ff%22%2F%3E%3Crect%20x%3D%2269%22%20y%3D%2268%22%20width%3D%2242%22%20height%3D%2228%22%20rx%3D%226%22%20fill%3D%22%23f0f0f0%22%20stroke%3D%22%23e5e7eb%22%2F%3E%3Crect%20x%3D%22118%22%20y%3D%2214%22%20width%3D%2242%22%20height%3D%2228%22%20rx%3D%226%22%20fill%3D%22%23f0f0f0%22%20stroke%3D%22%23e5e7eb%22%2F%3E%3Crect%20x%3D%22118%22%20y%3D%2248%22%20width%3D%2242%22%20height%3D%2248%22%20rx%3D%226%22%20fill%3D%22%23e6f4ff%22%20stroke%3D%22%2391caff%22%2F%3E%3C%2Fsvg%3E'
coverDark: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20180%20110%22%20fill%3D%22none%22%3E%3Crect%20x%3D%2220%22%20y%3D%2214%22%20width%3D%2242%22%20height%3D%2234%22%20rx%3D%226%22%20fill%3D%22%2315325b%22%20stroke%3D%22%2315417e%22%2F%3E%3Crect%20x%3D%2220%22%20y%3D%2254%22%20width%3D%2242%22%20height%3D%2242%22%20rx%3D%226%22%20fill%3D%22%23262626%22%20stroke%3D%22%23383838%22%2F%3E%3Crect%20x%3D%2269%22%20y%3D%2214%22%20width%3D%2242%22%20height%3D%2248%22%20rx%3D%226%22%20fill%3D%22%231668dc%22%2F%3E%3Crect%20x%3D%2269%22%20y%3D%2268%22%20width%3D%2242%22%20height%3D%2228%22%20rx%3D%226%22%20fill%3D%22%23262626%22%20stroke%3D%22%23383838%22%2F%3E%3Crect%20x%3D%22118%22%20y%3D%2214%22%20width%3D%2242%22%20height%3D%2228%22%20rx%3D%226%22%20fill%3D%22%23262626%22%20stroke%3D%22%23383838%22%2F%3E%3Crect%20x%3D%22118%22%20y%3D%2248%22%20width%3D%2242%22%20height%3D%2248%22%20rx%3D%226%22%20fill%3D%22%2315325b%22%20stroke%3D%22%2315417e%22%2F%3E%3C%2Fsvg%3E'
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
| columns | 列数，支持按断点配置 | number \| `Record<Breakpoint, number>` | 2 | 4.3.0 |
| gutter | 间距，支持数字、`[水平, 垂直]`、断点对象 | number \| `[number, number]` \| `Record<Breakpoint, number>` | 16 | 4.3.0 |
| itemRender | 自定义渲染 | ({ key, data, index, ... }) => VueNode | - | 4.3.0 |
| onLayoutChange | 布局变化回调（返回每项所在列） | (info: { key, column }[]) => void | - | 4.3.0 |
| fresh | 强制重新布局 | boolean | false | 4.3.0 |
| classNames | 语义化类名 `{ root, item }` | object | - | 4.3.0 |
| styles | 语义化样式 `{ root, item }` | object | - | 4.3.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |

### MasonryItemType

| 参数     | 说明                         | 类型             | 默认值 |
| -------- | ---------------------------- | ---------------- | ------ |
| key      | 唯一标识                     | string \| number | -      |
| column   | 指定列（不指定按最短列分配） | number           | -      |
| height   | 预估高度，减少首帧重排       | number           | -      |
| children | 自定义内容                   | VueNode          | -      |
| data     | 业务数据                     | any              | -      |
