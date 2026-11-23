---
category: Components
type: 数据录入
title: Cascader
subtitle: 级联选择
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ngTnQZNOcK0AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Nt8xR7afyr0AAAAAAAAAAAAADrJ8AQ/original
---

级联选择框。

## 何时使用

- 需要从一组相关联的数据集合进行选择，例如省市区，公司层级，事物分类等。
- 从一个较大的数据集合中进行选择时，用多级分类进行分隔，方便选择。
- 比起 Select 组件，可以在同一个浮层中完成选择，有较好的体验。

## API

```html
<a-cascader :options="options" v-model:value="value" />
```

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 是否支持清除 | boolean | true |  |
| autofocus | 自动获取焦点 | boolean | false |  |
| ~~bordered~~ | 是否有边框（已废弃，请使用 `variant`） | boolean | true | 3.2 |
| classNames | 用于自定义组件内部各语义化结构的 class（支持对象与函数式 `({ props }) => ...`） | `{ root?: string; prefix?: string; suffix?: string; popup?: { root?: string } } \| ((info: { props: CascaderProps }) => ...)` | - | 4.3.0 |
| clearIcon | 自定义的选择框清空图标 | slot | - | 3.2 |
| changeOnSelect | （单选时生效）当此项为 true 时，点选每级菜单选项值都会发生变化，具体见上面的演示 | boolean | false |  |
| defaultValue | 默认的选中项 | string\[] \| number\[] | \[] |  |
| disabled | 禁用 | boolean | false |  |
| displayRender | 选择后展示的渲染函数,可使用 #displayRender="{labels, selectedOptions}" | `({labels, selectedOptions}) => VNode` | `labels => labels.join(' / ')` |  |
| ~~dropdownRender~~ | 自定义下拉框内容（已废弃，请使用 `popupRender`） | `({ menuNode, props }) => VNode` \| slot | - |  |
| ~~dropdownStyle~~ | 自定义浮层样式（已废弃，请使用 `styles.popup.root`） | CSSProperties | {} | 3.0 |
| expandIcon | 自定义次级菜单展开图标 | slot | - | 3.0 |
| expandTrigger | 次级菜单的展开方式 | `click` \| `hover` | 'click' |  |
| fieldNames | 自定义 options 中 `label` `value` `children` 的字段 | object | `{ label: 'label', value: 'value', children: 'children' }` |  |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。 | Function(triggerNode) | () => document.body |  |
| loadData | 用于动态加载选项，无法与 `showSearch` 一起使用 | `(selectedOptions) => void` | - |  |
| maxTagCount | 最多显示多少个 tag，响应式模式会对性能产生损耗 | number \| `responsive` | - | 3.0 |
| maxTagPlaceholder | 隐藏 tag 时显示的内容 | v-slot \| function(omittedValues) | - | 3.0 |
| multiple | 支持多选节点 | boolean | - | 3.0 |
| notFoundContent | 当下拉列表为空时显示的内容 | string \| slot | 'Not Found' |  |
| open | 控制浮层显隐 | boolean | - | 3.0 |
| options | 可选项数据源 | [Option](#option)\[] | - |  |
| placeholder | 输入框占位文本 | string | '请选择' |  |
| placement | 浮层预设位置 | `bottomLeft` \| `bottomRight` \| `topLeft` \| `topRight` | `bottomLeft` | 3.0 |
| ~~popupClassName~~ | 自定义浮层类名（已废弃，请使用 `classNames.popup.root`） | string | - | 4.0 |
| popupRender | 自定义下拉框内容，直接接收菜单节点 `menuNode`（支持 prop 与 `#popupRender` 插槽，替代 `dropdownRender`） | `(menuNode: VNode) => VNode` \| slot | - | 4.3.0 |
| prefix | 自定义前缀 | VNode \| slot | - | 4.3.0 |
| removeIcon | 自定义的多选框清除图标 | slot | - | 3.2 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| searchValue | 设置搜索的值，需要与 `showSearch` 配合使用 | string | - | 3.0 |
| showCheckedStrategy | 定义选中项回填的方式。`Cascader.SHOW_CHILD`: 只显示选中的子节点。`Cascader.SHOW_PARENT`: 只显示父节点（当父节点下所有子节点都选中时）。 | `Cascader.SHOW_PARENT` \| `Cascader.SHOW_CHILD` | `Cascader.SHOW_PARENT` | 3.3.0 |
| showSearch | 在选择框中显示搜索框 | boolean \| [object](#showsearch) | false |  |
| size | 输入框大小 | `large` \| `default` \| `small` | `default` |  |
| status | 设置校验状态 | `'error'` \| `'warning'` | - | 3.3.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style（支持对象与函数式 `({ props }) => ...`） | `{ root?: CSSProperties; prefix?: CSSProperties; suffix?: CSSProperties; popup?: { root?: CSSProperties } } \| ((info: { props: CascaderProps }) => ...)` | - | 4.3.0 |
| suffix | 自定义的选择框后缀图标（替代 `suffixIcon`） | string \| VNode \| slot | - | 4.3.0 |
| ~~suffixIcon~~ | 自定义的选择框后缀图标（已废弃，请使用 `suffix` 替代） | string \| VNode \| slot | - |  |
| tagRender | 自定义 tag 内容，多选时生效 | slot | - | 3.0 |
| value(v-model) | 指定选中项 | string\[] \| number\[] | - |  |
| variant | 形态变体 | `'outlined'` \| `'borderless'` \| `'filled'` \| `'underlined'` | `'outlined'` | 4.3.0 |

### showSearch

`showSearch` 为对象时，其中的字段：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| filter | 接收 `inputValue` `path` 两个参数，当 `path` 符合筛选条件时，应返回 true，反之则返回 false。 | `function(inputValue, path): boolean` |  |
| limit | 搜索结果展示数量 | number \| false | 50 |
| matchInputWidth | 搜索结果列表是否与输入框同宽 | boolean |  |
| render | 用于渲染 filter 后的选项,可使用 #showSearchRender="{inputValue, path}" | `function({inputValue, path}): VNode` |  |
| sort | 用于排序 filter 后的选项 | `function(a, b, inputValue)` |  |

### 事件

| 事件名称 | 说明 | 回调参数 | 版本 |
| --- | --- | --- | --- |
| change | 选择完成后的回调 | `(value, selectedOptions) => void` |  |
| ~~dropdownVisibleChange~~ | 显示/隐藏浮层的回调（已废弃，请使用 `openChange`） | `(value) => void` | 3.0 |
| openChange | 显示/隐藏浮层的回调 | `(open: boolean) => void` | 4.3.0 |
| search | 监听搜索，返回输入的值 | `(value) => void` | 3.0 |

### Option

```ts
interface Option {
  value: string | number;
  label?: any;
  disabled?: boolean;
  children?: Option[];
  // 标记是否为叶子节点，设置了 `loadData` 时有效
  // 设为 `false` 时会强制标记为父节点，即使当前节点没有 children，也会显示展开图标
  isLeaf?: boolean;
}
```

## 方法

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |

### Cascader.Panel

> `4.3.0` 新增，支持 `<a-cascader-panel>` 与 `<Cascader.Panel>`。

直接内联渲染级联选择面板（无下拉浮层）。支持 `value(v-model)`、`defaultValue`、`options`、`fieldNames`、`multiple`、`changeOnSelect`、`showCheckedStrategy`、`expandTrigger`、`loadData`、`disabled`、`notFoundContent`、`expandIcon`、`loadingIcon`、`direction`、`rootClassName`、`popupMenuColumnStyle` 与 `change` 事件，用法与 `Cascader` 一致。

> 注意，如果需要获得中国省市区数据，可以参考 react 组件的实现 [china-division](https://gist.github.com/afc163/7582f35654fd03d5be7009444345ea17)。
