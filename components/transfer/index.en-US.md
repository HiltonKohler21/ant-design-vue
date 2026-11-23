---
category: Components
type: Data Entry
title: Transfer
cols: 1
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*fkfzT5BbwNIAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*g9vUQq2nkpEAAAAAAAAAAAAADrJ8AQ/original
---

Double column transfer choice box.

## When To Use

- It is a fair way to select or transfer multiple items from one column to another.
- Compared with Select and TreeSelect, Transfer occupies more space and can display more information about options.

Transfer the elements between two columns in an intuitive and efficient way.

One or more elements can be selected from either column, one click on the proper `direction` button, and the transfer is done. The left column is considered the `source` and the right column is considered the `target`. As you can see in the API description, these names are reflected in.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actions | A set of operations sorted from top to bottom (takes priority over `operations`). Accepts strings or custom VueNodes | VueNode\[] | \['>', '&lt;'] | 4.3.0 |
| classNames | Customize class for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, string> \| (info: { props }) => Record<SemanticDOM, string>` | - | 4.3.0 |
| dataSource | Used for setting the source data. The elements that are part of this array will be present the left column. Except the elements whose keys are included in `targetKeys` prop. | \[{key: string.isRequired,title: string.isRequired,description: string,disabled: bool}] | \[] |  |
| disabled | Whether disabled transfer | boolean | false |  |
| filterOption | A function to determine whether an item should show in search result list | (inputValue, option): boolean |  |  |
| footer | customize the progress dot by setting a scoped slot | slot="footer" slot-scope="props" |  |  |
| listStyle | A custom CSS style used for rendering the transfer columns. | CSSProperties |  |  |
| locale | i18n text including filter, empty text, item unit, `deselectAll` (4.3.0), etc | object | `{ itemUnit: 'item', itemsUnit: 'items', notFoundContent: 'The list is empty', searchPlaceholder: 'Search here' }` |  |
| oneWay | Display as single direction style | boolean | false | 3.0.0 |
| ~~operations~~ | A set of operations that are sorted from top to bottom, please use `actions` instead | string\[] | \['>', '&lt;'] |  |
| operationStyle | A custom CSS style used for rendering the operations column | CSSProperties | - | 3.0.0 |
| pagination | Use pagination. Not work in render props | boolean \| { pageSize: number, simple: boolean, showSizeChanger?: boolean, showLessItems?: boolean } | false | 3.0.0 |
| render | The function to generate the item shown on a column. Based on an record (element of the dataSource array), this function should return a element which is generated from that record. Also, it can return a plain object with `value` and `label`, `label` is a element and `value` is for title | Function(record) \| slot |  |  |
| rootClassName | The class name of the root element | string | - | 4.3.0 |
| selectAllLabels | A set of customized labels for select all checkboxes on the header | VueNode \| ((info: { selectedCount: number; totalCount: number }) => VueNode); | - | 3.0.0 |
| selectedKeys(v-model) | A set of keys of selected items. | string\[] | \[] |  |
| selectionsIcon | Custom dropdown icon | VueNode | - | 4.3.0 |
| showSearch | If included, a search box is shown on each column. | boolean | false |  |
| showSelectAll | Show select all checkbox on the header | boolean | true |  |
| status | Set validation status | 'error' \| 'warning' | - | 3.3.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function | `Record<SemanticDOM, CSSProperties> \| (info: { props }) => Record<SemanticDOM, CSSProperties>` | - | 4.3.0 |
| targetKeys(v-model) | A set of keys of elements that are listed on the right column. | string\[] | \[] |  |
| titles | A set of titles that are sorted from left to right. | string\[] | - |  |

> Supported `SemanticDOM` keys: `root` \| `section` \| `header` \| `title` \| `body` \| `list` \| `item` \| `itemIcon` \| `itemContent` \| `footer` \| `actions` (and optional `source` / `target` nested overrides).

### Events

| Events Name | Description | Arguments | Version |
| --- | --- | --- | --- |
| change | A callback function that is executed when the transfer between columns is complete. | (targetKeys, direction, moveKeys): void |  |
| scroll | A callback function which is executed when scroll options list | (direction, event): void |  |
| search | A callback function which is executed when search field are changed | (direction: 'left'\|'right', value: string): void | - |
| selectChange | A callback function which is executed when selected items are changed. | (sourceSelectedKeys, targetSelectedKeys): void |  |

### Render Props

Transfer accept `children` to customize render list, using follow props:

```json
{
  "direction": String,
  "disabled": Boolean,
  "filteredItems": Array,
  "selectedKeys": Array,
  "onItemSelect": Function,
  "onItemSelectAll": Function
}
```

| Property        | Description             | Type                                 | Version |
| --------------- | ----------------------- | ------------------------------------ | ------- |
| direction       | List render direction   | 'left' \| 'right'                    |         |
| disabled        | Disable list or not     | boolean                              |         |
| filteredItems   | Filtered items          | TransferItem\[]                      |         |
| selectedKeys    | Selected items          | string\[]                            |         |
| onItemSelect    | Select item             | (key: string, selected: boolean)     |         |
| onItemSelectAll | Select a group of items | (keys: string\[], selected: boolean) |         |

#### example

```html
<a-transfer>
  <template
    #children="{
      direction,
      filteredItems,
      selectedKeys,
      disabled: listDisabled,
      onItemSelectAll,
      onItemSelect,
    }"
  >
    <your-component />
  <template>
</a-transfer>
```

## Warning

According the standard of Vue, the key should always be supplied directly to the elements in the array. In Transfer, the keys should be set on the elements included in `dataSource` array. By default, `key` property is used as an unique identifier.

If there's no `key` in your data, you should use `rowKey` to specify the key that will be used for uniquely identify each element.

```jsx
// eg. your primary key is `uid`
return <Transfer :rowKey="record => record.uid" />;
```
