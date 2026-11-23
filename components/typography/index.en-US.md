---
category: Components
type: General
title: Typography
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*MLt3R6m9huoAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*LT2jR41Uj2EAAAAAAAAAAAAADrJ8AQ/original
---

Basic text writing, including headings, body text, lists, and more.

## When To Use

- When you need to display a title or paragraph contents in Articles/Blogs/Notes.
- When you need copyable/editable/ellipsis texts.

## API

### Typography.Text

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actions | Configure the operation bar | [actions](#actions) | - | 4.3.0 |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string> | - | 4.3.0 |
| code | Code style | boolean | false |  |
| content(v-model) | Content text when using ellipsis or editable (default slot is also supported) | string | - |  |
| copyable | Whether to be copyable, customize it via setting an object | boolean \| [copyable](#copyable) | false |  |
| delete | Deleted line style | boolean | false |  |
| disabled | Disabled content | boolean | false |  |
| editable | If editable. Can control edit state when is object | boolean \| [editable](#editable) | false |  |
| ellipsis | Display ellipsis when text overflows, can't configure expandable, rows and onExpand by using object. Diff with Typography.Paragraph, Text does not have 100% width style which means it will fix width on the first ellipsis. If you want to have responsive ellipsis, please set width manually | boolean \| [Omit<ellipsis, 'expandable' \| 'rows' \| 'onExpand'>](#ellipsis) | false |  |
| italic | Italic style | boolean | false |  |
| keyboard | Keyboard style | boolean | false |  |
| mark | Marked style | boolean | false |  |
| rootClassName | The class name of the root element | string | - | 4.3.0 |
| shimmer | Show a shimmer effect, customizable via an object | boolean \| [shimmer](#shimmer) | false | 4.3.0 |
| strong | Bold style | boolean | false |  |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties> | - | 4.3.0 |
| type | Content type | `secondary` \| `success` \| `warning` \| `danger` | - |  |
| underline | Underlined style | boolean | false |  |
| onClick | Set the handler to handle click event | (event) => void | - |  |

### Typography.Title

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actions | Configure the operation bar | [actions](#actions) | - | 4.3.0 |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string> | - | 4.3.0 |
| code | Code style | boolean | false |  |
| content(v-model) | Content text when using ellipsis or editable (default slot is also supported) | string | - |  |
| copyable | Whether to be copyable, customize it via setting an object | boolean \| [copyable](#copyable) | false |  |
| delete | Deleted line style | boolean | false |  |
| disabled | Disabled content | boolean | false |  |
| editable | If editable. Can control edit state when is object | boolean \| [editable](#editable) | false |  |
| ellipsis | Display ellipsis when text overflows, can configure rows and expandable by using object | boolean \| [ellipsis](#ellipsis) | false |  |
| italic | Italic style | boolean | false |  |
| level | Set content importance. Match with `h1`, `h2`, `h3`, `h4`, `h5` | number: 1, 2, 3, 4, 5 | 1 |  |
| mark | Marked style | boolean | false |  |
| rootClassName | The class name of the root element | string | - | 4.3.0 |
| shimmer | Show a shimmer effect, customizable via an object | boolean \| [shimmer](#shimmer) | false | 4.3.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties> | - | 4.3.0 |
| type | Content type | `secondary` \| `success` \| `warning` \| `danger` | - |  |
| underline | Underlined style | boolean | false |  |
| onClick | Set the handler to handle click event | (event) => void | - |  |

### Typography.Paragraph

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actions | Configure the operation bar | [actions](#actions) | - | 4.3.0 |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string> | - | 4.3.0 |
| code | Code style | boolean | false |  |
| content(v-model) | Content text when using ellipsis or editable (default slot is also supported) | string | - |  |
| copyable | Whether to be copyable, customize it via setting an object | boolean \| [copyable](#copyable) | false |  |
| delete | Deleted line style | boolean | false |  |
| disabled | Disabled content | boolean | false |  |
| editable | If editable. Can control edit state when is object | boolean \| [editable](#editable) | false |  |
| ellipsis | Display ellipsis when text overflows, can configure rows and expandable by using object | boolean \| [ellipsis](#ellipsis) | false |  |
| italic | Italic style | boolean | false |  |
| mark | Marked style | boolean | false |  |
| rootClassName | The class name of the root element | string | - | 4.3.0 |
| shimmer | Show a shimmer effect, customizable via an object | boolean \| [shimmer](#shimmer) | false | 4.3.0 |
| strong | Bold style | boolean | false |  |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties> | - | 4.3.0 |
| type | Content type | `secondary` \| `success` \| `warning` \| `danger` | - |  |
| underline | Underlined style | boolean | false |  |
| onClick | Set the handler to handle click event | (event) => void | - |  |

### slots

| Name | Description | Property | Default | Version |
| --- | --- | --- | --- | --- |
| copyableIcon | Custom copy icon | `{ copied: boolean }` | `copied ? <CheckOutlined /> : <CopyOutlined />` |  |
| copyableTooltip | Custom tooltip text, hide when `copyable.tooltip = false` or `copyable.tooltips = false` | `{ copied: boolean }` | `copied ? 'Copied' : 'Copy'` |  |
| editableEnterIcon | Custom "enter" icon in the edit field | `{ className: string }` | `<EnterOutlined />` | 3.0 |
| editableIcon | Custom editable icon | - | &lt;EditOutlined /> |  |
| editableTooltip | Custom tooltip text, hide when `editable.tooltip = false` | - | `Edit` |  |
| ellipsisSymbol | Custom description of ellipsis | `{ expanded: boolean }` | - |  |
| ellipsisTooltip | Show tooltip when ellipsis | - | - |  |

### actions

```ts
interface ActionsConfig {
  placement?: 'start' | 'end';
}
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| placement | Set the operation bar placement relative to the text | `start` \| `end` | `end` | 4.3.0 |

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

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| format | The Mime Type of the text | `'text/plain'` \| `'text/html'` | - | 4.3.0 |
| icon | Custom copy icon: \[copyIcon, copiedIcon\] | \[VueNode, VueNode\] | - | 4.3.0 |
| tabIndex | Set tabIndex of the copy button | number | 0 | 4.3.0 |
| text | The text to copy | string \| (() => string \| Promise&lt;string>) | - | 4.3.0 |
| tooltip | Whether to show tooltip (prefer `tooltips`) | boolean | true |  |
| tooltips | Custom tooltip text, hide when it is false | false \| \[VueNode, VueNode\] | \[`Copy`, `Copied`\] | 4.3.0 |
| onCopy | Called when copied text | function | - |  |

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

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoSize | `autoSize` attribute of textarea | boolean \| { minRows: number, maxRows: number } | - |  |
| editing | Whether to be editable | boolean | false |  |
| enterIcon | Custom "enter" icon in the edit field (passing `null` removes the icon) | VueNode \| null | `<EnterOutlined />` | 4.3.0 |
| icon | Custom editable icon | VueNode | &lt;EditOutlined /> | 4.3.0 |
| maxLength | `maxLength` attribute of textarea (`maxlength` also supported) | number | - | 4.3.0 |
| tabIndex | Set tabIndex of the edit button | number | 0 | 4.3.0 |
| text | Edit text, specify the editing content instead of using the children implicitly | string | - | 4.3.0 |
| tooltip | Custom tooltip text, hide when it is false | boolean \| VueNode | `Edit` | 4.3.0 |
| triggerType | Edit mode trigger - icon, text or both (not specifying icon as trigger hides it) | Array&lt;`icon`\|`text`> | \[`icon`\] |  |
| onCancel | Called when type ESC to exit editable state | function | - |  |
| onChange | Called when editing is completed | function(value: string) | - |  |
| onEnd | Called when type ENTER to exit editable state | function | - |  |
| onStart | Called when enter editable state | function | - |  |

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

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultExpanded | Default expand or collapse | boolean | false | 4.3.0 |
| expandable | Whether to be expandable | boolean \| `'collapsible'` | - | `collapsible`: 4.3.0 |
| expanded | Expand or Collapse | boolean | - | 4.3.0 |
| rows | Max rows of content | number | - |  |
| suffix | Suffix of ellipsis content | string | - |  |
| symbol | Custom description of ellipsis | VueNode \| ((expanded: boolean) => VueNode) | `Expand` `Collapse` | 4.3.0 |
| tooltip | Show tooltip when ellipsis | boolean \| VueNode \| [TooltipProps](/components/tooltip/#api) | - | 4.3.0 |
| onEllipsis | Called when enter or leave ellipsis state | function(ellipsis) | - |  |
| onExpand | Called when expand content | function(event, { expanded: boolean }) | - | `info`: 4.3.0 |

### shimmer

```ts
interface ShimmerConfig {
  duration?: number | [motionTime: number, waitTime: number];
}
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| duration | Motion time in seconds. A number uses a 1-second wait; a tuple sets the motion and wait times separately | number \| \[motionTime: number, waitTime: number\] | 1 | 4.3.0 |
