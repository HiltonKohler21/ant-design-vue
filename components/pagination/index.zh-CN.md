---
category: Components
subtitle: 分页
type: 导航
title: Pagination
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*8y_iTJGY_aUAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*WM86SrBC8TsAAAAAAAAAAAAADrJ8AQ/original
---

采用分页的形式分隔长列表，每次只加载一个页面。

## 何时使用

- 当加载/渲染所有数据将花费很多时间时；
- 可切换页码浏览数据。

## API

```html
<a-pagination @change="onChange" :total="50" />
```

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| align | 对齐方式 | `start` \| `center` \| `end` | - | 4.3.0 |
| classNames | 自定义组件内部各语义化结构的类名，支持对象或函数 | Record<SemanticDOM, string> \| (info: { props: PaginationProps }) => Record<SemanticDOM, string> | - | 4.3.0 |
| components | 自定义内部组件 | { sizeChanger?: Component } | - | 4.3.0 |
| current(v-model) | 当前页数 | number | - |  |
| defaultCurrent | 默认的当前页数 | number | 1 |  |
| defaultPageSize | 默认的每页条数 | number | 10 |  |
| disabled | 禁用分页 | boolean | - | 1.5.0 |
| hideOnSinglePage | 只有一页时是否隐藏分页器 | boolean | false |  |
| itemRender | 用于自定义页码的结构，可用于优化 SEO | ({page, type: 'page' \| 'prev' \| 'next', originalElement}) => vNode \| v-slot | - |  |
| pageSize(v-model) | 每页条数 | number | - |  |
| pageSizeOptions | 指定每页可以显示多少条 | string\[] \| number\[] | \['10', '20', '50', '100'] |  |
| responsive | 当 size 未指定时，根据屏幕宽度自动调整尺寸 | boolean | - | 3.1 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| showLessItems | 是否显示较少页面内容 | boolean | false | 1.5.0 |
| showQuickJumper | 是否可以快速跳转至某页 | boolean \| { goButton: VueNode } | false |  |
| showSizeChanger | 是否展示 `pageSize` 切换器，当 `total` 大于 50 时默认为 true | boolean \| [SelectProps](/components/select-cn/#api) | - | SelectProps: 4.3.0 |
| showTitle | 是否显示原生 tooltip 页码提示 | boolean | true | 1.5.0 |
| showTotal | 用于显示数据总量和当前数据顺序 | Function(total, range) | - |  |
| simple | 当添加该属性时，显示为简单分页 | boolean \| { readOnly?: boolean } | - | readOnly: 4.3.0 |
| size | 当为「small」时，是小尺寸分页 | `default` \| `small` \| `middle` \| `large` | "" |  |
| styles | 自定义组件内部各语义化结构的内联样式，支持对象或函数 | Record<SemanticDOM, CSSProperties> \| (info: { props: PaginationProps }) => Record<SemanticDOM, CSSProperties> | - | 4.3.0 |
| total | 数据总数 | number | 0 |  |
| totalBoundaryShowSizeChanger | 当 `total` 大于该值时默认展示 `pageSize` 切换器 | number | 50 |  |

> 语义化结构 `SemanticDOM` 支持：`root` \| `item`。

### 事件

| 事件名称 | 说明 | 回调参数 |  |
| --- | --- | --- | --- |
| change | 页码或 `pageSize` 改变的回调，参数是改变后的页码及每页条数 | Function(page, pageSize) | noop |
| showSizeChange | pageSize 变化的回调 | Function(current, size) | noop |
