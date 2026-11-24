---
category: Components
type: 数据展示
title: Timeline
subtitle: 时间轴
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*FkTySqNt3sYAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*yIl9S4hAIBcAAAAAAAAAAAAADrJ8AQ/original
---

垂直展示的时间流信息。

## 何时使用

- 当有一系列信息需按时间排列时，可正序和倒序。
- 需要有一条时间轴进行视觉上的串联时。

## API

```html
<a-timeline>
  <a-timeline-item>创建服务现场 2015-09-01</a-timeline-item>
  <a-timeline-item>初步排除网络异常 2015-09-01</a-timeline-item>
  <a-timeline-item>技术测试异常 2015-09-01</a-timeline-item>
  <a-timeline-item>网络异常正在修复 2015-09-01</a-timeline-item>
</a-timeline>
```

### Timeline

时间轴。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record<SemanticDOM, string> \| (info: { props: TimelineProps }) => Record<SemanticDOM, string> | - | 4.3.0 |
| items | 选项配置 | [TimelineItemType\[\]](#timelineitemtype) | - | 4.3.0 |
| mode | 通过设置 `mode` 可以改变时间轴和内容的相对位置 | `left` \| `alternate` \| `right` \| `start` \| `end` | `start` |  |
| orientation | 时间轴方向 | `vertical` \| `horizontal` | `vertical` | 4.3.0 |
| ~~pending~~ | 指定最后一个幽灵节点是否存在或内容，请使用 `item.loading` 代替 | boolean \| string \| slot | false |  |
| ~~pendingDot~~ | 当最后一个幽灵节点存在时，指定其时间图点，请使用 `item.icon` 代替 | string \| slot | `<LoadingOutlined />` |  |
| reverse | 节点排序 | boolean | false |  |
| rootClassName | 根节点 className | string | - | 4.3.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record<SemanticDOM, CSSProperties> \| (info: { props: TimelineProps }) => Record<SemanticDOM, CSSProperties> | - | 4.3.0 |
| titleSpan | 自定义标题/标签区域宽度（数字表示 24 栅格占比，字符串表示具体 CSS 长度或百分比） | number \| string | - | 4.3.0 |
| variant | 节点视觉变体 | `outlined` \| `filled` | `outlined` | 4.3.0 |

> 语义化结构 `SemanticDOM` 支持：`root` \| `item` \| `itemWrapper` \| `itemIcon` \| `itemSection` \| `itemHeader` \| `itemTitle` \| `itemContent` \| `itemRail`。

### TimelineItemType

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| ~~children~~ | 节点内容（`content` 的别名） | string \| VNode | - | 4.3.0 |
| class | 节点自定义类名 | string | - | 4.3.0 |
| classNames | 用于自定义当前时间节点各语义化结构的 class | Record<`root` \| `wrapper` \| `icon` \| `section` \| `header` \| `title` \| `content` \| `rail`, string> | - | 4.3.0 |
| color | 指定圆圈颜色 `blue, red, green, gray`，或自定义的色值 | string | `blue` | 4.3.0 |
| content | 节点内容 | string \| VNode | - | 4.3.0 |
| ~~dot~~ | 自定义时间轴点（`icon` 的别名） | string \| VNode | - | 4.3.0 |
| icon | 自定义节点图标 | string \| VNode | - | 4.3.0 |
| key | 唯一标识 | string \| number | - | 4.3.0 |
| ~~label~~ | 设置标签（`title` 的别名） | string \| VNode | - | 4.3.0 |
| loading | 节点是否为加载状态 | boolean | false | 4.3.0 |
| placement | 自定义节点位置 | `start` \| `end` | - | 4.3.0 |
| ~~position~~ | 自定义节点位置（`placement` 的别名） | `left` \| `right` \| `start` \| `end` | - | 4.3.0 |
| style | 节点行内样式 | CSSProperties | - | 4.3.0 |
| styles | 用于自定义当前时间节点各语义化结构的行内 style | Record<`root` \| `wrapper` \| `icon` \| `section` \| `header` \| `title` \| `content` \| `rail`, CSSProperties> | - | 4.3.0 |
| title | 设置标题/标签 | string \| VNode | - | 4.3.0 |

### Timeline.Item

时间轴的每一个节点。

| 参数     | 说明                                            | 类型              | 默认值 | 版本 |
| -------- | ----------------------------------------------- | ----------------- | ------ | ---- |
| color    | 指定圆圈颜色 `blue, red, green`，或自定义的色值 | string            | blue   |      |
| dot      | 自定义时间轴点                                  | string\|slot      | -      |      |
| label    | 设置标签                                        | string \| slot    | -      | 3.0  |
| position | 自定义节点位置                                  | `left` \| `right` | -      |      |
