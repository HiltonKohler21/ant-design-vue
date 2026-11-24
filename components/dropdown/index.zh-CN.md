---
category: Components
subtitle: 下拉菜单
type: 导航
title: Dropdown
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*gTBySYX11WcAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*k619RJ_7bKEAAAAAAAAAAAAADrJ8AQ/original
---

向下弹出的列表。

## 何时使用

当页面上的操作命令过多时，用此组件可以收纳操作元素。点击或移入触点，会出现一个下拉菜单。可在列表中进行选择，并执行相应的命令。

- 用于收罗一组命令操作。
- Select 用于选择，而 Dropdown 是命令集合。

## API

### Dropdown

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| align | 该值将合并到 placement 的配置中，设置参考 [dom-align](https://github.com/yiminghe/dom-align) | Object | - |  |
| arrow | 下拉框箭头是否显示 | boolean \| { pointAtCenter: boolean } | false | 3.3.0 |
| autoAdjustOverflow | 下拉框被遮挡时自动调整位置 | boolean \| { adjustX?: 0 \| 1; adjustY?: 0 \| 1 } | true | 4.3.0 |
| classNames | 用于自定义 Dropdown 组件内部各语义化结构的 class，支持对象或函数 | `Record<SemanticDOM, string> \| (info: { props: DropdownProps }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| destroyOnHidden | 关闭后是否销毁 Dropdown（替代 `destroyPopupOnHide`） | boolean | false | 4.3.0 |
| ~~destroyPopupOnHide~~ | 关闭后是否销毁 Dropdown（已废弃，请使用 `destroyOnHidden`） | boolean | false | 3.0 |
| disabled | 菜单是否禁用 | boolean | - |  |
| ~~dropdownRender~~ | 自定义下拉框内容（已废弃，请使用 `popupRender`） | `(menus: VNode) => VNode` | - |  |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。 | Function(triggerNode) | `() => document.body` |  |
| menu | 菜单配置项 | [MenuProps](/components/menu-cn/#api) | - | 4.3.0 |
| open(v-model) | 菜单是否显示 | boolean | - | 4.0 |
| overlay(v-slot) | 菜单 | [Menu](/components/menu-cn) | - |  |
| ~~overlayClassName~~ | 下拉根元素的类名称，请使用 `classNames.root` 替换 | string | - |  |
| ~~overlayStyle~~ | 下拉根元素的样式，请使用 `styles.root` 替换 | object | - |  |
| placement | 菜单弹出位置：`bottomLeft` \| `bottom` \| `bottomRight` \| `topLeft` \| `top` \| `topRight` \| `left` \| `leftTop` \| `leftBottom` \| `right` \| `rightTop` \| `rightBottom` | string | `bottomLeft` | `left*` / `right*`: 4.3.0 |
| popupRender | 自定义下拉框内容（替代 `dropdownRender`） | `(menus: VNode) => VNode` | - | 4.3.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| styles | 用于自定义 Dropdown 组件内部各语义化结构的行内 style，支持对象或函数 | `Record<SemanticDOM, CSSProperties> \| (info: { props: DropdownProps }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| trigger | 触发下拉的行为, 移动端不支持 hover | Array&lt;`click` \| `hover` \| `contextmenu`> | `['hover']` |  |

> 语义化结构 `SemanticDOM` 支持：`root` \| `menu` \| `item` \| `itemTitle` \| `itemIcon` \| `itemContent`。

`overlay` 或 `menu` 使用 [Menu](/components/menu-cn/)，还包括菜单项 `Menu.Item`，分割线 `Menu.Divider`。

> 注意： Menu.Item 必须设置唯一的 key 属性。
>
> Dropdown 下的 Menu 默认不可选中。如果需要菜单可选中，可以指定 `<Menu selectable>` 或 `menu.selectable`。

### 事件

| 事件名称 | 说明 | 回调参数 | 版本 |
| --- | --- | --- | --- |
| openChange | 菜单显示状态改变时调用 | `(open: boolean, info: { source: 'trigger' \| 'menu' }) => void` | `info.source`: 4.3.0 |

### Dropdown.Button

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| buttonsRender | 自定义左右两个按钮 | `(buttons: VNode[]) => VNode[]` | - | 4.3.0 |
| disabled | 菜单是否禁用 | boolean | - |  |
| icon | 右侧的 icon | VNode \| slot | - | 1.5.0 |
| loading | 设置按钮载入状态 | boolean \| { delay: number } | false | 3.0 |
| menu | 菜单配置项 | [MenuProps](/components/menu-cn/#api) | - | 4.3.0 |
| open(v-model) | 菜单是否显示 | boolean | - |  |
| overlay(v-slot) | 菜单 | [Menu](/components/menu-cn/) | - |  |
| placement | 菜单弹出位置 | `bottomLeft` \| `bottom` \| `bottomRight` \| `topLeft` \| `top` \| `topRight` \| `left` \| `leftTop` \| `leftBottom` \| `right` \| `rightTop` \| `rightBottom` | `bottomLeft` |  |
| size | 按钮大小，和 [Button](/components/button-cn/) 一致 | string | 'default' |  |
| trigger | 触发下拉的行为 | Array&lt;`click` \| `hover` \| `contextmenu`> | `['hover']` |  |
| type | 按钮类型，和 [Button](/components/button-cn/) 一致 | string | 'default' |  |

### Dropdown.Button 事件

| 事件名称 | 说明 | 回调参数 | 版本 |
| --- | --- | --- | --- |
| click | 点击左侧按钮的回调，和 [Button](/components/button-cn/) 一致 | Function |  |
| openChange | 菜单显示状态改变时调用 | `(open: boolean, info: { source: 'trigger' \| 'menu' }) => void` | `info.source`: 4.3.0 |

## 注意

请确保 `Dropdown` 的子元素能接受 `mouseenter`、`mouseleave`、`focus`、`click` 事件。

## FAQ

### Dropdown 在水平方向超出屏幕时会被挤压该怎么办？

你可以通过 `width: max-content` 来解决这个问题。
