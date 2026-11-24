---
category: Components
type: Data Entry
title: Mentions
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*e4bXT7Uhi9YAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*pxR2S53P_xoAAAAAAAAAAAAADrJ8AQ/original
---

Mention component.

## When To Use

When you need to mention someone or something.

## API

### Mentions

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Whether to show a clear button | boolean \| [AllowClearConfig](#allowclearconfig) | `false` | 4.3.0 |
| autoSize | Textarea height autosize feature, can be set to `true` \| `false` or an object `{ minRows: 2, maxRows: 6 }` | boolean \| { minRows?: number; maxRows?: number } | `false` | 4.3.0 |
| autofocus | Auto get focus when component mounted | boolean | `false` |  |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | `{ root?: string; textarea?: string; popup?: string; suffix?: string } \| ((info: { props: MentionsProps }) => ...)` | - | 4.3.0 |
| defaultValue | Default value | string | - |  |
| filterOption | Customize filter option logic | false \| (input: string, option: OptionProps) => boolean | - |  |
| getPopupContainer | Set the mount HTML node for suggestions | () => HTMLElement | - |  |
| loading | Loading state | boolean | `false` |  |
| notFoundContent | Set mentions content when not match | string \| slot | 'Not Found' |  |
| option | custom option label | v-slot:option="option" | - | 4.0 |
| options | Option Configuration | [Options](#option) | \[] | 4.0 |
| placement | Set popup placement | `top` \| `bottom` | `bottom` |  |
| popupClassName | The className of dropdown menu | string | - |  |
| popupRender | Customize the dropdown menu rendering | (menu: VueNode) => VueNode \| slot | - | 4.3.0 |
| prefix | Set trigger prefix keyword | string \| string\[] | '@' |  |
| rootClassName | Root class name | string | - | 4.3.0 |
| size | The size of the input box | `large` \| `middle` \| `small` | - | 4.3.0 |
| split | Set split string before and after selected mention | string | ' ' |  |
| status | Set validation status | `'error'` \| `'warning'` | - | 3.3.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | `{ root?: CSSProperties; textarea?: CSSProperties; popup?: CSSProperties; suffix?: CSSProperties } \| ((info: { props: MentionsProps }) => ...)` | - | 4.3.0 |
| validateSearch | Customize trigger search logic | (text: string, props: MentionsProps) => void | - |  |
| value(v-model) | Set value of mentions | string | - |  |
| variant | Variants of mentions | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 4.3.0 |

### AllowClearConfig

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| clearIcon | Custom clear icon | VueNode | - | 4.3.0 |
| disabled | When `true`, equivalent to `allowClear={false}` | boolean | `false` | 4.3.0 |
| label | Accessible name of the clear button | string | `'Clear'` | 4.3.0 |
| tabIndex | Tab order of the clear button. `-1` excludes it from Tab navigation | number | `0` | 4.3.0 |

### Events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| blur | remove focus | function |  |
| change | Trigger when value changed | function(value: string) |  |
| clear | Callback when click the clear button | () => void | 4.3.0 |
| focus | get focus | function |  |
| popupScroll | Trigger when mentions popup scrolls | (e: Event) => void | 4.3.0 |
| resize | The callback function that is triggered when textarea resize | function({ width, height }) | 4.3.0 |
| search | Trigger when prefix hit | function(value: string, prefix: string) |  |
| select | Trigger when user select the option | function(option: OptionProps, prefix: string) |  |

### Mention methods

| Name          | Description            | Version |
| ------------- | ---------------------- | ------- |
| blur()        | remove focus           |         |
| focus()       | get focus              |         |
| nativeElement | The native DOM element | 4.3.0   |

### Mention.Option (< 4.0)

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | value of suggestion, the value will insert into input filed while selected | string | '' |

### Option

Support from v4.0

<!-- prettier-ignore -->
| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | value of suggestion, the value will insert into input filed while selected | string \| number | - |
| label | Title of the option | VueNode \| (o: Option) => VueNode | - |
| disabled | Optional | boolean | - |
| class | className | string | - |
| style | The style of the option | CSSProperties | - |
| payload | other data | object | - |
