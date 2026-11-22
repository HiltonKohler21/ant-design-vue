---
category: Components
type: 数据展示
title: Listy
subtitle: 列表
---

轻量列表容器，内置行 hover、分隔线与可选虚拟滚动。

## 何时使用

- 需要展示中等规模的行式数据（消息、日志、选项等）；
- 数据量较大、需要虚拟滚动时（传 `height` + `itemHeight` 或 `virtual`）。

## API

### Listy

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| data | 数据源 | any[] | [] | 4.3.0 |
| itemRender | 自定义渲染 | (item, index) => VueNode | - | 4.3.0 |
| itemKey | 行 key（字段名或函数） | string \| (item) => Key | - | 4.3.0 |
| height | 列表高度（虚拟滚动必填） | number | - | 4.3.0 |
| itemHeight | 行高（虚拟滚动必填） | number | - | 4.3.0 |
| virtual | 是否虚拟滚动，未指定时有 height + itemHeight 即开启 | boolean | - | 4.3.0 |
| rowHoverable | 行 hover 背景 | boolean | true | 4.3.0 |
| classNames | 语义化类名 `{ root, item }` | object | - | 4.3.0 |
| styles | 语义化样式 `{ root, item }` | object | - | 4.3.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| onScroll | 滚动回调 | (e: UIEvent) => void | - | 4.3.0 |

### 实例方法

| 方法 | 说明 |
| --- | --- |
| scrollTo({ index, align, offset }) | 滚动到指定项 |
| scrollToIndex(index) | 滚动到指定下标 |
