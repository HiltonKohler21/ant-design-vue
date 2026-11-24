---
category: Components
subtitle: 悬浮按钮
type: 通用
title: FloatButton
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*tXAoQqyr-ioAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*hSAwR7cnabwAAAAAAAAAAAAADrJ8AQ/original
---

悬浮按钮。自 `4.0.0` 版本开始提供该组件。

## 何时使用

- 用于网站上的全局功能；
- 无论浏览到何处都可以看见的按钮。

## API

> 自 `ant-design-vue@4.0.0` 版本开始提供该组件。

### 共同的 API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| backTop | 点击是否回到顶部 | boolean | false | 4.3.0 |
| badge | 带徽标数字的悬浮按钮（不支持 status 以及相关属性） | [BadgeProps](/components/badge-cn#api) | - |  |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `FloatButtonClassNamesType` | - | 4.3.0 |
| content | 文字及其它内容（替代 `description`） | string \| slot | - | 4.3.0 |
| ~~description~~ | 文字及其它内容（已废弃，请使用 `content`） | string \| slot | - |  |
| disabled | 是否禁用按钮 | boolean | false | 4.3.0 |
| href | 点击跳转的地址，指定此属性 button 的行为和 a 链接一致 | string | - |  |
| htmlType | 设置 `button` 原生的 `type` 值，可选值请参考 [HTML 标准](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type) | `'submit'` \| `'reset'` \| `'button'` | `'button'` | 4.3.0 |
| icon | 自定义图标 | VueNode \| slot | - | prop: 4.3.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| shape | 设置按钮形状 | `circle` \| `square` | `circle` |  |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `FloatButtonStylesType` | - | 4.3.0 |
| target | 相当于 a 标签的 target 属性，href 存在时生效 | string | - |  |
| tooltip | 气泡卡片的内容 | VueNode \| [TooltipProps](/components/tooltip-cn#api) \| slot | - | TooltipProps: 4.3.0 |
| type | 设置按钮类型 | `default` \| `primary` | `default` |  |

### 共同的事件

| 事件名称 | 说明             | 回调参数          | 版本 |
| -------- | ---------------- | ----------------- | ---- |
| click    | 点击按钮时的回调 | `(event) => void` |      |

### FloatButton.Group

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `FloatButtonGroupClassNamesType` | - | 4.3.0 |
| closeIcon | 自定义关闭按钮图标 | VueNode \| slot | `<CloseOutlined />` | prop: 4.3.0 |
| items | 配置式子按钮列表 | [FloatButtonProps](#共同的-api)\[] | - | 4.3.0 |
| open(v-model) | 受控展开，需配合 `trigger` 一起使用 | boolean | - |  |
| placement | 自定义菜单弹出位置 | `top` \| `right` \| `bottom` \| `left` | `top` | 4.3.0 |
| shape | 设置包含的 FloatButton 按钮形状 | `circle` \| `square` | `circle` |  |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `FloatButtonGroupStylesType` | - | 4.3.0 |
| trigger | 触发方式（有触发方式为菜单模式） | `click` \| `hover` | - |  |

### FloatButton.Group 事件

| 事件名称   | 说明                             | 回调参数                  | 版本  |
| ---------- | -------------------------------- | ------------------------- | ----- |
| click      | 点击按钮时的回调（仅菜单模式）   | `(event) => void`         | 4.3.0 |
| openChange | 展开收起时的回调，需配合 trigger | `(open: boolean) => void` |       |

### FloatButton.BackTop

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| duration | 回到顶部所需时间（ms）；开启“减弱动态效果”（`prefers-reduced-motion: reduce`）时不生效 | number | 450 |  |
| showProgress | 在 BackTop 按钮边缘展示当前滚动进度环 | boolean | false | 4.3.0 |
| target | 设置需要监听其滚动事件的元素 | () => HTMLElement | () => window |  |
| visibilityHeight | 滚动高度达到此参数值才出现 BackTop | number | 400 |  |

### FloatButton.BackTop 事件

| 事件名称 | 说明               | 回调参数          | 版本 |
| -------- | ------------------ | ----------------- | ---- |
| click    | 点击按钮的回调函数 | `(event) => void` |      |

## Semantic DOM

`classNames` 与 `styles` 支持静态对象或 `(info: { props }) => ...` 函数形式，支持以下语义化键名：

- **FloatButton**: `root` / `icon` / `content`
- **FloatButton.Group**: `root` / `list` / `item` / `itemIcon` / `itemContent` / `trigger` / `triggerIcon` / `triggerContent`
