---
category: Components
type: Data Entry
cols: 2
title: AutoComplete
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*g8THS4NpV6sAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*WERTQ6qvgEYAAAAAAAAAAAAADrJ8AQ/original
---

Autocomplete function of input field.

## When To Use

- When you need an input box instead of a selector.
- When you need input suggestions or helping text.

The differences with Select are:

- AutoComplete is an input box with text hints, and users can type freely. The keyword is aiding **input**.
- Select is selecting among given choices. The keyword is **select**.

## API

```html
<a-auto-complete v-model:value="value" :options="options" />
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Show clear button | boolean | false |  |
| autofocus | Get focus when component mounted | boolean | false |  |
| backfill | Backfill selected item into the input when using keyboard | boolean | false |  |
| ~~bordered~~ | Whether has border style (deprecated, please use `variant` instead) | boolean | true | 4.0 |
| classNames | Customize class for each semantic structure inside the component (supports object and function `({ props }) => ...`) | `{ root?: string; prefix?: string; suffix?: string; popup?: { root?: string } } \| ((info: { props: AutoCompleteProps }) => ...)` | - | 4.3.0 |
| clearIcon | Use slot custom clear icon | slot | `<CloseCircleFilled />` | 4.0 |
| default (for customize input element) | Customize input element | slot | `<Input />` |  |
| defaultActiveFirstOption | Whether active first option by default | boolean | true |  |
| defaultOpen | Initial open state of dropdown | boolean | - |  |
| defaultValue | Initial selected option | string | - |  |
| disabled | Whether disabled select | boolean | false |  |
| ~~dropdownMatchSelectWidth~~ | Determine whether the dropdown menu and the select input are the same width (deprecated, please use `popupMatchSelectWidth` instead) | boolean \| number | true |  |
| dropdownMenuStyle | Additional style applied to dropdown menu | object | - | 1.5.0 |
| ~~dropdownRender~~ | Customize dropdown content (deprecated, please use `popupRender` instead) | `({ menuNode, props }) => VNode` \| slot | - |  |
| ~~dropdownStyle~~ | The style of dropdown menu (deprecated, please use `styles.popup.root` instead) | CSSProperties | - |  |
| filterOption | If true, filter options by input, if function, filter options against it. The function will receive two arguments, `inputValue` and `option`, if the function returns `true`, the option will be included in the filtered set; Otherwise, it will be excluded. | boolean \| function(inputValue, option) | true |  |
| getPopupContainer | Parent node of the dropdown. Default to body | function(triggerNode) | () => document.body |  |
| notFoundContent | Specify content to show when no result matches | string \| slot | - |  |
| open | Controlled open state of dropdown | boolean | - |  |
| option | Custom render option by slot | v-slot:option="{value, label, [disabled, key, title]}" | - | 3.0 |
| options | Data source for autocomplete | [DataSourceItemType](https://github.com/vueComponent/ant-design-vue/blob/724d53b907e577cf5880c1e6742d4c3f924f8f49/components/auto-complete/index.vue#L9)\[] | - |  |
| placeholder | Placeholder of input | string \| slot | - |  |
| ~~popupClassName~~ | The className of dropdown menu (deprecated, please use `classNames.popup.root` instead) | string | - | 4.0 |
| popupMatchSelectWidth | Determine whether the popup menu and the select input are the same width. Default set `min-width` same as input. Will ignore when value less than select width. `false` will disable virtual scroll | boolean \| number | true | 4.3.0 |
| popupRender | Customize popup content (supports prop and `#popupRender` slot, receives the menu VNode directly) | `(originNode: VNode) => VNode` \| slot | - | 4.3.0 |
| prefix | The custom prefix | VNode \| slot | - | 4.3.0 |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| showSearch | Search configuration (supports boolean or object) | boolean \| [showSearch](#showsearch) | - | Object: 4.3.0 |
| size | Size of input | `large` \| `middle` \| `small` | - |  |
| status | Set validation status | `'error'` \| `'warning'` | - | 3.3.0 |
| styles | Customize inline style for each semantic structure inside the component (supports object and function `({ props }) => ...`) | `{ root?: CSSProperties; prefix?: CSSProperties; suffix?: CSSProperties; popup?: { root?: CSSProperties } } \| ((info: { props: AutoCompleteProps }) => ...)` | - | 4.3.0 |
| suffix | The custom suffix icon (replaces `suffixIcon`) | VNode \| slot | - | 4.3.0 |
| ~~suffixIcon~~ | The custom suffix icon (deprecated, please use `suffix` instead) | VNode \| slot | - |  |
| v-model:value | Selected option | string \| string\[] \| { key: string, label: string \| vNodes } \| Array&lt;{ key: string, label: string \| vNodes }> | - |  |
| variant | Variants of selector | `'outlined'` \| `'borderless'` \| `'filled'` \| `'underlined'` | `'outlined'` | 4.3.0 |
| virtual | Disable virtual scroll when set to false | boolean | true | 3.0 |

### showSearch

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| filterOption | If true, filter options by input, if function, filter options against it | boolean \| function(inputValue, option) | true | 4.3.0 |
| onSearch | Called when searching items | function(value: string) | - | 4.3.0 |

### events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| blur | Called when leaving the component | function() |  |
| change | Called when select an option or input value change, or value of input is changed | function(value) |  |
| clear | Called when clear | function() | 3.3.0 |
| ~~dropdownVisibleChange~~ | Call when dropdown open (deprecated, please use `openChange` instead) | function(open) |  |
| focus | Called when entering the component | function() |  |
| openChange | Called when dropdown open state changes | function(open: boolean) | 4.3.0 |
| search | Called when searching items | function(value) |  |
| select | Called when an option is selected. Param is option's value and option instance | function(value, option) |  |

## Methods

| Name    | Description  | Version |
| ------- | ------------ | ------- |
| blur()  | remove focus |         |
| focus() | get focus    |         |

## FAQ

### Part of the api in v2 are not available in v3?

AutoComplete is an Input component that supports auto complete tips. As such, it should not support props like `labelInValue` that affect value display. In v3, the AutoComplete implementation can not handle the case where the `value` and `label` are identical. v4 not longer support `label` as the value input.

Besides, to unify the API, `dataSource` is replaced with `options`. You can migrate with the following change:

#### v2

```ts
dataSource = ['light', 'bamboo'];
// or
dataSource = [
  { value: 'light', text: 'Light' },
  { value: 'bamboo', text: 'Bamboo' },
];
```

#### v3

```ts
options = [
  { value: 'light', label: 'Light' },
  { value: 'bamboo', label: 'Bamboo' },
];
```
