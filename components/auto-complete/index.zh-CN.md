---
category: Components
subtitle: 自动完成
type: 数据录入
cols: 2
title: AutoComplete
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*g8THS4NpV6sAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*WERTQ6qvgEYAAAAAAAAAAAAADrJ8AQ/original
---

输入框自动完成功能。

## 何时使用

- 需要一个输入框而不是选择器。
- 需要输入建议/辅助提示。

和 Select 的区别是：

- AutoComplete 是一个带提示的文本输入框，用户可以自由输入，关键词是辅助**输入**。
- Select 是在限定的可选项中进行选择，关键词是**选择**。

## API

```html
<a-auto-complete v-model:value="value" :options="options" />
```

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 支持清除, 单选模式有效 | boolean | false |  |
| autofocus | 自动获取焦点 | boolean | false |  |
| backfill | 使用键盘选择选项的时候把选中项回填到输入框中 | boolean | false |  |
| ~~bordered~~ | 是否有边框（已废弃，请使用 `variant`） | boolean | true | 4.0 |
| classNames | 用于自定义组件内部各语义化结构的 class（支持对象与函数式 `({ props }) => ...`） | `{ root?: string; prefix?: string; suffix?: string; popup?: { root?: string } } \| ((info: { props: AutoCompleteProps }) => ...)` | - | 4.3.0 |
| clearIcon | 使用插槽自定义清除按钮 | slot | `<CloseCircleFilled />` | 4.0 |
| default (自定义输入框) | 自定义输入框 | slot | `<Input />` |  |
| defaultActiveFirstOption | 是否默认高亮第一个选项。 | boolean | true |  |
| defaultOpen | 是否默认展开下拉菜单 | boolean | - |  |
| defaultValue | 指定默认选中的条目 | string | - |  |
| disabled | 是否禁用 | boolean | false |  |
| ~~dropdownMatchSelectWidth~~ | 下拉菜单和选择器同宽（已废弃，请使用 `popupMatchSelectWidth`） | boolean \| number | true |  |
| dropdownMenuStyle | dropdown 菜单自定义样式 | object | - | 1.5.0 |
| ~~dropdownRender~~ | 自定义下拉框内容（已废弃，请使用 `popupRender`） | `({ menuNode, props }) => VNode` \| slot | - |  |
| ~~dropdownStyle~~ | 下拉菜单的 style 属性（已废弃，请使用 `styles.popup.root`） | CSSProperties | - |  |
| filterOption | 是否根据输入项进行筛选。当其为一个函数时，会接收 `inputValue` `option` 两个参数，当 `option` 符合筛选条件时，应返回 `true`，反之则返回 `false`。 | boolean \| function(inputValue, option) | true |  |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上 | function(triggerNode) | () => document.body |  |
| notFoundContent | 当下拉列表为空时显示的内容 | string \| slot | - |  |
| open | 是否展开下拉菜单 | boolean | - |  |
| option | 通过 option 插槽，自定义节点 | v-slot:option="{value, label, [disabled, key, title]}" | - | 3.0 |
| options | 自动完成的数据源 | [DataSourceItemType](https://github.com/vueComponent/ant-design-vue/blob/724d53b907e577cf5880c1e6742d4c3f924f8f49/components/auto-complete/index.vue#L9)\[] | - |  |
| placeholder | 输入框提示 | string \| slot | - |  |
| ~~popupClassName~~ | 下拉菜单的 className 属性（已废弃，请使用 `classNames.popup.root`） | string | - | 4.0 |
| popupMatchSelectWidth | 下拉菜单和选择器同宽。默认将设置 `min-width`，当值小于选择框宽度时会被忽略。`false` 时会关闭虚拟滚动 | boolean \| number | true | 4.3.0 |
| popupRender | 自定义下拉框内容（支持 prop 与 `#popupRender` 插槽，直接接收菜单节点） | `(originNode: VNode) => VNode` \| slot | - | 4.3.0 |
| prefix | 自定义前缀 | VNode \| slot | - | 4.3.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| showSearch | 搜索配置，支持 boolean 或配置对象 | boolean \| [showSearch](#showsearch) | - | Object: 4.3.0 |
| size | 输入框大小 | `large` \| `middle` \| `small` | - |  |
| status | 设置校验状态 | `'error'` \| `'warning'` | - | 3.3.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style（支持对象与函数式 `({ props }) => ...`） | `{ root?: CSSProperties; prefix?: CSSProperties; suffix?: CSSProperties; popup?: { root?: CSSProperties } } \| ((info: { props: AutoCompleteProps }) => ...)` | - | 4.3.0 |
| suffix | 自定义的选择框后缀图标（替代 `suffixIcon`） | VNode \| slot | - | 4.3.0 |
| ~~suffixIcon~~ | 自定义的选择框后缀图标（已废弃，请使用 `suffix` 替代） | VNode \| slot | - |  |
| v-model:value | 指定当前选中的条目 | string \| string\[] \| { key: string, label: string \| vNodes } \| Array&lt;{ key: string, label: string \| vNodes }> | 无 |  |
| variant | 形态变体 | `'outlined'` \| `'borderless'` \| `'filled'` \| `'underlined'` | `'outlined'` | 4.3.0 |
| virtual | 设置 false 时关闭虚拟滚动 | boolean | true | 3.0 |

### showSearch

| 参数         | 说明                   | 类型                                    | 默认值 | 版本  |
| ------------ | ---------------------- | --------------------------------------- | ------ | ----- |
| filterOption | 是否根据输入项进行筛选 | boolean \| function(inputValue, option) | true   | 4.3.0 |
| onSearch     | 搜索补全项的时候调用   | function(value: string)                 | -      | 4.3.0 |

### 事件

| 事件名称 | 说明 | 回调参数 | 版本 |
| --- | --- | --- | --- |
| blur | 失去焦点时的回调 | function() |  |
| change | 选中 option，或 input 的 value 变化时，调用此函数 | function(value) |  |
| clear | 清除内容时回调 | function() | 3.3.0 |
| ~~dropdownVisibleChange~~ | 展开下拉菜单的回调（已废弃，请使用 `openChange`） | function(open) |  |
| focus | 获得焦点时的回调 | function() |  |
| openChange | 展开下拉菜单的回调 | function(open: boolean) | 4.3.0 |
| search | 搜索补全项的时候调用 | function(value) |  |
| select | 被选中时调用，参数为选中项的 value 值 | function(value, option) |  |

## 方法

| 名称    | 描述     | 版本 |
| ------- | -------- | ---- |
| blur()  | 移除焦点 |      |
| focus() | 获取焦点 |      |

## FAQ

### v2 的部分属性为何在 v3 中没有了？

AutoComplete 组件是一个支持自动提示的 Input 组件，因而其不具有 `labelInValue` 等影响 value 展示的属性。在 v2 版本，AutoComplete 实现存在输入值如果遇到 `value` 与 `label` 相同时无法映射的问题。 v3 中不再支持 `label` 为值的输入形态。

此外为了统一 API，`dataSource` 改为 `options` 你可以如下转换：

#### v2

```ts
dataSource = ['light', 'bamboo'];
// or
dataSource = [
  { value: 'light', text: 'Light' },
  { value: 'bamboo', text: 'Bamboo' },
];
```

#### v3

```ts
options = [
  { value: 'light', label: 'Light' },
  { value: 'bamboo', label: 'Bamboo' },
];
```
