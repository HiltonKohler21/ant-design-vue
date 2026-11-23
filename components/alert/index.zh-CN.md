---
category: Components
type: 反馈
title: Alert
subtitle: 警告提示
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Ct7bT7rrTTAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*-U3XQqYN7VsAAAAAAAAAAAAADrJ8AQ/original
---

警告提示，展现需要关注的信息。

## 何时使用

- 当某个页面需要向用户显示警告的信息时。
- 非浮层的静态展现形式，始终展现，不会自动消失，用户可以点击关闭。

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| action | 自定义操作项 | VueNode \| slot | - | 4.0.0（prop: 4.3.0） |
| ~~afterClose~~ | 关闭动画结束后触发的回调函数，请使用 `closable.afterClose` 替代 | () => void | - |  |
| banner | 是否用作顶部公告 | boolean | `false` |  |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| closable | 关闭按钮配置 | boolean \| [ClosableType](#closabletype) | `false` | 4.3.0 |
| ~~closeIcon~~ | 自定义关闭 Icon，请使用 `closable.closeIcon` 替代 | VueNode \| slot | `<CloseOutlined />` | 3.0 |
| ~~closeText~~ | 自定义关闭按钮，请使用 `closable.closeIcon` 替代 | string \| slot | - |  |
| description | 警告提示的辅助性文字介绍 | VueNode \| slot | - |  |
| icon | 自定义图标，`showIcon` 为 `true` 时有效 | VueNode \| slot | - |  |
| ~~message~~ | 警告提示内容，请使用 `title` 替代 | VueNode \| slot | - |  |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| showIcon | 是否显示辅助图标 | boolean | `false`，`banner` 模式下默认值为 `true` |  |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| title | 警告提示内容 | VueNode \| slot | - | 4.3.0 |
| type | 指定警告提示的样式，有四种选择 `success`、`info`、`warning`、`error` | `success` \| `info` \| `warning` \| `error` | `info`，`banner` 模式下默认值为 `warning` |  |
| variant | 警告提示形态变体 | `outlined` \| `filled` | `outlined` | 4.3.0 |

> 语义化结构 `SemanticDOM` 支持：`root` \| `icon` \| `section` \| `title` \| `description` \| `actions` \| `close`。

### ClosableType

| 参数       | 说明                         | 类型                    | 默认值  | 版本  |
| ---------- | ---------------------------- | ----------------------- | ------- | ----- |
| afterClose | 关闭动画结束后触发的回调函数 | () => void              | -       | 4.3.0 |
| closeIcon  | 自定义关闭图标               | VueNode                 | -       | 4.3.0 |
| disabled   | 是否禁用关闭按钮             | boolean                 | `false` | 4.3.0 |
| onClose    | 关闭时触发的回调函数         | (e: MouseEvent) => void | -       | 4.3.0 |

### 事件

| 事件名称 | 说明                                                | 回调参数                | 版本 |
| -------- | --------------------------------------------------- | ----------------------- | ---- |
| close    | 关闭时触发的回调函数（推荐使用 `closable.onClose`） | (e: MouseEvent) => void | -    |

### Alert.ErrorBoundary

用于捕获子组件渲染异常并展示错误提示（全局注册标签为 `<a-alert-error-boundary>`）。

| 参数        | 说明                                | 类型            | 默认值        | 版本  |
| ----------- | ----------------------------------- | --------------- | ------------- | ----- |
| description | 自定义错误描述内容                  | VueNode \| slot | `error.stack` | 4.3.0 |
| ~~message~~ | 自定义错误标题，请使用 `title` 替代 | VueNode \| slot | `error`       | 4.3.0 |
| title       | 自定义错误标题                      | VueNode \| slot | `error`       | 4.3.0 |
