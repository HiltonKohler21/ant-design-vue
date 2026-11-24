---
category: Components
type: Data Entry
title: Cascader
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*ngTnQZNOcK0AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Nt8xR7afyr0AAAAAAAAAAAAADrJ8AQ/original
---

Cascade selection box.

## When To Use

- When you need to select from a set of associated data set. Such as province/city/district, company level, things classification.
- When selecting from a large data set, with multi-stage classification separated for easy selection.
- Chooses cascade items in one float layer for better user experience.

## API

```html
<a-cascader :options="options" v-model:value="value" />
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Whether allow clear | boolean | true |  |
| autoClearSearchValue | Whether the current search will be cleared on selecting an item. Only applies when `multiple` is `true` | boolean | true | 4.3.0 |
| autofocus | Get focus when component mounted | boolean | false |  |
| ~~bordered~~ | Whether has border style (deprecated, please use `variant` instead) | boolean | true | 3.2 |
| classNames | Customize class for each semantic structure inside the component (supports object and function `({ props }) => ...`) | `{ root?: string; prefix?: string; suffix?: string; popup?: { root?: string } } \| ((info: { props: CascaderProps }) => ...)` | - | 4.3.0 |
| clearIcon | The custom clear icon | slot | - | 3.2 |
| changeOnSelect | (Work on single select) change value on each selection if set to true, see above demo for details | boolean | false |  |
| defaultOpen | Initial visible of cascader popup | boolean | - |  |
| defaultValue | Initial selected value | string\[] \| number\[] | \[] |  |
| disabled | Whether disabled select | boolean | false |  |
| displayRender | Render function of displaying selected options, you can use #displayRender="{labels, selectedOptions}". | `({labels, selectedOptions}) => VNode` | `labels => labels.join(' / ')` |  |
| ~~dropdownMenuColumnStyle~~ | The style of the drop-down menu column (deprecated, please use `popupMenuColumnStyle` instead) | CSSProperties | - |  |
| ~~dropdownRender~~ | Customize dropdown content (deprecated, please use `popupRender` instead) | `({ menuNode, props }) => VNode` \| slot | - |  |
| ~~dropdownStyle~~ | Additional style of popup overlay (deprecated, please use `styles.popup.root` instead) | CSSProperties | {} | 3.0 |
| expandIcon | Customize the current item expand icon | slot | - | 3.0 |
| expandTrigger | Expand current item when click or hover | `click` \| `hover` | 'click' |  |
| fieldNames | Custom field name for label and value and children | object | `{ label: 'label', value: 'value', children: 'children' }` |  |
| getPopupContainer | Parent Node which the selector should be rendered to. Default to `body`. When position issues happen, try to modify it into scrollable content and position it relative. | Function(triggerNode) | () => document.body |  |
| loadData | To load option lazily, and it cannot work with `showSearch` | `(selectedOptions) => void` | - |  |
| loadingIcon | Customize the loading icon | VNode \| slot | - | 4.3.0 |
| maxTagCount | Max tag count to show. `responsive` will cost render performance | number \| `responsive` | - | 3.0 |
| maxTagPlaceholder | Placeholder for not showing tags | v-slot \| function(omittedValues) | - | 3.0 |
| maxTagTextLength | Max tag text length to show | number | - |  |
| multiple | Support multiple or not | boolean | - | 3.0 |
| notFoundContent | Specify content to show when no result matches. | string \| slot | 'Not Found' |  |
| open | Set visible of cascader popup | boolean | - | 3.0 |
| options | Data options of cascade | [Option](#option)\[] | - |  |
| placeholder | Input placeholder | string | 'Please select' |  |
| placement | Use preset popup align config from builtinPlacements | `bottomLeft` \| `bottomRight` \| `topLeft` \| `topRight` | `bottomLeft` | 3.0 |
| ~~popupClassName~~ | Additional className of popup overlay (deprecated, please use `classNames.popup.root` instead) | string | - | 4.0 |
| popupMenuColumnStyle | The style of the drop-down menu column | CSSProperties | - | 4.3.0 |
| popupRender | Customize popup content, receives the menu VNode `menuNode` directly (supports prop and `#popupRender` slot, replaces `dropdownRender`) | `(menuNode: VNode) => VNode` \| slot | - | 4.3.0 |
| prefix | The custom prefix | VNode \| slot | - | 4.3.0 |
| removeIcon | The custom remove icon | slot | - | 3.2 |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| searchValue | Set search value, need work with `showSearch` | string | - | 3.0 |
| showCheckedStrategy | The way show selected item in box. **`SHOW_CHILD`:** just show child treeNode. **`Cascader.SHOW_PARENT`:** just show parent treeNode (when all child treeNode under the parent treeNode are checked) | `Cascader.SHOW_PARENT` \| `Cascader.SHOW_CHILD` | `Cascader.SHOW_PARENT` | 3.3.0 |
| showSearch | Whether show search input in single mode. | boolean \| [object](#showsearch) | false |  |
| size | Input size | `large` \| `default` \| `small` | `default` |  |
| status | Set validation status | `'error'` \| `'warning'` | - | 3.3.0 |
| styles | Customize inline style for each semantic structure inside the component (supports object and function `({ props }) => ...`) | `{ root?: CSSProperties; prefix?: CSSProperties; suffix?: CSSProperties; popup?: { root?: CSSProperties } } \| ((info: { props: CascaderProps }) => ...)` | - | 4.3.0 |
| suffix | The custom suffix icon (replaces `suffixIcon`) | string \| VNode \| slot | - | 4.3.0 |
| ~~suffixIcon~~ | The custom suffix icon (deprecated, please use `suffix` instead) | string \| VNode \| slot | - |  |
| tagRender | Customize tag render when `multiple` | slot | - | 3.0 |
| value(v-model) | Selected value | string\[] \| number\[] | - |  |
| variant | Variants of selector | `'outlined'` \| `'borderless'` \| `'filled'` \| `'underlined'` | `'outlined'` | 4.3.0 |

### showSearch

Fields in `showSearch`:

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| filter | The function will receive two arguments, inputValue and option, if the function returns true, the option will be included in the filtered set; Otherwise, it will be excluded. | `function(inputValue, path): boolean` |  |
| limit | Set the count of filtered items | number \| false | 50 |
| matchInputWidth | Whether the width of result list equals to input's | boolean |  |
| render | Used to render filtered options, you can use #showSearchRender="{inputValue, path}" | `function({inputValue, path}): VNode` |  |
| sort | Used to sort filtered options. | `function(a, b, inputValue)` |  |

### events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| change | Callback when finishing cascader select | `(value, selectedOptions) => void` |  |
| ~~dropdownVisibleChange~~ | Callback when popup shown or hidden (deprecated, please use `openChange` instead) | `(value) => void` | 3.0 |
| openChange | Callback when popup shown or hidden | `(open: boolean) => void` | 4.3.0 |
| search | Callback when input value change | `(value) => void` | 3.0 |

### Option

```ts
interface Option {
  value: string | number;
  label?: VNode;
  disabled?: boolean;
  children?: Option[];
  // Determines if this is a leaf node(effective when `loadData` is specified).
  // `false` will force trade TreeNode as a parent node.
  // Show expand icon even if the current node has no children.
  isLeaf?: boolean;
}
```

## Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | remove focus |
| focus() | get focus    |

### Cascader.Panel

> Available since `4.3.0`. Can be used as `<a-cascader-panel>` or `<Cascader.Panel>`.

Renders the cascader menu panel directly without a dropdown popup. Supports `value(v-model)`, `defaultValue`, `options`, `fieldNames`, `multiple`, `changeOnSelect`, `showCheckedStrategy`, `expandTrigger`, `loadData`, `disabled`, `notFoundContent`, `expandIcon`, `loadingIcon`, `direction`, `rootClassName`, `popupMenuColumnStyle`, and `change` event (same API as `Cascader`).
