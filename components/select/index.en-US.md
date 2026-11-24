---
category: Components
type: Data Entry
title: Select
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*qGSbQJ0POEsAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*a6ggRInInJ4AAAAAAAAAAAAADrJ8AQ/original
---

Select component to select value from options.

## When To Use

- A dropdown menu for displaying choices - an elegant alternative to the native `<select>` element.
- Utilizing [Radio](/components/radio/) is recommended when there are fewer total options (less than 5).

## API

```html
<a-select>
  <a-select-option value="lucy">lucy</a-select-option>
</a-select>
```

### Select props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Show clear button. | boolean | false |  |
| autoClearSearchValue | Whether the current search will be cleared on selecting an item. Only applies when `mode` is set to `multiple` or `tags`. | boolean | true |  |
| autofocus | Get focus by default | boolean | false |  |
| bordered | Whether has border style (Deprecated, please use `variant` instead) | boolean | true |  |
| classNames | Semantic DOM class names (supports object and function `({ props }) => ...`) | `{ root?: string; prefix?: string; suffix?: string; popup?: { root?: string } } \| ((info: { props: SelectProps }) => ...)` | - | 4.3.0 |
| clearIcon | The custom clear icon | VNode \| slot | - |  |
| defaultActiveFirstOption | Whether active first option by default | boolean | true |  |
| defaultOpen | Initial open state of dropdown | boolean | - |  |
| defaultValue | Initial selected option | string \| string\[] \| number \| number\[] \| LabeledValue \| LabeledValue\[] | - |  |
| disabled | Whether disabled select | boolean | false |  |
| popupClassName | className of dropdown menu (Deprecated, please use `classNames.popup.root` instead) | string | - | 4.0 |
| popupMatchSelectWidth | Determine whether the dropdown menu and the select input are the same width. Default set `min-width` same as input. Will ignore when value less than select width. `false` will disable virtual scroll | boolean \| number | true | 4.3.0 |
| popupRender | Customize dropdown content | (menu: VueNode) => VueNode \| slot | - | 4.3.0 |
| dropdownMatchSelectWidth | Determine whether the dropdown menu and the select input are the same width (Deprecated, please use `popupMatchSelectWidth` instead). Default set `min-width` same as input. Will ignore when value less than select width. `false` will disable virtual scroll | boolean \| number | true |  |
| dropdownMenuStyle | additional style applied to dropdown menu | object | - |  |
| dropdownRender | Customize dropdown content (Deprecated, please use `popupRender` instead) | ({menuNode: VNode, props}) => VNode \| v-slot | - |  |
| dropdownStyle | style of dropdown menu (Deprecated, please use `styles.popup.root` instead) | object | - |  |
| fieldNames | Customize node label, value, options field name | object | { label: `label`, value: `value`, options: `options` } | 3.0 |
| filterOption | If true, filter options by input, if function, filter options against it. The function will receive two arguments, `inputValue` and `option`, if the function returns `true`, the option will be included in the filtered set; Otherwise, it will be excluded. | `boolean` \| `function(inputValue, option)` | true |  |
| filterSort | Sort function for search options sorting, see [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)'s compareFunction | (optionA: Option, optionB: Option, info?: { searchValue: string }) => number | - | 3.0 (`searchValue`: 4.3.0) |
| firstActiveValue | Value of action option by default | string \| string\[] | - |  |
| getPopupContainer | Parent Node which the selector should be rendered to. Default to `body`. When position issues happen, try to modify it into scrollable content and position it relative. | function(triggerNode) | () => document.body |  |
| labelInValue | whether to embed label in value, turn the format of value from `string` to `{key: string, label: vNodes, originLabel: any}`, originLabel (3.1) maintains the original type. If the node is constructed through a-select-option children, the value is a function (the default slot of a-select-option) | boolean | false |  |
| labelRender | Customize selected label render (supports prop and `#labelRender` slot) | (props: { label: any; value: any; key?: any }) => VueNode \| slot | - | 4.3.0 |
| listHeight | Config popup height | number | 256 |  |
| loading | indicate loading state | boolean | false |  |
| loadingIcon | Custom loading icon when `loading` is `true` | VNode \| slot | `<LoadingOutlined spin />` | 4.3.0 |
| maxCount | The max number of items can be selected, only applies when `mode` is `multiple` or `tags` | number | - | 4.3.0 |
| maxTagCount | Max tag count to show | number \| `responsive` | - |  |
| maxTagPlaceholder | Placeholder for not showing tags | slot \| function(omittedValues) | - |  |
| maxTagTextLength | Max text length to show | number | - |  |
| menuItemSelectedIcon | The custom menuItemSelected icon | VNode \| slot | - |  |
| mode | Set mode of Select | 'multiple' \| 'tags' | - |  |
| notFoundContent | Specify content to show when no result matches.. | string\|slot | `Not Found` |  |
| open | Controlled open state of dropdown | boolean | - |  |
| option | custom render option by slot | v-slot:option="{value, label, [disabled, key, title]}" | - | 2.2.5 |
| optionFilterProp | Which prop value of option will be used for filter if filterOption is true. Supports `string[]` for multi-field OR search | string \| string\[] | value | `string[]`: 4.3.0 |
| optionLabelProp | Which prop value of option will render as content of select. | string | `children` \| `label`(when use options) |  |
| optionRender | Customize the rendering of dropdown options (supports prop and `#optionRender` slot) | (option: { data, label, value, key }, info: { index: number }) => VueNode \| slot | - | 4.3.0 |
| options | Data of the selectOption, manual construction work is no longer needed if this property has been set | Array&lt;{value, label, [disabled, key, title]}> | \[] |  |
| placeholder | Placeholder of select | string\|slot | - |  |
| placement | The position where the selection box pops up | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft | 3.3.0 |
| prefix | The custom prefix | VNode \| slot | - | 4.3.0 |
| removeIcon | The custom remove icon | VNode \| slot | - |  |
| rootClassName | Root class name | string | - | 4.3.0 |
| searchValue | The current input "search" text | string | - |  |
| showArrow | Whether to show the drop-down arrow | boolean | single:true, multiple:false |  |
| showSearch | Whether select is searchable, supports object config | boolean \| [showSearch](#showsearch) | single:false, multiple:true | Object: 4.3.0 |
| size | Size of Select input. `middle` `large` `small` | string | middle |  |
| status | Set validation status | 'error' \| 'warning' | - | 3.3.0 |
| styles | Semantic DOM inline styles (supports object and function `({ props }) => ...`) | `{ root?: CSSProperties; prefix?: CSSProperties; suffix?: CSSProperties; popup?: { root?: CSSProperties } } \| ((info: { props: SelectProps }) => ...)` | - | 4.3.0 |
| suffix | The custom suffix icon (replaces `suffixIcon`) | VNode \| slot | - | 4.3.0 |
| ~~suffixIcon~~ | The custom suffix icon (deprecated, please use `suffix` instead) | VNode \| slot | - |  |
| tagRender | Customize tag render, only applies when `mode` is set to `multiple` or `tags` | slot \| (props) => any | - |  |
| tokenSeparators | Separator used to tokenize or custom tokenizer function, applies when `mode="tags"` or `mode="multiple"` | string\[] \| ((input: string) => string\[]) | - | function: 4.3.0 |
| value(v-model) | Current selected option. | string\|number\|string\[]\|number\[] | - |  |
| variant | Variants of selector | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 4.3.0 |
| virtual | Disable virtual scroll when set to false | boolean | true | 3.0 |

> Note, if you find that the drop-down menu scrolls with the page, or you need to trigger Select in other popup layers, please try to use `getPopupContainer={triggerNode => triggerNode.parentElement}` to fix the drop-down popup rendering node in the parent element of the trigger .

### showSearch

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoClearSearchValue | Whether the current search will be cleared on selecting an item. Only applies when `mode` is set to `multiple` or `tags` | boolean | true | 4.3.0 |
| filterOption | If true, filter options by input, if function, filter options against it | boolean \| function(inputValue, option) | true | 4.3.0 |
| filterSort | Sort function for search options sorting | (optionA: Option, optionB: Option, info?: { searchValue: string }) => number | - | 4.3.0 |
| optionFilterProp | Which prop value(s) of option will be used for filter (supports `string[]` OR matching) | string \| string\[] | `value` | 4.3.0 |
| searchValue | The current input "search" text | string | - | 4.3.0 |
| onSearch | Callback function that is fired when input changed | function(value: string) | - | 4.3.0 |

### events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| blur | Called when blur | function |  |
| change | Called when select an option or input value change, or value of input is changed in combobox mode | function(value, option:Option \| Array&lt;Option>) |  |
| deselect | Called when a option is deselected, the params are option's value (or key) . only called for multiple or tags, effective in multiple or tags mode only. | function(value, option:Option) |  |
| dropdownVisibleChange | Called when dropdown open (Deprecated, please use `openChange` instead) | function(open) |  |
| focus | Called when focus | function |  |
| inputKeyDown | Called when key pressed | function |  |
| mouseenter | Called when mouse enter | function |  |
| mouseleave | Called when mouse leave | function |  |
| openChange | Called when dropdown open | function(open) | 4.3.0 |
| popupScroll | Called when dropdown scrolls | function |  |
| search | Callback function that is fired when input changed. | function(value: string) |  |
| select | Called when a option is selected, the params are option's value (or key) and option instance. | function(value, option:Option) |  |

### Select Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | Remove focus |
| focus() | Get focus    |

### Option props

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| class | additional class to option | string | - |
| disabled | Disable this option | boolean | false |
| key | Same usage as `value`. If Vue request you to set this property, you can set it to value of option, and then omit value property. | string |  |
| title | `title` of Select after select this Option | string | - |
| value | default to filter with this property | string\|number | - |

### OptGroup props

| Property | Description | Type         | Default |
| -------- | ----------- | ------------ | ------- |
| key      |             | string       | -       |
| label    | Group label | string\|slot | -       |

## FAQ

### The dropdown is closed when click `dropdownRender` area?

Dropdown menu will be closed if click `dropdownRender` area, you can prevent the default behavior of a click event, See the [dropdownRender example](#components-select-demo-custom-dropdown-menu).

### Why is `placeholder` not displayed?

`placeholder` will only be displayed when `value = undefined`, and other values such as null, 0,'', etc. are meaningful values for the JS language.

You can check [JS Language Specification](https://262.ecma-international.org/5.1/#sec-4.3.9) for further details.

You can also check [antd issue](https://github.com/ant-design/ant-design/issues/2367) to view the discussion.
