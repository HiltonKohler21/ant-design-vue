---
category: Components
subtitle: 排版
type: 通用
title: Typography
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*MLt3R6m9huoAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*LT2jR41Uj2EAAAAAAAAAAAAADrJ8AQ/original
---

文本的基本格式。

## 何时使用

- 当需要展示标题、段落、列表内容时使用，如文章/博客/日志的文本样式。
- 当需要一列基于文本的基础操作时，如拷贝/省略/可编辑。

## API

### Typography.Text

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actions | 配置操作栏 | [actions](#actions) | - | 4.3.0 |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string> | - | 4.3.0 |
| code | 添加代码样式 | boolean | false |  |
| content(v-model) | 当使用 ellipsis 或 editable 时，也可通过 content 控制文本内容（同样支持默认插槽） | string | - |  |
| copyable | 是否可拷贝，为对象时可进行各种自定义 | boolean \| [copyable](#copyable) | false |  |
| delete | 添加删除线样式 | boolean | false |  |
| disabled | 禁用文本 | boolean | false |  |
| editable | 是否可编辑，为对象时可对编辑进行控制 | boolean \| [editable](#editable) | false |  |
| ellipsis | 自动溢出省略，为对象时不能设置省略行数、是否可展开、onExpand 展开事件。不同于 Typography.Paragraph，Text 组件自身不带 100% 宽度样式，因而默认情况下初次缩略后宽度便不再变化。如果需要自适应宽度，请手动配置宽度样式 | boolean \| [Omit<ellipsis, 'expandable' \| 'rows' \| 'onExpand'>](#ellipsis) | false |  |
| italic | 是否斜体 | boolean | false |  |
| keyboard | 添加键盘样式 | boolean | false |  |
| mark | 添加标记样式 | boolean | false |  |
| rootClassName | 根节点 className | string | - | 4.3.0 |
| shimmer | 展示闪烁文字效果，为对象时可进行配置 | boolean \| [shimmer](#shimmer) | false | 4.3.0 |
| strong | 是否加粗 | boolean | false |  |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties> | - | 4.3.0 |
| type | 文本类型 | `secondary` \| `success` \| `warning` \| `danger` | - |  |
| underline | 添加下划线样式 | boolean | false |  |
| onClick | 点击 Text 时的回调 | (event) => void | - |  |

### Typography.Title

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actions | 配置操作栏 | [actions](#actions) | - | 4.3.0 |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string> | - | 4.3.0 |
| code | 添加代码样式 | boolean | false |  |
| content(v-model) | 当使用 ellipsis 或 editable 时，也可通过 content 控制文本内容（同样支持默认插槽） | string | - |  |
| copyable | 是否可拷贝，为对象时可进行各种自定义 | boolean \| [copyable](#copyable) | false |  |
| delete | 添加删除线样式 | boolean | false |  |
| disabled | 禁用文本 | boolean | false |  |
| editable | 是否可编辑，为对象时可对编辑进行控制 | boolean \| [editable](#editable) | false |  |
| ellipsis | 自动溢出省略，为对象时可设置省略行数、是否可展开、添加后缀等 | boolean \| [ellipsis](#ellipsis) | false |  |
| italic | 是否斜体 | boolean | false |  |
| level | 重要程度，相当于 `h1`、`h2`、`h3`、`h4`、`h5` | number: 1, 2, 3, 4, 5 | 1 |  |
| mark | 添加标记样式 | boolean | false |  |
| rootClassName | 根节点 className | string | - | 4.3.0 |
| shimmer | 展示闪烁文字效果，为对象时可进行配置 | boolean \| [shimmer](#shimmer) | false | 4.3.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties> | - | 4.3.0 |
| type | 文本类型 | `secondary` \| `success` \| `warning` \| `danger` | - |  |
| underline | 添加下划线样式 | boolean | false |  |
| onClick | 点击 Title 时的回调 | (event) => void | - |  |

### Typography.Paragraph

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actions | 配置操作栏 | [actions](#actions) | - | 4.3.0 |
| classNames | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string> | - | 4.3.0 |
| code | 添加代码样式 | boolean | false |  |
| content(v-model) | 当使用 ellipsis 或 editable 时，也可通过 content 控制文本内容（同样支持默认插槽） | string | - |  |
| copyable | 是否可拷贝，为对象时可进行各种自定义 | boolean \| [copyable](#copyable) | false |  |
| delete | 添加删除线样式 | boolean | false |  |
| disabled | 禁用文本 | boolean | false |  |
| editable | 是否可编辑，为对象时可对编辑进行控制 | boolean \| [editable](#editable) | false |  |
| ellipsis | 自动溢出省略，为对象时可设置省略行数、是否可展开、添加后缀等 | boolean \| [ellipsis](#ellipsis) | false |  |
| italic | 是否斜体 | boolean | false |  |
| mark | 添加标记样式 | boolean | false |  |
| rootClassName | 根节点 className | string | - | 4.3.0 |
| shimmer | 展示闪烁文字效果，为对象时可进行配置 | boolean \| [shimmer](#shimmer) | false | 4.3.0 |
| strong | 是否加粗 | boolean | false |  |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties> | - | 4.3.0 |
| type | 文本类型 | `secondary` \| `success` \| `warning` \| `danger` | - |  |
| underline | 添加下划线样式 | boolean | false |  |
| onClick | 点击 Paragraph 时的回调 | (event) => void | - |  |

### slots

| 名称 | 说明 | 参数 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| copyableIcon | 自定义拷贝图标 | `{ copied: boolean }` | `copied ? <CheckOutlined /> : <CopyOutlined />` |  |
| copyableTooltip | 自定义提示文案，当 `copyable.tooltip = false` 或 `copyable.tooltips = false` 时关闭 | `{ copied: boolean }` | `copied ? '复制成功' : '复制'` |  |
| editableEnterIcon | 在编辑段中自定义“enter”图标 | `{ className: string }` | `<EnterOutlined />` | 3.0 |
| editableIcon | 自定义编辑图标 | - | &lt;EditOutlined /> |  |
| editableTooltip | 自定义提示文本，当 `editable.tooltip = false` 时关闭 | - | `编辑` |  |
| ellipsisSymbol | 自定义展开/收起描述文案 | `{ expanded: boolean }` | - |  |
| ellipsisTooltip | 省略时，展示提示信息 | - | - |  |

### actions

```ts
interface ActionsConfig {
  placement?: 'start' | 'end';
}
```

| 参数      | 说明                       | 类型             | 默认值 | 版本  |
| --------- | -------------------------- | ---------------- | ------ | ----- |
| placement | 设置操作栏相对于文本的位置 | `start` \| `end` | `end`  | 4.3.0 |

### copyable

```ts
interface CopyConfig {
  text?: string | (() => string | Promise<string>);
  onCopy?: (event?: MouseEvent) => void;
  icon?: VueNode | [VueNode, VueNode];
  tooltips?: false | [VueNode, VueNode];
  tooltip?: boolean;
  format?: 'text/plain' | 'text/html';
  tabIndex?: number;
}
```

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| format | 剪切板数据的 Mime Type | `'text/plain'` \| `'text/html'` | - | 4.3.0 |
| icon | 自定义拷贝图标：\[默认图标, 拷贝后的图标\] | \[VueNode, VueNode\] | - | 4.3.0 |
| tabIndex | 自定义复制按钮的 tabIndex | number | 0 | 4.3.0 |
| text | 拷贝到剪切板里的文本 | string \| (() => string \| Promise&lt;string>) | - | 4.3.0 |
| tooltip | 是否展示提示文本（建议使用 `tooltips`） | boolean | true |  |
| tooltips | 自定义提示文案，为 false 时隐藏文案 | false \| \[VueNode, VueNode\] | \[`复制`, `复制成功`\] | 4.3.0 |
| onCopy | 拷贝成功的回调函数 | function | - |  |

### editable

```ts
interface EditConfig {
  icon?: VueNode;
  tooltip?: boolean | VueNode;
  editing?: boolean;
  maxLength?: number;
  maxlength?: number;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  text?: string;
  onChange?: (value: string) => void;
  onCancel?: () => void;
  onStart?: () => void;
  onEnd?: () => void;
  triggerType?: ('icon' | 'text')[];
  enterIcon?: VueNode | null;
  tabIndex?: number;
}
```

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoSize | 自动 resize 文本域 | boolean \| { minRows: number, maxRows: number } | - |  |
| editing | 控制是否是编辑中状态 | boolean | false |  |
| enterIcon | 在编辑段中自定义"enter"图标（传递 `null` 将删除图标） | VueNode \| null | `<EnterOutlined />` | 4.3.0 |
| icon | 自定义编辑图标 | VueNode | &lt;EditOutlined /> | 4.3.0 |
| maxLength | 编辑中文本域最大长度（兼容 `maxlength`） | number | - | 4.3.0 |
| tabIndex | 自定义编辑按钮的 tabIndex | number | 0 | 4.3.0 |
| text | 显式地指定编辑文案，为空时将隐式地使用内容 | string | - | 4.3.0 |
| tooltip | 自定义提示文本，为 false 时关闭 | boolean \| VueNode | `编辑` | 4.3.0 |
| triggerType | 编辑模式触发器类型，图标、文本或者两者都设置（不设置图标作为触发器时它会隐藏） | Array&lt;`icon`\|`text`> | \[`icon`\] |  |
| onCancel | 按 ESC 退出编辑状态时触发 | function | - |  |
| onChange | 文本域编辑完成时触发 | function(value: string) | - |  |
| onEnd | 按 ENTER 结束编辑状态时触发 | function | - |  |
| onStart | 进入编辑中状态时触发 | function | - |  |

### ellipsis

```ts
interface EllipsisConfig {
  rows?: number;
  expandable?: boolean | 'collapsible';
  suffix?: string;
  symbol?: VueNode | ((expanded: boolean) => VueNode);
  tooltip?: boolean | VueNode | TooltipProps;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpand?: (event: MouseEvent, info: { expanded: boolean }) => void;
  onEllipsis?: (ellipsis: boolean) => void;
}
```

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultExpanded | 默认展开或收起 | boolean | false | 4.3.0 |
| expandable | 是否可展开 | boolean \| `'collapsible'` | - | `collapsible`: 4.3.0 |
| expanded | 展开或收起 | boolean | - | 4.3.0 |
| rows | 最多显示的行数 | number | - |  |
| suffix | 自定义省略内容后缀 | string | - |  |
| symbol | 自定义展开描述文案 | VueNode \| ((expanded: boolean) => VueNode) | `展开` `收起` | 4.3.0 |
| tooltip | 省略时，展示提示信息 | boolean \| VueNode \| [TooltipProps](/components/tooltip-cn/#api) | - | 4.3.0 |
| onEllipsis | 触发省略时的回调 | function(ellipsis) | - |  |
| onExpand | 点击展开或收起时的回调 | function(event, { expanded: boolean }) | - | `info`: 4.3.0 |

### shimmer

```ts
interface ShimmerConfig {
  duration?: number | [motionTime: number, waitTime: number];
}
```

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| duration | 光斑扫过时间，单位为秒。数字默认等待 1 秒，数组可分别设置扫过和等待时间 | number \| \[motionTime: number, waitTime: number\] | 1 | 4.3.0 |
