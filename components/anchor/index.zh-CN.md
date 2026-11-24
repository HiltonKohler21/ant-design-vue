---
category: Components
subtitle: 锚点
cols: 1
type: 导航
title: Anchor
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ufP1TLS5VvIAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*_9_eTrgvHNQAAAAAAAAAAAAADrJ8AQ/original
---

用于跳转到页面指定位置。

## 何时使用

需要展现当前页面上可供跳转的锚点链接，以及快速在锚点之间跳转。

## API

### Anchor Props

| 成员 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| affix | 固定模式 | boolean \| Omit<AffixProps, 'offsetTop' \| 'target' \| 'children'> | true | object: 4.3.0 |
| bounds | 锚点区域边界 | number | 5(px) |  |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record<SemanticDOM, string> \| (info: { props: AnchorProps }) => Record<SemanticDOM, string> | - | 4.3.0 |
| customTitle | 使用插槽自定义选项 title | v-slot="AnchorItem" | - | 4.0 |
| direction | 设置导航方向 | `vertical` \| `horizontal` | `vertical` | 4.0 |
| getContainer | 指定滚动的容器 | () => HTMLElement | () => window |  |
| getCurrentAnchor | 自定义高亮的锚点 | (activeLink: string) => string | - | activeLink(3.3) |
| items | 数据化配置选项内容，支持通过 children 嵌套 | { key, href, title, target, children, replace, targetOffset }\[] [具体见](#anchoritem) | - | 4.0 |
| offsetBottom | 距离窗口底部达到指定偏移量后触发 | number | - |  |
| offsetTop | 距离窗口顶部达到指定偏移量后触发 | number | - |  |
| replace | 替换浏览器历史记录中项目的 href 而不是推送它 | boolean | false | 4.3.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| showInkInFixed | `:affix="false"` 时是否显示小方块 | boolean | false |  |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record<SemanticDOM, CSSProperties> \| (info: { props: AnchorProps }) => Record<SemanticDOM, CSSProperties> | - | 4.3.0 |
| targetOffset | 锚点滚动偏移量，默认与 offsetTop 相同，[例子](#components-anchor-demo-targetoffset) | number | `offsetTop` | 1.5.0 |
| wrapperClass | 容器的类名 | string | - |  |
| wrapperStyle | 容器样式 | object | - |  |

> 语义化结构 `SemanticDOM` 支持：`root` \| `item` \| `itemTitle` \| `indicator`。

### AnchorItem

| 成员 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| key | 唯一标志 | string \| number | - |  |
| href | 锚点链接 | string | - |  |
| target | 该属性指定在何处显示链接的资源 | string | - |  |
| title | 文字内容 | VueNode \| (item: AnchorItem) => VueNode | - |  |
| children | 嵌套的 Anchor Link，`注意：水平方向该属性不支持` | [AnchorItem](#anchoritem)\[] | - |  |
| replace | 替换浏览器历史记录中的项目 href 而不是推送它 | boolean | false | 4.3.0 |
| targetOffset | 设置单个锚点的滚动偏移量，会覆盖 Anchor 组件的 targetOffset 属性 | number | - | 4.3.0 |

### 事件

| 事件名称 | 说明                   | 回调参数                              | 版本  |
| -------- | ---------------------- | ------------------------------------- | ----- |
| change   | 监听锚点链接改变       | (currentActiveLink: string) => void   | 1.5.0 |
| click    | `click` 事件的 handler | Function(e: MouseEvent, link: Object) |       |

### Link Props

| 成员 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| href | 锚点链接 | string | - |  |
| replace | 替换浏览器历史记录中的项目 href 而不是推送它 | boolean | false | 4.3.0 |
| target | 该属性指定在何处显示链接的资源。 | string | - | 1.5.0 |
| targetOffset | 设置单个锚点的滚动偏移量，会覆盖 Anchor 组件的 targetOffset 属性 | number | - | 4.3.0 |
| title | 文字内容 | string \| slot | - |  |
