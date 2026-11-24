---
category: Components
type: 数据展示
title: Tooltip
subtitle: 文字提示
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*9LKlRbWytugAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*bCbPTJ7LQngAAAAAAAAAAAAADrJ8AQ/original
---

简单的文字提示气泡框。

## 何时使用

- 鼠标移入则显示提示，移出消失，气泡浮层不承载复杂文本和操作。
- 可用来代替系统默认的 `title` 提示，提供一个 `按钮/文字/操作` 的文案解释。
- 使用 `Tooltip.UniqueProvider`（`<a-tooltip-unique-provider>`）包裹相邻的多个 Tooltip，可共享同一个浮层容器并平滑过渡切换（自 `4.3.0` 版本起支持）。

## API

| 参数  | 说明     | 类型           | 默认值 | 版本 |
| ----- | -------- | -------------- | ------ | ---- |
| title | 提示文字 | string \| slot | -      |      |

### 共同的 API

以下 API 为 Tooltip、Popconfirm、Popover 共享的 API。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| align | 该值将合并到 placement 的配置中，设置参考 [dom-align](https://github.com/yiminghe/dom-align) | Object | - |  |
| arrowPointAtCenter | 箭头是否指向目标元素中心 | boolean | `false` |  |
| arrow | 修改箭头的显示状态以及修改箭头是否指向目标元素中心 | boolean \| { pointAtCenter: boolean } | `true` | 4.2.0 |
| autoAdjustOverflow | 气泡被遮挡时自动调整位置 | boolean | `true` |  |
| classNames | 语义化结构 class，支持静态对象或函数 | `{ root?: string; container?: string; body?: string; arrow?: string }` \| `(info: { props: TooltipProps }) => ...` | - | 4.3.0 |
| color | 背景颜色 | string | - |  |
| defaultOpen | 默认是否显隐 | boolean | false | 4.3.0 |
| destroyOnHidden | 隐藏后是否销毁 tooltip | boolean | false | 4.3.0 |
| destroyTooltipOnHide | 隐藏后是否销毁 tooltip（已废弃，请使用 `destroyOnHidden`） | boolean | false |  |
| getPopupContainer | 浮层渲染父节点，默认渲染到 body 上 | (triggerNode: HTMLElement) => HTMLElement | () => document.body |  |
| mouseEnterDelay | 鼠标移入后延时多少才显示 Tooltip，单位：秒 | number | 0.1 |  |
| mouseLeaveDelay | 鼠标移出后延时多少才隐藏 Tooltip，单位：秒 | number | 0.1 |  |
| open(v-model) | 用于手动控制浮层显隐，小于 4.0.0 使用 `visible` | boolean | false | 4.0 |
| overlayClassName | 卡片类名 | string | - |  |
| overlayStyle | 卡片样式 | object | - |  |
| overlayInnerStyle | 卡片内容区域样式 | object | - | 4.0 |
| placement | 气泡框位置，可选 `top` `left` `right` `bottom` `topLeft` `topRight` `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom` | string | top |  |
| rootClassName | 根节点 className | string | - | 4.3.0 |
| styles | 语义化结构 style，支持静态对象或函数 | `{ root?: CSSProperties; container?: CSSProperties; body?: CSSProperties; arrow?: CSSProperties }` \| `(info: { props: TooltipProps }) => ...` | - | 4.3.0 |
| trigger | 触发行为，可选 `hover/focus/click/contextmenu` | string | hover |  |

### Tooltip.UniqueProvider

> 自 `4.3.0` 版本开始提供。

为内部的多个兄弟 `<a-tooltip>` 提供共享浮层上下文，同一时间仅显示一个浮层并在触发节点之间平滑过渡移动。

### 事件

| 事件名称        | 说明                         | 回调参数                | 版本  |
| --------------- | ---------------------------- | ----------------------- | ----- |
| afterOpenChange | 显示隐藏的回调（动画结束后） | (open: boolean) => void | 4.3.0 |
| openChange      | 显示隐藏的回调               | (open: boolean) => void | 4.0   |

### 方法

| 名称         | 说明                                           | 版本  |
| ------------ | ---------------------------------------------- | ----- |
| forceAlign() | 手动触发重新对齐（如异步加载数据或布局变化后） | 4.3.0 |

## 注意

请确保 `Tooltip` 的子元素能接受 `mouseenter`、`mouseleave`、`focus`、`click` 事件。
