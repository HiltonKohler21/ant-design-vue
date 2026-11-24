---
category: Components
type: 数据录入
title: Mentions
subtitle: 提及
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*e4bXT7Uhi9YAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*pxR2S53P_xoAAAAAAAAAAAAADrJ8AQ/original
---

提及组件。

## 何时使用

- 用于在输入中提及某人或某事，常用于发布、聊天或评论功能。

## API

### Mentions

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 是否显示清除按钮 | boolean \| [AllowClearConfig](#allowclearconfig) | `false` | 4.3.0 |
| autoSize | 自适应内容高度，可设置为 `true` \| `false` 或对象：`{ minRows: 2, maxRows: 6 }` | boolean \| { minRows?: number; maxRows?: number } | `false` | 4.3.0 |
| autofocus | 自动获得焦点 | boolean | `false` |  |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `{ root?: string; textarea?: string; popup?: string; suffix?: string } \| ((info: { props: MentionsProps }) => ...)` | - | 4.3.0 |
| defaultValue | 默认值 | string | - |  |
| filterOption | 自定义过滤逻辑 | false \| (input: string, option: OptionProps) => boolean | - |  |
| getPopupContainer | 指定建议框挂载的 HTML 节点 | () => HTMLElement | - |  |
| loading | 加载中状态 | boolean | `false` |  |
| notFoundContent | 当下拉列表为空时显示的内容 | string \| slot | 'Not Found' |  |
| option | 通过 option 插槽，自定义节点 | v-slot:option="option" | - | 4.0 |
| options | 选项配置 | [Options](#option) | \[] | 4.0 |
| placement | 弹出层展示位置 | `top` \| `bottom` | `bottom` |  |
| popupClassName | 下拉菜单的 className 属性 | string | - |  |
| popupRender | 自定义下拉菜单渲染 | (menu: VueNode) => VueNode \| slot | - | 4.3.0 |
| prefix | 设置触发关键字 | string \| string\[] | '@' |  |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| size | 控件大小 | `large` \| `middle` \| `small` | - | 4.3.0 |
| split | 设置选中项前后分隔符 | string | ' ' |  |
| status | 设置校验状态 | `'error'` \| `'warning'` | - | 3.3.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `{ root?: CSSProperties; textarea?: CSSProperties; popup?: CSSProperties; suffix?: CSSProperties } \| ((info: { props: MentionsProps }) => ...)` | - | 4.3.0 |
| validateSearch | 自定义触发验证逻辑 | (text: string, props: MentionsProps) => void | - |  |
| value(v-model) | 设置值 | string | - |  |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 4.3.0 |

### AllowClearConfig

| 参数      | 说明                                              | 类型    | 默认值    | 版本  |
| --------- | ------------------------------------------------- | ------- | --------- | ----- |
| clearIcon | 自定义清除图标                                    | VueNode | -         | 4.3.0 |
| disabled  | `true` 时等同于 `allowClear={false}`              | boolean | `false`   | 4.3.0 |
| label     | 清除按钮的无障碍名称                              | string  | `'Clear'` | 4.3.0 |
| tabIndex  | 清除按钮的 Tab 键顺序。`-1` 表示不参与 Tab 键导航 | number  | `0`       | 4.3.0 |

### 事件

| 事件名称    | 说明               | 回调参数                                      | 版本  |
| ----------- | ------------------ | --------------------------------------------- | ----- |
| blur        | 失去焦点的时回调   | function                                      |       |
| change      | 值改变时触发       | function(value: string)                       |       |
| clear       | 按下清除按钮的回调 | () => void                                    | 4.3.0 |
| focus       | 获得焦点时回调     | function                                      |       |
| popupScroll | 下拉列表滚动时触发 | (e: Event) => void                            | 4.3.0 |
| resize      | resize 回调        | function({ width, height })                   | 4.3.0 |
| search      | 文本框值变化时回调 | function(value: string, prefix: string)       |       |
| select      | 选择选项时触发     | function(option: OptionProps, prefix: string) |       |

### Mentions 方法

| 名称          | 描述              | 版本  |
| ------------- | ----------------- | ----- |
| blur()        | 移除焦点          |       |
| focus()       | 获取焦点          |       |
| nativeElement | 获取原生 DOM 元素 | 4.3.0 |

### Mention.Option (< 4.0)

| 参数  | 说明           | 类型   | 默认值 |
| ----- | -------------- | ------ | ------ |
| value | 选择时填充的值 | string | ''     |

### Option

Support from v4.0

<!-- prettier-ignore -->
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选择时填充的值 | string \| number | - |
| label | 选项的标题 | VueNode \| (o: Option) => VueNode | - |
| disabled | 是否可选 | boolean | - |
| class | css 类名 | string | - |
| style | 选项样式 | CSSProperties | - |
| payload | 其它数据 | object | - |
