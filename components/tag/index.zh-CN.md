---
category: Components
subtitle: 标签
type: 数据展示
title: Tag
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*_SBsSrKLg00AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*JPNAQYrVkYkAAAAAAAAAAAAADrJ8AQ/original
---

进行标记和分类的小标签。

## 何时使用

- 用于标记事物的属性和维度。
- 进行分类。

## API

### Tag

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| ~~bordered~~ | 是否有边框，推荐使用 `variant="filled"` 替代 `bordered={false}` | boolean | `true` | 4.x |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| closable | 是否显示关闭按钮，传入对象可配置关闭图标、禁用状态与 `aria-*` 属性 | `boolean \| { closeIcon?: VueNode; disabled?: boolean; 'aria-label'?: string }` | `false` | 4.3.0 |
| closeIcon | 自定义关闭按钮 | VueNode \| slot | - | 2.0.0 |
| color | 标签色 | string | - |  |
| disabled | 是否禁用标签 | boolean | `false` | 4.3.0 |
| href | 点击跳转的地址，指定此属性时 `Tag` 将渲染为 `<a>` 标签 | string | - | 4.3.0 |
| icon | 设置图标 | VueNode \| slot | - | 2.0.0 |
| rootClassName | 根节点 className | string | - | 4.3.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| target | 相当于 `a` 链接的 `target` 属性，`href` 存在时生效 | string | - | 4.3.0 |
| variant | 标签形态变体 | `'filled' \| 'solid' \| 'outlined'` | `'outlined'` | 4.3.0 |

> 语义化结构 `SemanticDOM` 支持：`root` \| `icon` \| `content` \| `close`。

### Tag 事件

| 事件名称 | 说明                                                 | 回调参数                |
| -------- | ---------------------------------------------------- | ----------------------- |
| close    | 关闭时的回调（可通过 `e.preventDefault()` 阻止关闭） | (e: MouseEvent) => void |

### Tag.CheckableTag

| 参数             | 说明               | 类型            | 默认值  | 版本  |
| ---------------- | ------------------ | --------------- | ------- | ----- |
| checked(v-model) | 设置标签的选中状态 | boolean         | `false` |       |
| disabled         | 是否禁用选择       | boolean         | `false` | 4.3.0 |
| icon             | 设置图标           | VueNode \| slot | -       | 4.3.0 |

### Tag.CheckableTag 事件

| 事件名称 | 说明                 | 回调参数                   |
| -------- | -------------------- | -------------------------- |
| change   | 点击标签时触发的回调 | (checked: boolean) => void |

### Tag.CheckableTagGroup

可选择标签组（全局注册标签为 `<a-checkable-tag-group>`）。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数（支持 `root` \| `item`） | `Record<'root' \| 'item', string> \| (info: { props }) => Record<'root' \| 'item', string>` | - | 4.3.0 |
| defaultValue | 默认选中的值 | `string \| number \| Array<string \| number> \| null` | - | 4.3.0 |
| disabled | 禁用全部选项 | boolean | `false` | 4.3.0 |
| multiple | 是否支持多选 | boolean | `false` | 4.3.0 |
| options | 选项列表，对象项支持单独配置 `className`、`style`、`disabled`、`icon` | `Array<{ value: string \| number; label: VueNode; className?: string; style?: CSSProperties; disabled?: boolean; icon?: VueNode } \| string \| number>` | - | 4.3.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数（支持 `root` \| `item`） | `Record<'root' \| 'item', CSSProperties> \| (info: { props }) => Record<'root' \| 'item', CSSProperties>` | - | 4.3.0 |
| value(v-model) | 当前选中的值 | `string \| number \| Array<string \| number> \| null` | - | 4.3.0 |

### Tag.CheckableTagGroup 事件

| 事件名称 | 说明 | 回调参数 | 版本 |
| --- | --- | --- | --- |
| change | 选中项变化时的回调 | `(value: string \| number \| Array<string \| number> \| null) => void` | 4.3.0 |
