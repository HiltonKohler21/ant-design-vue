---
category: Components
type: 反馈
title: Popconfirm
subtitle: 气泡确认框
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*a7tqQ6wrdeAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*iwYsQpeFcB0AAAAAAAAAAAAADrJ8AQ/original
---

点击元素，弹出气泡式的确认框。

## 何时使用

目标元素的操作需要用户进一步的确认时，在目标元素附近弹出浮层提示，询问用户。和 `confirm` 弹出的全屏居中模态对话框相比，交互形式更轻量。

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| cancelButton | 完全自定义取消按钮 | slot | - | 3.0 |
| cancelButtonProps | cancel 按钮 props | [ButtonProps](/components/button-cn/#api) | - |  |
| cancelText | 取消按钮文字 | string \| slot | `取消` |  |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| defaultOpen | 默认是否显隐 | boolean | `false` | 4.3.0 |
| description | 确认内容的详细描述 | string \| slot \| () => VueNode | - | 4.0 |
| disabled | 阻止点击 Popconfirm 子元素时弹出确认框 | boolean | `false` |  |
| icon | 自定义弹出气泡 Icon 图标 | VueNode \| slot \| null | `<ExclamationCircleFilled />` |  |
| okButton | 完全自定义确认按钮 | slot | - | 3.0 |
| okButtonProps | ok 按钮 props | [ButtonProps](/components/button-cn/#api) | - |  |
| okText | 确认按钮文字 | string \| slot | `确定` |  |
| okType | 确认按钮类型 | string | `primary` |  |
| open (v-model) | 是否显示 | boolean | `false` | 4.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| showCancel | 是否显示取消按钮 | boolean | `true` | 3.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| title | 确认框标题 | string \| slot \| () => VueNode | - |  |

> 语义化结构 `SemanticDOM` 支持：`root` \| `container` \| `body`（`container` 别名） \| `title` \| `content` \| `arrow` \| `icon`（`4.3.0`）。

### 事件

| 事件名称   | 说明             | 回调参数       | 版本 |
| ---------- | ---------------- | -------------- | ---- |
| cancel     | 点击取消的回调   | function(e)    |      |
| confirm    | 点击确认的回调   | function(e)    |      |
| openChange | 显示隐藏的回调   | function(open) | 4.0  |
| popupClick | 弹出气泡点击事件 | function(e)    |      |

更多属性请参考 [Tooltip](/components/tooltip-cn/#api)。

## 主题变量（Design Token）

| Token 名称  | 描述           | 类型   | 默认值                 |
| ----------- | -------------- | ------ | ---------------------- |
| zIndexPopup | 确认框 z-index | number | `zIndexPopupBase + 60` |

## 注意

请确保 `Popconfirm` 的子元素能接受 `mouseenter`、`mouseleave`、`focus`、`click` 事件。
