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
| autofocus | Auto get focus when component mounted | boolean | `false` |  |
| defaultValue | Default value | string | - |  |
| filterOption | Customize filter option logic | false \| (input: string, option: OptionProps) => boolean | - |  |
| getPopupContainer | Set the mount HTML node for suggestions | () => HTMLElement | - |  |
| loading | Loading state | boolean | `false` |  |
| notFoundContent | Set mentions content when not match | string \| slot | 'Not Found' |  |
| placement | Set popup placement | `top` \| `bottom` | `bottom` |  |
| popupClassName | The className of dropdown menu | string | - |  |
| prefix | Set trigger prefix keyword | string \| string\[] | '@' |  |
| rootClassName | Root class name | string | - | 4.3.0 |
| split | Set split string before and after selected mention | string | ' ' |  |
| status | Set validation status | 'error' \| 'warning' | - | 3.3.0 |
| validateSearch | Customize trigger search logic | (text: string, props: MentionsProps) => void | - |  |
| value(v-model) | Set value of mentions | string | - |  |
| variant | Variants of mentions | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 4.3.0 |
| options | Option Configuration | [Options](#option) | \[] | 4.0 |
| option | custom option label | v-slot:option="option" | - | 4.0 |

### Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| blur | remove focus | function |
| change | Trigger when value changed | function(value: string) |
| focus | get focus | function |
| search | Trigger when prefix hit | function(value: string, prefix: string) |
| select | Trigger when user select the option | function(option: OptionProps, prefix: string) |

### Mention methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | remove focus |
| focus() | get focus    |

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
|payload| other data | object | - |
