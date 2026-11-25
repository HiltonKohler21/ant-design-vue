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
| allowClear | Allow to remove input content with clear icon | boolean \| [AllowClearConfig](#allowclearconfig) | - | 4.3.0 |
| ~~bordered~~ | Whether has border style (deprecated, use `variant` instead) | boolean | `true` | 3.0 |
| classNames | Semantic DOM class names (supports object and function `({ props }) => ...`) | `{ root?: string; input?: string; prefix?: string; suffix?: string; count?: string } \| ((info: { props: InputProps }) => ...)` | - | 4.3.0 |
| clearIcon | Custom clear icon when `allowClear` is `true` | slot | `<CloseCircleFilled />` | 3.3.0 |
| count | Character count config | [CountConfig](#countconfig) | - | 4.3.0 |
| defaultValue | The initial input content | string | - |  |
| disabled | Whether the input is disabled | boolean | `false` |  |
| id | The ID for input | string | - |  |
| maxlength | Max length | number | - | 1.5.0 |
| prefix | The prefix icon for the Input | string \| slot | - |  |
| rootClassName | Root element class name | string | - | 4.3.0 |
| showCount | Whether show text count | boolean \| { formatter: (info: { value: string, count: number, maxLength?: number }) => string } | `false` | 3.0 |
| size | The size of the input box. Note: in the context of a form, the `middle` size is used. Available: `large` `middle` `small` | `large` \| `middle` \| `small` | - |  |
| status | Set validation status | `error` \| `warning` | - | 3.3.0 |
| styles | Semantic DOM inline styles (supports object and function `({ props }) => ...`) | `{ root?: CSSProperties; input?: CSSProperties; prefix?: CSSProperties; suffix?: CSSProperties; count?: CSSProperties } \| ((info: { props: InputProps }) => ...)` | - | 4.3.0 |
| suffix | The suffix icon for the Input | string \| slot | - |  |
| type | The type of input, see: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types) (use `<a-textarea />` instead of `type="textarea"`) | string | `text` |  |
| value(v-model) | The input content value | string | - |  |
| variant | Variant of the input | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 4.3.0 |

### Input Events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| change | Callback when user input | function(e) |  |
| clear | Callback when click the clear button | () => void | 4.3.0 |
| pressEnter | The callback function that is triggered when Enter key is pressed | function(e) |  |

### Input Methods

| Name | Description | Parameters | Version |
| --- | --- | --- | --- |
| blur() | Remove focus | - |  |
| focus() | Get focus | (option?: { preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' }) | 4.3.0 |
| nativeElement | Get native DOM element | - | 4.3.0 |

#### AllowClearConfig

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| clearIcon | Custom clear icon | VueNode | - | 4.3.0 |
| disabled | When `true`, equivalent to `allowClear={false}` | boolean | `false` | 4.3.0 |
| label | Accessible name of the clear button | string | - | 4.3.0 |
| tabIndex | Tab order of the clear button. `-1` excludes it from Tab navigation | number | `0` | 4.3.0 |

#### CountConfig

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| exceedFormatter | Custom clipping logic when character count exceeds `count.max` | (value: string, config: { max: number }) => string | - | 4.3.0 |
| max | Max character count. Unlike native `maxlength`, marks warning without truncating | number | - | 4.3.0 |
| show | Same as `showCount` | boolean \| ((args: { value: string; count: number; maxLength?: number }) => VueNode) | `false` | 4.3.0 |
| strategy | Custom character counting strategy | (value: string) => number | - | 4.3.0 |

> When `Input` is used in a `Form.Item` context, if the `Form.Item` has the `id` and `options` props defined then `value`, `defaultValue`, and `id` props of `Input` are automatically set.

### TextArea

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Allow to remove input content with clear icon | boolean | - | 1.5.0 |
| autoSize / autosize | Height autosize feature, can be set to `true` / `false` or an object `{ minRows: 2, maxRows: 6 }` | boolean \| { minRows?: number; maxRows?: number } | `false` |  |
| classNames | Semantic DOM class names (supports object and function `({ props }) => ...`) | `{ root?: string; textarea?: string; input?: string; count?: string } \| ((info: { props: TextAreaProps }) => ...)` | - | 4.3.0 |
| defaultValue | The initial input content | string | - |  |
| rootClassName | Root element class name | string | - | 4.3.0 |
| showCount | Whether show text count | boolean \| { formatter: (info: { value: string, count: number, maxLength?: number }) => string } | `false` | 3.0 |
| styles | Semantic DOM inline styles (supports object and function `({ props }) => ...`) | `{ root?: CSSProperties; textarea?: CSSProperties; input?: CSSProperties; count?: CSSProperties } \| ((info: { props: TextAreaProps }) => ...)` | - | 4.3.0 |
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
| classNames | Semantic DOM class names (supports object and function `({ props }) => ...`) | `{ root?: string; input?: string; prefix?: string; suffix?: string; count?: string } \| ((info: { props: SearchProps }) => ...)` | - | 4.3.0 |
| enterButton | To show an enter button after input. This prop conflicts with addon | boolean \| VueNode \| slot | `false` |  |
| loading | Search box with loading | boolean | `false` | 1.5.0 |
| rootClassName | Root element class name | string | - | 4.3.0 |
| searchIcon | Custom search icon (replaces default `<SearchOutlined />` when `enterButton` is boolean) | VueNode \| slot | `<SearchOutlined />` | 4.3.0 |
| styles | Semantic DOM inline styles (supports object and function `({ props }) => ...`) | `{ root?: CSSProperties; input?: CSSProperties; prefix?: CSSProperties; suffix?: CSSProperties; count?: CSSProperties } \| ((info: { props: SearchProps }) => ...)` | - | 4.3.0 |

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
| classNames | Semantic DOM class names (supports object and function `({ props }) => ...`) | `{ root?: string; input?: string; prefix?: string; suffix?: string; count?: string } \| ((info: { props: PasswordProps }) => ...)` | - | 4.3.0 |
| iconRender | Custom toggle button | (visible: boolean) => VueNode \| slot | - | 1.14.0 |
| rootClassName | Root element class name | string | - | 4.3.0 |
| styles | Semantic DOM inline styles (supports object and function `({ props }) => ...`) | `{ root?: CSSProperties; input?: CSSProperties; prefix?: CSSProperties; suffix?: CSSProperties; count?: CSSProperties } \| ((info: { props: PasswordProps }) => ...)` | - | 4.3.0 |
| visibilityToggle | Whether show toggle button or control password visibility | boolean | `true` | 1.14.0 |
| visible(v-model) | Password visibility | boolean | `false` | 3.0 |

Supports all props of `Input`.

### Input.OTP

One-time password input box (via `Input.OTP` or global tag `<a-input-o-t-p>`, available since `4.3.0`).

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoComplete | Native `autocomplete` attribute (also inherits from `ConfigProvider.otp.autoComplete`) | string | - | 4.3.0 |
| autoFocus | Focus input automatically on mount | boolean | `false` | 4.3.0 |
| classNames | Semantic DOM class names (supports object and function `({ props }) => ...`) | `{ root?: string; input?: string; separator?: string } \| ((info: { props: OTPProps }) => ...)` | - | 4.3.0 |
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
| styles | Semantic DOM inline styles (supports object and function `({ props }) => ...`) | `{ root?: CSSProperties; input?: CSSProperties; separator?: CSSProperties } \| ((info: { props: OTPProps }) => ...)` | - | 4.3.0 |
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
