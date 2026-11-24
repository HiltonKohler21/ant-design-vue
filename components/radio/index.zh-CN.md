---
category: Components
type: 数据录入
title: Radio
subtitle: 单选框
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*mrPVRope68wAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*xPfTSphsiA0AAAAAAAAAAAAADrJ8AQ/original
---

单选框。

## 何时使用

- 用于在多个备选项中选中单个状态。
- 和 Select 的区别是，Radio 所有选项默认可见，方便用户在比较中选择，因此选项不宜过多。

## API

### Radio/Radio.Button

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autofocus | 自动获取焦点 | boolean | false |  |
| checked(v-model) | 指定当前是否选中 | boolean | false |  |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| defaultChecked | 初始是否选中 | boolean | false | 4.3.0 |
| disabled | 禁用 Radio | boolean | false |  |
| id | Radio 的 `id` 属性 | string | - |  |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| value | 根据 value 进行比较，判断是否选中 | any | - |  |

### RadioGroup

单选框组合，用于包裹一组 `Radio`。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| block | 将 RadioGroup 宽度调整为其父宽度的选项 | boolean | false | 4.3.0 |
| buttonStyle | RadioButton 的风格样式，目前有描边和填色两种风格 | `outline` \| `solid` | `outline` |  |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `Record<GroupSemanticDOM, string> \| (info: { props }) => Record<GroupSemanticDOM, string>` | - | 4.3.0 |
| defaultValue | 默认选中的值 | any | - | 4.3.0 |
| disabled | 禁选所有子单选器 | boolean | false |  |
| id | RadioGroup 的 `id` 属性 | string | - |  |
| name | RadioGroup 下所有 `input[type="radio"]` 的 `name` 属性 | string | - |  |
| options | 以配置形式设置子元素 | string\[] \| number\[] \| Array&lt;{ label: string, value: string, disabled?: boolean, className?: string, style?: CSSProperties, title?: string }> | - |  |
| optionType | 用于设置 Radio `options` 类型 | `default` \| `button` | `default` | 3.0.0 |
| orientation | 排列方向 | `'horizontal'` \| `'vertical'` | `'horizontal'` | 4.3.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| size | 大小，只对按钮样式生效 | `large` \| `default` \| `small` | `default` |  |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `Record<GroupSemanticDOM, CSSProperties> \| (info: { props }) => Record<GroupSemanticDOM, CSSProperties>` | - | 4.3.0 |
| value(v-model) | 用于设置当前选中的值 | any | - |  |
| vertical | 值为 true，RadioGroup 为垂直方向 | boolean | false | 4.3.0 |

### RadioGroup 事件

| 事件名称 | 说明                 | 回调参数          |
| -------- | -------------------- | ----------------- |
| change   | 选项变化时的回调函数 | Function(e:Event) |

## 方法

### Radio

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |

## Semantic DOM

- **Radio**：`root`（根元素）、`icon`（单选圆点图标元素）、`label`（文本标签元素）。
- **Radio.Group**：`root`（组根元素）、`item`（选项根元素）、`itemIcon`（选项图标元素）、`itemLabel`（选项文本元素）。
