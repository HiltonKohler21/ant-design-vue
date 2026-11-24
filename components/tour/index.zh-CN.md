---
category: Components
type: 数据展示
title: Tour
subtitle: 漫游式引导
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*NMvqRZpuJfQAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*D70qQJJmzhgAAAAAAAAAAAAADrJ8AQ/original
---

用于分步引导用户了解产品功能的气泡组件。自 `4.0.0` 版本开始提供该组件。

## 何时使用

常用于引导用户了解产品功能。

## API

### Tour

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actionsRender | 自定义操作按钮渲染 | `(originNode: VueNode, info: { current: number; total: number }) => VueNode` | - | 4.3.0 |
| arrow | 是否显示箭头，包含是否指向元素中心的配置 | `boolean` \| `{ pointAtCenter: boolean }` | `true` |  |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `Record<SemanticDOM, string> \| (info: { props: TourProps }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| closeIcon | 自定义关闭按钮 | `VueNode \| boolean` | `true` | 4.3.0 |
| current(v-model) | 当前处于哪一步 | `number` | - |  |
| disabledInteraction | 禁用高亮区域交互 | `boolean` | `false` | 4.3.0 |
| gap | 控制高亮区域的圆角边框和显示间距 | `{ offset?: number \| [number, number]; radius?: number }` | `{ offset: 6, radius: 2 }` | 数组类型 `offset`: 4.3.0 |
| getPopupContainer | 设置 Tour 浮层的渲染节点，默认是 body | `(node: HTMLElement) => HTMLElement` | `() => document.body` | 4.3.0 |
| indicatorsRender | 自定义指示器 | `(current: number, total: number) => VueNode` \| `v-slot:indicatorsRender="{current, total}"` | - | 4.3.0 |
| keyboard | 是否启用键盘快捷行为（方向左/右切换步骤，Escape 关闭引导） | `boolean` | `true` | 4.3.0 |
| mask | 是否启用蒙层，也可传入配置改变蒙层样式和填充色 | `boolean` \| `{ style?: CSSProperties; color?: string; }` | `true` |  |
| open | 打开引导 | `boolean` | - |  |
| placement | 引导卡片相对于目标元素的位置 | `center` `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | `bottom` |  |
| rootClassName | 根节点 className | `string` | - | 4.3.0 |
| scrollIntoViewOptions | 是否支持当前元素滚动到视窗内，也可传入配置指定滚动视窗的相关参数 | `boolean` \| `ScrollIntoViewOptions` | `true` |  |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `Record<SemanticDOM, CSSProperties> \| (info: { props: TourProps }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| type | 类型，影响底色与文字颜色 | `default` \| `primary` | `default` |  |
| zIndex | Tour 的层级 | `number` | `1001` |  |

> 语义化结构 `SemanticDOM` 支持：`root` \| `mask` \| `section` \| `cover` \| `close` \| `header` \| `title` \| `description` \| `footer` \| `actions` \| `indicators` \| `indicator`。

### Tour events

| 事件名称 | 说明                                   | 回调参数                    | 版本 |
| -------- | -------------------------------------- | --------------------------- | ---- |
| close    | 关闭引导时的回调函数                   | `(current: number) => void` |      |
| finish   | 引导完成时的回调                       | `() => void`                |      |
| change   | 步骤改变时的回调，current 为当前的步骤 | `(current: number) => void` |      |

### TourStep 引导步骤卡片

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actionsRender | 自定义操作按钮渲染，覆盖 Tour 的 `actionsRender` | `(originNode: VueNode, info: { current: number; total: number }) => VueNode` | - | 4.3.0 |
| arrow | 是否显示箭头，包含是否指向元素中心的配置 | `boolean` \| `{ pointAtCenter: boolean }` | `true` |  |
| closeIcon | 自定义关闭按钮 | `VueNode \| boolean` | `true` | 4.3.0 |
| cover | 展示的图片或者视频 | `VueNode` | - |  |
| description | 主要描述部分 | `VueNode` | - |  |
| mask | 是否启用蒙层，也可传入配置改变蒙层样式和填充色，默认跟随 Tour 的 `mask` 属性 | `boolean` \| `{ style?: CSSProperties; color?: string; }` | `true` |  |
| nextButtonProps | 下一步按钮的属性 | `{ children: VueNode; onClick: Function; className?: string; style?: CSSProperties }` | - |  |
| placement | 引导卡片相对于目标元素的位置 | `center` `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | `bottom` |  |
| prevButtonProps | 上一步按钮的属性 | `{ children: VueNode; onClick: Function; className?: string; style?: CSSProperties }` | - |  |
| scrollIntoViewOptions | 是否支持当前元素滚动到视窗内，也可传入配置指定滚动视窗的相关参数，默认跟随 Tour 的 `scrollIntoViewOptions` 属性 | `boolean` \| `ScrollIntoViewOptions` | `true` |  |
| target | 获取引导卡片指向的元素，为空时居中于屏幕 | `() => HTMLElement` \| `HTMLElement` | - |  |
| title | 标题 | `VueNode` | - |  |
| type | 类型，影响底色与文字颜色 | `default` \| `primary` | `default` |  |

### TourStep events

| 事件名称 | 说明                 | 回调参数   | 版本 |
| -------- | -------------------- | ---------- | ---- |
| close    | 关闭引导时的回调函数 | `Function` |      |
