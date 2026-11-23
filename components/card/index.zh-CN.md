---
category: Components
type: 数据展示
title: Card
subtitle: 卡片
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*VXtCTp93KPAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*a-8zR6rrupgAAAAAAAAAAAAADrJ8AQ/original
---

通用卡片容器。

## 何时使用

最基础的卡片容器，可承载文字、列表、图片、段落，常用于后台概览页面。

## API

### Card

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| activeTabKey | 当前激活页签的 key | string | - |  |
| ~~bodyStyle~~ | 内容区域自定义样式（已废弃，请使用 `styles.body`） | CSSProperties | - |  |
| ~~bordered~~ | 是否有边框（已废弃，请使用 `variant`） | boolean | `true` |  |
| classNames | 配置卡片内置模块的 className | { header?: string; body?: string; extra?: string; actions?: string; title?: string; cover?: string } | - | 4.3.0 |
| defaultActiveTabKey | 初始化选中页签的 key，如果没有设置 activeTabKey | string | 第一个页签 |  |
| extra | 卡片右上角的操作区域 | string \| slot | - |  |
| ~~headStyle~~ | 自定义标题区域样式（已废弃，请使用 `styles.header`） | CSSProperties | - |  |
| hoverable | 鼠标移过时可浮起 | boolean | `false` |  |
| loading | 当卡片内容还在加载中时，可以用 loading 展示一个占位 | boolean | `false` |  |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| size | card 的尺寸 | `default` \| `small` | `default` |  |
| styles | 配置卡片内置模块的 style | { header?: CSSProperties; body?: CSSProperties; extra?: CSSProperties; actions?: CSSProperties; title?: CSSProperties; cover?: CSSProperties } | - | 4.3.0 |
| tabList | 页签标题列表，可以通过 `customTab` (v3.0) 插槽自定义 tab | Array&lt;{ key: string; tab: any; disabled?: boolean }&gt; | - |  |
| tabProps | 透传给内部 [Tabs](/components/tabs-cn/#api) 的额外属性 | TabsProps | - | 4.3.0 |
| title | 卡片标题 | string \| slot | - |  |
| type | 卡片类型，可设置为 `inner` 或不设置 | `inner` | - |  |
| variant | 形态变体 | `outlined` \| `borderless` | `outlined` | 4.3.0 |

### Card 插槽

| 插槽名称           | 说明                       | 参数                      |
| ------------------ | -------------------------- | ------------------------- |
| actions            | 卡片操作组，位置在卡片底部 | -                         |
| cover              | 卡片封面                   | -                         |
| customTab          | 自定义 tabList tab 标签    | { item: tabList[number] } |
| extra              | 卡片右上角的操作区域       | -                         |
| tabBarExtraContent | tab bar 上额外的元素       | -                         |
| title              | 卡片标题                   | -                         |

### 事件

| 事件名称  | 说明           | 回调参数              | 版本 |
| --------- | -------------- | --------------------- | ---- |
| tabChange | 页签切换的回调 | (key: string) => void | -    |

### Card.Grid

| 参数      | 说明             | 类型    | 默认值 | 版本 |
| --------- | ---------------- | ------- | ------ | ---- |
| hoverable | 鼠标移过时可浮起 | boolean | `true` |      |

### Card.Meta

| 参数        | 说明      | 类型            | 默认值 | 版本 |
| ----------- | --------- | --------------- | ------ | ---- |
| avatar      | 头像/图标 | VueNode \| slot | -      |      |
| description | 描述内容  | string \| slot  | -      |      |
| title       | 标题内容  | string \| slot  | -      |      |
