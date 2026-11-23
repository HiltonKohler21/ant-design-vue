---
category: Components
type: Data Entry
title: Input
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Y3R0RowXHlAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*sBqqTatJ-AkAAAAAAAAAAAAADrJ8AQ/original
---

A basic widget for getting the user input is a text field. Keyboard and mouse can be used for providing or changing data.

## When To Use

- A user input in a form field is needed.
- A search input is required.

## API

### Input

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| addonAfter | The label text displayed after (on the right side of) the input field | string \| slot | - |  |
| addonBefore | The label text displayed before (on the left side of) the input field | string \| slot | - |  |
| allowClear | Allow to remove input content with clear icon | boolean | - |  |
| ~~bordered~~ | Whether has border style (deprecated, use `variant` instead) | boolean | `true` | 3.0 |
| classNames | Semantic DOM class names | { input?: string; prefix?: string; suffix?: string; count?: string } | - | 4.3.0 |
| clearIcon | Custom clear icon when `allowClear` is `true` | slot | `<CloseCircleFilled />` | 3.3.0 |
| defaultValue | The initial input content | string | - |  |
| disabled | Whether the input is disabled | boolean | `false` |  |
| id | The ID for input | string | - |  |
| maxlength | Max length | number | - | 1.5.0 |
| prefix | The prefix icon for the Input | string \| slot | - |  |
| rootClassName | Root element class name | string | - | 4.3.0 |
| showCount | Whether show text count | boolean \| { formatter: (info: { value: string, count: number, maxLength?: number }) => string } | `false` | 3.0 |
| size | The size of the input box. Note: in the context of a form, the `middle` size is used. Available: `large` `middle` `small` | `large` \| `middle` \| `small` | - |  |
| status | Set validation status | `error` \| `warning` | - | 3.3.0 |
| styles | Semantic DOM inline styles | { input?: CSSProperties; prefix?: CSSProperties; suffix?: CSSProperties; count?: CSSProperties } | - | 4.3.0 |
| suffix | The suffix icon for the Input | string \| slot | - |  |
| type | The type of input, see: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types) (use `<a-textarea />` instead of `type="textarea"`) | string | `text` |  |
| value(v-model) | The input content value | string | - |  |
| variant | Variant of the input | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 4.3.0 |

### Input Events

| Events Name | Description                                                       | Arguments   |
| ----------- | ----------------------------------------------------------------- | ----------- |
| change      | Callback when user input                                          | function(e) |
| pressEnter  | The callback function that is triggered when Enter key is pressed | function(e) |

> When `Input` is used in a `Form.Item` context, if the `Form.Item` has the `id` and `options` props defined then `value`, `defaultValue`, and `id` props of `Input` are automatically set.

### TextArea

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Allow to remove input content with clear icon | boolean | - | 1.5.0 |
| autoSize / autosize | Height autosize feature, can be set to `true` / `false` or an object `{ minRows: 2, maxRows: 6 }` | boolean \| { minRows?: number; maxRows?: number } | `false` |  |
| classNames | Semantic DOM class names | { textarea?: string; count?: string } | - | 4.3.0 |
| defaultValue | The initial input content | string | - |  |
| rootClassName | Root element class name | string | - | 4.3.0 |
| showCount | Whether show text count | boolean \| { formatter: (info: { value: string, count: number, maxLength?: number }) => string } | `false` | 3.0 |
| styles | Semantic DOM inline styles | { textarea?: CSSProperties; count?: CSSProperties } | - | 4.3.0 |
| value(v-model) | The input content value | string | - |  |
| variant | Variant of the textarea | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 4.3.0 |

### TextArea Events

| Events Name | Description                                                       | Arguments   |
| ----------- | ----------------------------------------------------------------- | ----------- |
| pressEnter  | The callback function that is triggered when Enter key is pressed | function(e) |

The rest of the props of `TextArea` are the same as the original [textarea](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea).

### Input.Search

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Semantic DOM class names | { input?: string; prefix?: string; suffix?: string; count?: string } | - | 4.3.0 |
| enterButton | To show an enter button after input. This prop conflicts with addon | boolean \| VueNode \| slot | `false` |  |
| loading | Search box with loading | boolean | `false` | 1.5.0 |
| rootClassName | Root element class name | string | - | 4.3.0 |
| styles | Semantic DOM inline styles | { input?: CSSProperties; prefix?: CSSProperties; suffix?: CSSProperties; count?: CSSProperties } | - | 4.3.0 |

### Input.Search Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| search | The callback function that is triggered when you click on the search-icon or press Enter key | function(value, event) |

Supports all props of `Input`.

### Input.Group

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| compact | Whether use compact style | boolean | `false` |
| size | The size of `Input.Group` specifies the size of the included `Input` fields. Available: `large` `default` `small` | string | `default` |

```html
<a-input-group>
  <a-input />
  <a-input />
</a-input-group>
```

### Input.Password

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Semantic DOM class names | { input?: string; prefix?: string; suffix?: string; count?: string } | - | 4.3.0 |
| iconRender | Custom toggle button | (visible: boolean) => VueNode \| slot | - | 1.14.0 |
| rootClassName | Root element class name | string | - | 4.3.0 |
| styles | Semantic DOM inline styles | { input?: CSSProperties; prefix?: CSSProperties; suffix?: CSSProperties; count?: CSSProperties } | - | 4.3.0 |
| visibilityToggle | Whether show toggle button or control password visibility | boolean | `true` | 1.14.0 |
| visible(v-model) | Password visibility | boolean | `false` | 3.0 |

Supports all props of `Input`.

### Input.OTP

One-time password input box (via `Input.OTP` or global tag `<a-input-o-t-p>`, available since `4.3.0`).

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoFocus | Focus input automatically on mount | boolean | `false` | 4.3.0 |
| defaultValue | Default value | string | - | 4.3.0 |
| disabled | Whether the input is disabled | boolean | `false` | 4.3.0 |
| formatter | Format display; empty fields are ignored by `formatter` | (value: string) => string | - | 4.3.0 |
| inputMode | Native `inputMode` attribute | string | - | 4.3.0 |
| length | Number of input elements | number | `6` | 4.3.0 |
| mask | Custom display mask (e.g. `true` or `'🔒'`) | boolean \| string | `false` | 4.3.0 |
| rootClassName | Root element class name | string | - | 4.3.0 |
| separator | Custom separator between input cells | string \| ((index: number) => VueNode) | - | 4.3.0 |
| size | Size of the input box | `large` \| `middle` \| `small` | `middle` | 4.3.0 |
| status | Set validation status | `error` \| `warning` | - | 4.3.0 |
| type | Native input type for cells | string | `text` | 4.3.0 |
| value(v-model) | Input content value | string | - | 4.3.0 |
| variant | Variant of the input | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 4.3.0 |

### Input.OTP Events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| change | Triggered when all inputs are filled and value changes (also accepts `onChange` prop) | (value: string) => void | 4.3.0 |
| input | Triggered whenever any single input cell changes (also accepts `onInput` prop) | (value: string[]) => void | 4.3.0 |

### Input.OTP Methods

| Name          | Description                | Version |
| ------------- | -------------------------- | ------- |
| blur()        | Remove focus               | 4.3.0   |
| focus()       | Get focus                  | 4.3.0   |
| nativeElement | Root container DOM element | 4.3.0   |
