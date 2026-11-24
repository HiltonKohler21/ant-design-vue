---
category: Components
cols: 1
type: Navigation
title: Menu
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*KeyQQL5iKkkAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Vn4XSqJFAxcAAAAAAAAAAAAADrJ8AQ/original
---

A versatile menu for navigation.

## When To Use

Navigation is an important part of any website, as a good navigation setup allows users to move around the site quickly and efficiently. Ant Design offers two navigation options: top and side. Top navigation provides all the categories and functions of the website. Side navigation provides the multi-level structure of the website.

More layouts with navigation: [Layout](/components/layout).

## Notes for developers

- Menu is rendered as a `ul` element, so it only supports [`li` and `script-supporting` elements](https://html.spec.whatwg.org/multipage/grouping-content.html#the-ul-element) as children nodes。Your customized node should be wrapped by `Menu.Item`.
- Menu needs to collect its node structure, so its children should be `Menu.*` or encapsulated HOCs.
- Must set unique key for `SubMenu`

## API

### Menu

| Param | Description | Type | Default value | Version |
| --- | --- | --- | --- | --- |
| classNames | Customize class for each semantic structure inside the component. Supports object or function. | Record<SemanticDOM, string> \| (info: { props: MenuProps }) => Record<SemanticDOM, string> | - | 4.3.0 |
| defaultOpenKeys | Array with the keys of default opened sub menus | (string \| number)[] | - | 4.3.0 |
| defaultSelectedKeys | Array with the keys of default selected menu items | (string \| number)[] | - | 4.3.0 |
| expandIcon | Custom expand icon of submenu | VueNode \| `(props: SubMenuProps & { isOpen: boolean }) => VueNode` | - |  |
| forceSubMenuRender | render submenu into DOM before it shows | boolean | false |  |
| inlineCollapsed | specifies the collapsed status when menu is inline mode | boolean | - |  |
| inlineIndent | indent px of inline menu item on each level | number | 24 |  |
| items | Menu item content | [ItemType\[\]](#itemtype) | - | 4.0 |
| mode | type of the menu; `vertical`, `horizontal`, and `inline` modes are supported | `vertical` \| `horizontal` \| `inline` | `vertical` |  |
| multiple | Allow selection of multiple items | boolean | false |  |
| openKeys(v-model) | array with the keys of currently opened sub menus | (string \| number)[] | - |  |
| overflowedIndicator | Customized the ellipsis icon when menu is collapsed horizontally | VueNode \| slot | `<EllipsisOutlined />` |  |
| popupRender | Custom popup renderer for submenu | `(node: VNode, info: { item: SubMenuProps; keys: Key[] }) => VueNode` | - | 4.3.0 |
| rootClassName | Class name of the root element | string | - | 4.3.0 |
| selectable | allow selecting menu items | boolean | true |  |
| selectedKeys(v-model) | array with the keys of currently selected menu items | (string \| number)[] | - |  |
| style | style of the root node | CSSProperties | - |  |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record<SemanticDOM, CSSProperties> \| (info: { props: MenuProps }) => Record<SemanticDOM, CSSProperties> | - | 4.3.0 |
| subMenuCloseDelay | delay time to hide submenu when mouse leave, unit: second | number | 0.1 |  |
| subMenuOpenDelay | delay time to show submenu when mouse enter, unit: second | number | 0 |  |
| theme | color theme of the menu | `light` \| `dark` | `light` |  |
| tooltip | Config tooltip props for menu items in inline collapsed mode. Set to `false` to disable. | false \| TooltipProps | - | 4.3.0 |
| triggerSubMenuAction | method of trigger submenu | `click` \| `hover` | `hover` |  |

> `SemanticDOM` slots: `root` \| `item` \| `itemIcon` \| `itemContent` \| `itemTitle` \| `list` \| `popup` (`{ root }` or string/CSSProperties) \| `subMenu` (`{ item, itemTitle, list, itemIcon, itemContent }`).

### Menu Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| click | callback executed when a menu item is clicked | function({ item, key, keyPath }) |
| deselect | callback executed when a menu item is deselected, only supported for multiple mode | function({ item, key, selectedKeys }) |
| openChange | called when open/close sub menu | function(openKeys: (string \| number)[]) |
| select | callback executed when a menu item is selected | function({ item, key, selectedKeys }) |

### Menu.Item

| Param    | Description                          | Type             | Default value | Version |
| -------- | ------------------------------------ | ---------------- | ------------- | ------- |
| disabled | whether menu item is disabled or not | boolean          | false         |         |
| icon     | The icon of the menu item            | slot             |               | 2.8.0   |
| key      | unique id of the menu item           | string \| number |               |         |
| title    | set display title for collapsed item | string \| slot   |               |         |

### ItemType

> type ItemType = [MenuItemType](#menuitemtype) | [SubMenuType](#submenutype) | [MenuItemGroupType](#menuitemgrouptype) | [MenuDividerType](#menudividertype);

#### MenuItemType

| Param | Description | Type | Default value | Version |
| --- | --- | --- | --- | --- |
| danger | Display the danger style | boolean | false |  |
| disabled | Whether menu item is disabled | boolean | false |  |
| extra | The extra of the menu item | VueNode | - | 4.3.0 |
| icon | The icon of the menu item | VueNode \| (item: MenuItemType) => VNode | - |  |
| key | Unique ID of the menu item | string \| number | - |  |
| label | Menu label | VueNode | - |  |
| title | Set display title for collapsed item | string | - |  |

#### SubMenuType

<!-- prettier-ignore -->
| Property | Description | Type | Default value | Version |
| --- | --- | --- | --- | --- |
| children | Sub-menus or sub-menu items | [ItemType\[\]](#itemtype) | - |  |
| disabled | Whether sub-menu is disabled | boolean | false |  |
| icon | Icon of sub menu | VueNode \| (item: SubMenuType) => VueNode | - |  |
| key | Unique ID of the sub-menu | string \| number | - |  |
| label | Menu label | VueNode | - |  |
| popupClassName | Sub-menu class name, not working when `mode="inline"` | string | - |  |
| popupOffset | Sub-menu offset, not working when `mode="inline"` | \[number, number] | - |  |
| popupRender | Custom popup renderer for current sub-menu | `(node: VNode, info: { item: SubMenuProps; keys: Key[] }) => VueNode` | - | 4.3.0 |
| theme | Color theme of the SubMenu (inherits from Menu by default) | `light` \| `dark` | - |  |
| onTitleClick | Callback executed when the sub-menu title is clicked | function({ key, domEvent }) | - |  |

#### MenuItemGroupType

Define `type` as `group` to make as group:

```ts
const groupItem = {
  type: 'group', // Must have
  label: 'My Group',
  children: [],
};
```

| Param    | Description            | Type                              | Default value | Version |
| -------- | ---------------------- | --------------------------------- | ------------- | ------- |
| children | Sub-menu items         | [MenuItemType\[\]](#menuitemtype) | -             |         |
| label    | The title of the group | VueNode                           | -             |         |

#### MenuDividerType

Divider line in between menu items, only used in vertical popup Menu or Dropdown Menu. Need define the `type` as `divider`：

```ts
const dividerItem = {
  type: 'divider', // Must have
};
```

| Param  | Description            | Type    | Default value | Version |
| ------ | ---------------------- | ------- | ------------- | ------- |
| dashed | Whether line is dashed | boolean | false         |         |

### Menu.SubMenu

| Param | Description | Type | Default value | Version |
| --- | --- | --- | --- | --- |
| disabled | whether sub menu is disabled or not | boolean | false |  |
| expandIcon | Customized expandIcon | slot | arrow icon |  |
| icon | Icon of sub menu | slot |  | 2.8.0 |
| key | Unique ID of the sub menu, required | string \| number |  |  |
| popupClassName | Sub-menu class name | string |  | 1.5.0 |
| popupOffset | Sub-menu offset, not working when `mode="inline"` | \[number, number] | - |  |
| title | title of the sub menu | string\|slot |  |  |

The children of Menu.SubMenu must be `MenuItem` or `SubMenu`.

`SubMenu` must pass the key. If it is not passed, the sub-elements under the SubMenu will be rendered in advance, and some scenes cannot be effectively highlighted.

### Menu.SubMenu Events

| Events Name | Description                                          | Arguments                   |
| ----------- | ---------------------------------------------------- | --------------------------- |
| titleClick  | callback executed when the sub menu title is clicked | function({ key, domEvent }) |

### Menu.ItemGroup

| Param    | Description        | Type         | Default value |
| -------- | ------------------ | ------------ | ------------- |
| children | sub-menu items     | MenuItem\[]  |               |
| title    | title of the group | string\|slot |               |

The children of Menu.ItemGroup must be `MenuItem`.

### Menu.Divider

Divider line in between menu items, only used in vertical popup Menu or Dropdown Menu.

| Param  | Description            | Type    | Default value | Version |
| ------ | ---------------------- | ------- | ------------- | ------- |
| dashed | Whether line is dashed | boolean | false         | 4.17.0  |

## FAQ

### Why will Menu's children be rendered twice?

Menu collects structure info with twice-render to support HOC usage. Merging into one render may cause the logic to become much more complex. Contributions to help improve the collection logic are welcomed.
