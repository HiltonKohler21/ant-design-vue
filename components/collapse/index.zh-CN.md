---
category: Components
type: 数据展示
title: Collapse
cols: 1
subtitle: 折叠面板
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*B7HKR5OBe8gAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*sir-TK0HkWcAAAAAAAAAAAAADrJ8AQ/original
---

可以折叠/展开的内容区域。

## 何时使用

- 对复杂区域进行分组和隐藏，保持页面的整洁。
- '手风琴' 是一种特殊的折叠面板，只允许单个内容区域展开。

## API

### Collapse

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| accordion | 手风琴模式，始终只有一个面板处在激活状态 | boolean | `false` |  |
| activeKey(v-model) | 当前激活 tab 面板的 key | string\[] \| string <br> number\[] \| number | 默认无，[手风琴模式](#components-collapse-demo-accordion)下默认第一个元素 |  |
| bordered | 带边框风格的折叠面板 | boolean | `true` |  |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| collapsible | 所有子面板是否可折叠或指定可折叠触发区域 | `header` \| `icon` \| `disabled` | - | 4.0 |
| defaultActiveKey | 初始化选中面板的 key | string\[] \| string <br> number\[] \| number | - |  |
| ~~destroyInactivePanel~~ | 销毁折叠隐藏的面板（已废弃，请使用 `destroyOnHidden`） | boolean | `false` |  |
| destroyOnHidden | 销毁折叠隐藏的面板 | boolean | `false` | 4.3.0 |
| expandIcon | 自定义切换图标 | Function(props):VNode \| slot="expandIcon" slot-scope="props" \| #expandIcon="props" | - |  |
| expandIconPlacement | 设置展开图标位置 | `start` \| `end` | `start` | 4.3.0 |
| ~~expandIconPosition~~ | 设置图标位置，请使用 `expandIconPlacement` 替代 | `start` \| `end` \| `left` \| `right` | - | 4.0 |
| ghost | 使折叠面板透明且无边框 | boolean | false | 3.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| size | 设置折叠面板大小 | `large` \| `middle` \| `small` | `middle` | 4.3.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |

> 语义化结构 `SemanticDOM` 支持：`root` \| `header` \| `title` \| `body` \| `icon`。

### 事件

| 事件名称 | 说明           | 回调参数      | 版本 |
| -------- | -------------- | ------------- | ---- |
| change   | 切换面板的回调 | function(key) |      |

### Collapse.Panel

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| collapsible | 是否可折叠或指定可折叠触发区域 | `header` \| `disabled` | - | 3.0 |
| ~~disabled~~ | 禁用后的面板展开与否将无法通过用户交互改变（已废弃，请使用 `collapsible="disabled"`） | boolean | `false` |  |
| extra | 自定义渲染每个面板右上角的内容 | VNode \| slot | - | 1.5.0 |
| forceRender | 被隐藏时是否渲染 DOM 结构 | boolean | false |  |
| header | 面板头内容 | string \| slot | - |  |
| key | 对应 activeKey | string \| number | - |  |
| showArrow | 是否展示当前面板上的箭头 | boolean | `true` |  |
