---
category: Components
type: 数据录入
title: Input
subtitle: 输入框
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Y3R0RowXHlAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*sBqqTatJ-AkAAAAAAAAAAAAADrJ8AQ/original
---

通过鼠标或键盘输入内容，是最基础的表单域的包装。

## 何时使用

- 需要用户输入表单域内容时。
- 提供组合型输入框，带搜索的输入框，还可以进行大小选择。

## API

### Input

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| addonAfter | 带标签的 input，设置后置标签 | string \| slot | - |  |
| addonBefore | 带标签的 input，设置前置标签 | string \| slot | - |  |
| allowClear | 可以点击清除图标删除内容 | boolean \| [AllowClearConfig](#allowclearconfig) | - | 4.3.0 |
| ~~bordered~~ | 是否有边框（已废弃，请使用 `variant`） | boolean | `true` | 3.0 |
| classNames | 语义化结构 class（支持对象与函数式 `({ props }) => ...`） | `{ root?: string; input?: string; prefix?: string; suffix?: string; count?: string } \| ((info: { props: InputProps }) => ...)` | - | 4.3.0 |
| clearIcon | 自定义清除图标（`allowClear` 为 `true` 时生效） | slot | `<CloseCircleFilled />` | 3.3.0 |
| count | 字符计数配置 | [CountConfig](#countconfig) | - | 4.3.0 |
| defaultValue | 输入框默认内容 | string | - |  |
| disabled | 是否禁用状态，默认为 `false` | boolean | `false` |  |
| id | 输入框的 id | string | - |  |
| maxlength | 最大长度 | number | - | 1.5.0 |
| prefix | 带有前缀图标的 input | string \| slot | - |  |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| showCount | 是否展示字数 | boolean \| { formatter: (info: { value: string, count: number, maxLength?: number }) => string } | `false` | 3.0 |
| size | 控件大小。注：标准表单内的输入框大小限制为 `middle`。可选 `large` `middle` `small` | `large` \| `middle` \| `small` | - |  |
| status | 设置校验状态 | `error` \| `warning` | - | 3.3.0 |
| styles | 语义化结构 style（支持对象与函数式 `({ props }) => ...`） | `{ root?: CSSProperties; input?: CSSProperties; prefix?: CSSProperties; suffix?: CSSProperties; count?: CSSProperties } \| ((info: { props: InputProps }) => ...)` | - | 4.3.0 |
| suffix | 带有后缀图标的 input | string \| slot | - |  |
| type | 声明 input 类型，同原生 input 标签的 type 属性，见：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input#属性)（请直接使用 `<a-textarea />` 代替 `type="textarea"`） | string | `text` |  |
| value(v-model) | 输入框内容 | string | - |  |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 4.3.0 |

### Input 事件

| 事件名称   | 说明                   | 回调参数    | 版本  |
| ---------- | ---------------------- | ----------- | ----- |
| change     | 输入框内容变化时的回调 | function(e) |       |
| clear      | 按下清除按钮的回调     | () => void  | 4.3.0 |
| pressEnter | 按下回车的回调         | function(e) |       |

### Input 方法

| 名称 | 说明 | 参数 | 版本 |
| --- | --- | --- | --- |
| blur() | 取消焦点 | - |  |
| focus() | 获取焦点 | (option?: { preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' }) | 4.3.0 |
| nativeElement | 获取原生 DOM 节点 | - | 4.3.0 |

#### AllowClearConfig

| 参数      | 说明                                              | 类型    | 默认值  | 版本  |
| --------- | ------------------------------------------------- | ------- | ------- | ----- |
| clearIcon | 自定义清除图标                                    | VueNode | -       | 4.3.0 |
| disabled  | `true` 时等同于 `allowClear={false}`              | boolean | `false` | 4.3.0 |
| label     | 清除按钮的无障碍名称                              | string  | -       | 4.3.0 |
| tabIndex  | 清除按钮的 Tab 键顺序。`-1` 表示不参与 Tab 键导航 | number  | `0`     | 4.3.0 |

#### CountConfig

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| exceedFormatter | 当字符数超出 `count.max` 时的自定义裁剪逻辑，不配置时不进行裁剪 | (value: string, config: { max: number }) => string | - | 4.3.0 |
| max | 最大字符数，不同于原生 `maxlength`，超出后标红但不会截断 | number | - | 4.3.0 |
| show | 同 `showCount` | boolean \| ((args: { value: string; count: number; maxLength?: number }) => VueNode) | `false` | 4.3.0 |
| strategy | 自定义字符计数策略 | (value: string) => number | - | 4.3.0 |

> 如果 `Input` 在 `Form.Item` 内，并且 `Form.Item` 设置了 `id` 和 `options` 属性，则 `value`、`defaultValue` 和 `id` 属性会被自动设置。

### TextArea

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 可以点击清除图标删除内容 | boolean | - | 1.5.0 |
| autoSize / autosize | 自适应内容高度，可设置为 `true` / `false` 或对象：`{ minRows: 2, maxRows: 6 }` | boolean \| { minRows?: number; maxRows?: number } | `false` |  |
| classNames | 语义化结构 class（支持对象与函数式 `({ props }) => ...`） | `{ root?: string; textarea?: string; input?: string; count?: string } \| ((info: { props: TextAreaProps }) => ...)` | - | 4.3.0 |
| defaultValue | 输入框默认内容 | string | - |  |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| showCount | 是否展示字数 | boolean \| { formatter: (info: { value: string, count: number, maxLength?: number }) => string } | `false` | 3.0 |
| styles | 语义化结构 style（支持对象与函数式 `({ props }) => ...`） | `{ root?: CSSProperties; textarea?: CSSProperties; input?: CSSProperties; count?: CSSProperties } \| ((info: { props: TextAreaProps }) => ...)` | - | 4.3.0 |
| value(v-model) | 输入框内容 | string | - |  |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 4.3.0 |

### TextArea 事件

| 事件名称   | 说明           | 回调参数    |
| ---------- | -------------- | ----------- |
| pressEnter | 按下回车的回调 | function(e) |

`TextArea` 的其他属性和浏览器自带的 [textarea](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) 一致。

### Input.Search

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 语义化结构 class（支持对象与函数式 `({ props }) => ...`） | `{ root?: string; input?: string; prefix?: string; suffix?: string; count?: string } \| ((info: { props: SearchProps }) => ...)` | - | 4.3.0 |
| enterButton | 是否有确认按钮，可设为按钮文字。该属性会与 addon 冲突 | boolean \| VueNode \| slot | `false` |  |
| loading | 搜索 loading | boolean | `false` | 1.5.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| searchIcon | 自定义搜索图标（当 `enterButton` 为布尔值时替换默认的 `<SearchOutlined />`） | VueNode \| slot | `<SearchOutlined />` | 4.3.0 |
| styles | 语义化结构 style（支持对象与函数式 `({ props }) => ...`） | `{ root?: CSSProperties; input?: CSSProperties; prefix?: CSSProperties; suffix?: CSSProperties; count?: CSSProperties } \| ((info: { props: SearchProps }) => ...)` | - | 4.3.0 |

### Input.Search 事件

| 事件名称 | 说明                         | 回调参数               |
| -------- | ---------------------------- | ---------------------- |
| search   | 点击搜索或按下回车键时的回调 | function(value, event) |

其余属性和 `Input` 一致。

### Input.Group

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| compact | 是否用紧凑模式 | boolean | `false` |
| size | `Input.Group` 中所有的 `Input` 的大小，可选 `large` `default` `small` | string | `default` |

```html
<a-input-group>
  <a-input />
  <a-input />
</a-input-group>
```

### Input.Password

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 语义化结构 class（支持对象与函数式 `({ props }) => ...`） | `{ root?: string; input?: string; prefix?: string; suffix?: string; count?: string } \| ((info: { props: PasswordProps }) => ...)` | - | 4.3.0 |
| iconRender | 自定义切换按钮 | (visible: boolean) => VueNode \| slot | - | 1.14.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| styles | 语义化结构 style（支持对象与函数式 `({ props }) => ...`） | `{ root?: CSSProperties; input?: CSSProperties; prefix?: CSSProperties; suffix?: CSSProperties; count?: CSSProperties } \| ((info: { props: PasswordProps }) => ...)` | - | 4.3.0 |
| visibilityToggle | 是否显示切换按钮或者控制密码显隐 | boolean | `true` | 1.14.0 |
| visible(v-model) | 密码是否可见 | boolean | `false` | 3.0 |

其余属性和 `Input` 一致。

### Input.OTP

一次性密码输入框（通过 `Input.OTP` 或全局标签 `<a-input-o-t-p>` 使用，自 `4.3.0` 起支持）。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoFocus | 自动获取焦点 | boolean | `false` | 4.3.0 |
| classNames | 语义化结构 class（支持对象与函数式 `({ props }) => ...`） | `{ root?: string; input?: string; separator?: string } \| ((info: { props: OTPProps }) => ...)` | - | 4.3.0 |
| defaultValue | 默认值 | string | - | 4.3.0 |
| disabled | 是否禁用 | boolean | `false` | 4.3.0 |
| formatter | 格式化展示，留空字段会被 `formatter` 忽略 | (value: string) => string | - | 4.3.0 |
| inputMode | 原生 `inputMode` 属性 | string | - | 4.3.0 |
| length | 输入元素数量 | number | `6` | 4.3.0 |
| mask | 自定义展示，同原生 input `mask` | boolean \| string | `false` | 4.3.0 |
| rootClassName | 根节点类名 | string | - | 4.3.0 |
| separator | 在输入框之间插入自定义分隔符 | string \| ((index: number) => VueNode) | - | 4.3.0 |
| size | 控件大小 | `large` \| `middle` \| `small` | `middle` | 4.3.0 |
| status | 设置校验状态 | `error` \| `warning` | - | 4.3.0 |
| styles | 语义化结构 style（支持对象与函数式 `({ props }) => ...`） | `{ root?: CSSProperties; input?: CSSProperties; separator?: CSSProperties } \| ((info: { props: OTPProps }) => ...)` | - | 4.3.0 |
| type | 声明内部 input 类型 | string | `text` | 4.3.0 |
| value(v-model) | 输入框内容 | string | - | 4.3.0 |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 4.3.0 |

### Input.OTP 事件

| 事件名称 | 说明 | 回调参数 | 版本 |
| --- | --- | --- | --- |
| change | 当输入全部填充完成且值变化时触发（也支持 `onChange` 属性） | (value: string) => void | 4.3.0 |
| input | 当任意单个输入框值变化时触发（也支持 `onInput` 属性） | (value: string[]) => void | 4.3.0 |

### Input.OTP 方法

| 名称          | 描述            | 版本  |
| ------------- | --------------- | ----- |
| blur()        | 移除焦点        | 4.3.0 |
| focus()       | 获取焦点        | 4.3.0 |
| nativeElement | 根容器 DOM 节点 | 4.3.0 |
